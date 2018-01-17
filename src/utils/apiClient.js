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

function getAccessToken() {
	return window.localStorage.getItem('accessToken');
}

function getRefreshToken() {
	return window.localStorage.getItem('refreshToken');
}

function makeRequest(path, { method = 'GET', headers = {}, body, requiresAuth, query, requestCount = 0 }) {
	const fetchOpts = {
			method,
			headers
		},
		queryString = query ? urlUtil.format({query}) : '';

	if(body) {
		fetchOpts.headers['Content-Type'] = 'application/json';
		fetchOpts.body = JSON.stringify(body);
	}

	if(requiresAuth) {
		fetchOpts.headers['Authorization'] = `Bearer ${getAccessToken()}`;
	}

	return fetch(API_HOST + '/v1' + path + queryString, fetchOpts)
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
			if(response.status >= 400) throw new APIError({message: response.statusText, responseBody: response.json(), statusCode: response.status});

			return response;
		})
		.then(response => response.json())
		.catch(err => {
			// If it was a 401, get a new access token here, then make the original request again
			// If there is no refresh token (user has been logged out already for a 403), skip the request
			if(err.statusCode === 401 && requestCount++ < 10 && getRefreshToken()) {
				return makeRequest('/refresh-access-token', {method: 'POST', body: {refreshToken: getRefreshToken()}})
					.then(({ accessToken }) => window.localStorage.setItem('accessToken', accessToken))
					.then(() => makeRequest(path, {method, headers, body, requiresAuth, query, requestCount}));
			} else if(err.statusCode === 401){
				// After 10 attempts, clear the user data and redirect the page
				window.localStorage.removeItem('accessToken');
				window.localStorage.removeItem('refreshToken');
				window.location.assign('/login');
			}

			throw err;
		});
}

const apiClient = {
	get(path, { query, requiresAuth }) {
		return makeRequest(path, { query, requiresAuth });
	},

	post(path, body, { requiresAuth } = {}) {
		return makeRequest(path, { method: 'POST', body, requiresAuth });
	},

	patch(path, body, { requiresAuth } = {}) {
		return makeRequest(path, { method: 'PATCH', body, requiresAuth });
	}
};

export default apiClient;
