import { API_HOST } from '@/config';

interface APIErrorSettings {
	message?: string;
	statusCode?: number;
	requestPath?: string;
	requestData?: Record<string, unknown>;
	responseBody?: unknown;
}

/**
 * Custom error type for Mustachebash API
 */
class APIError extends Error {
	statusCode: number | null;
	requestPath: string | null;
	requestData: Record<string, unknown> | null;
	responseBody: unknown;

	constructor(settings: string | APIErrorSettings) {
		super();

		// Accept string only errors
		let config: APIErrorSettings;
		if (typeof settings === 'string') {
			config = { message: settings };
		} else {
			config = settings || {};
		}

		this.name = 'APIError';
		this.message = config.message || 'An unknown error occurred';
		this.statusCode = config.statusCode || null;
		this.requestPath = config.requestPath || null;
		this.requestData = config.requestData || null;
		this.responseBody = config.responseBody || null;

		// Don't log passwords - just set it to a boolean if it was present and a string
		if (this.requestData && typeof this.requestData.password === 'string') {
			this.requestData.password = true;
		}
	}
}

const API_VERSION = 'v1';

function getAccessToken(): string | null {
	return window.localStorage.getItem('accessToken');
}

function getRefreshToken(): string | null {
	return window.localStorage.getItem('refreshToken');
}

interface RequestOptions {
	method?: string;
	body?: Record<string, unknown>;
	query?: Record<string, string | number | boolean>;
	requestCount?: number;
}

function makeRequest<T = any>(path: string, { method = 'GET', body, query, requestCount = 0 }: RequestOptions = {}): Promise<T> {
	const reqOpts: RequestInit = {
		method,
		headers: new Headers()
	};
	const queryString = query ? `?${new URLSearchParams(query as Record<string, string>).toString()}` : '';

	if (body) {
		(reqOpts.headers as Headers).append('Content-Type', 'application/json');
		reqOpts.body = JSON.stringify(body);
	}

	if (getAccessToken()) {
		(reqOpts.headers as Headers).append('Authorization', `Bearer ${getAccessToken()}`);
	}

	const request = new Request(new URL(`/${API_VERSION}${path}${queryString}`, API_HOST), reqOpts);

	return fetch(request)
		.then(response => {
			// If it's not JSON, throw and catch an error to default before it just bellyflops trying to parse the response
			const contentType = response.headers.get('Content-Type');
			if (!contentType || !contentType.includes('application/json')) {
				throw new APIError({
					message: response.statusText,
					responseBody: response.text(),
					statusCode: response.status,
					requestPath: path
				});
			}

			return response;
		})
		.then(response => {
			// Check for HTTP error statuses, throw errors to skip processing response body
			if (!response.ok) {
				return response.json().then(errBody => {
					throw new APIError({ message: response.statusText, responseBody: errBody, statusCode: response.status });
				});
			} else {
				return response.json();
			}
		})
		.catch(err => {
			// If it was a 401, get a new access token here, then make the original request again
			// If there is no refresh token (user has been logged out already for a 403), skip the request
			if (err.statusCode === 401 && requestCount++ < 10 && getRefreshToken()) {
				return makeRequest<{ accessToken: string }>('/refresh-access-token', { method: 'POST', body: { refreshToken: getRefreshToken() } })
					.then(({ accessToken }) => window.localStorage.setItem('accessToken', accessToken))
					.then(() => makeRequest<T>(path, { method, body, query, requestCount }));
			} else if ((err.statusCode === 401 || err.statusCode === 403) && getRefreshToken()) {
				// After 10 attempts, clear the user data and redirect the page
				window.localStorage.removeItem('accessToken');
				window.localStorage.removeItem('refreshToken');
				window.location.assign('/login');
			}

			throw err;
		});
}

const apiClient = {
	get<T = any>(path: string, query?: Record<string, string | number | boolean>): Promise<T> {
		return makeRequest<T>(path, { query });
	},

	post<T = any>(path: string, body?: Record<string, unknown>): Promise<T> {
		return makeRequest<T>(path, { method: 'POST', body });
	},

	patch<T = any>(path: string, body?: Record<string, unknown>): Promise<T> {
		return makeRequest<T>(path, { method: 'PATCH', body });
	},

	delete<T = any>(path: string): Promise<T> {
		return makeRequest<T>(path, { method: 'DELETE' });
	}
};

export default apiClient;
