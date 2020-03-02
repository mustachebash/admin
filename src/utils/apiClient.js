import urlUtil from 'url';

/**
 * Custom error type for Mustachebash API
 * @param {Object|String} settings - Message or object with error information
 */
class APIError extends Error {
	constructor(settings) {
		super();

		// Accept string only errors
		if(typeof settings === 'string') {
			settings = {message: settings};
		}

		// Default if nothing is set
		settings = settings || {};

		this.name = 'APIError';

		this.message = settings.message || 'An unknown error occured';
		this.statusCode = settings.statusCode || null;
		this.requestPath = settings.requestPath || null;
		this.requestData = settings.requestData || null;
		this.responseBody = settings.responseBody || null;

		// Don't log passwords - just set it to a boolean if it was present and a string
		if(this.requestData && typeof this.requestData.password === 'string') this.requestData.password = true;
	}
}

const API_VERSION = 'v1';

function getAccessToken() {
	return window.localStorage.getItem('accessToken');
}

function getRefreshToken() {
	return window.localStorage.getItem('refreshToken');
}

function makeRequest(path, { method = 'GET', body, query, requestCount = 0 }) {
	const reqOpts = {
			method,
			headers: new Headers()
		},
		queryString = query ? urlUtil.format({query}) : '';

	if(body) {
		reqOpts.headers.append('Content-Type', 'application/json');
		reqOpts.body = JSON.stringify(body);
	}

	if(getAccessToken()) {
		reqOpts.headers.append('Authorization', `Bearer ${getAccessToken()}`);
	}

	const request = new Request(new URL(`/${API_VERSION}${path}${queryString}`, API_HOST), reqOpts);

	return fetch(request)
		.then(response => {
			// If it's not JSON, throw and catch an error to default before it just bellyflops trying to parse the response
			if(!response.headers.get('Content-Type').includes('application/json')) {
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
			if(!response.ok) {
				return response.json().then(errBody => {
					throw new APIError({message: response.statusText, responseBody: errBody, statusCode: response.status});
				});
			} else {
				return response.json();
			}
		})
		.catch(err => {
			// If it was a 401, get a new access token here, then make the original request again
			// If there is no refresh token (user has been logged out already for a 403), skip the request
			if(err.statusCode === 401 && requestCount++ < 10 && getRefreshToken()) {
				return makeRequest('/refresh-access-token', {method: 'POST', body: {refreshToken: getRefreshToken()}})
					.then(accessToken => window.localStorage.setItem('accessToken', accessToken))
					.then(() => makeRequest(path, {method, body, query, requestCount}));
			} else if((err.statusCode === 401 || err.statusCode === 403) && getRefreshToken()) {
				// After 10 attempts, clear the user data and redirect the page
				window.localStorage.removeItem('accessToken');
				window.localStorage.removeItem('refreshToken');
				window.location.assign('/login');
			}

			throw err;
		});
}

const apiClient = {
	get(path, query) {
		return makeRequest(path, { query });
	},

	post(path, body) {
		return makeRequest(path, { method: 'POST', body });
	},

	patch(path, body) {
		return makeRequest(path, { method: 'PATCH', body });
	},

	delete(path) {
		return makeRequest(path, { method: 'DELETE' });
	}
};

export default apiClient;
