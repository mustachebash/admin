/**
 * App reducer/actions/action creators
 * DUCKS!!! https://github.com/erikras/ducks-modular-redux
 */
import jwtDecode from 'jwt-decode';
import apiClient from 'utils/apiClient';

// Actions
export const LOG_IN_REQUEST = 'mustachebash/app/LOG_IN_REQUEST',
	LOGIN_ERROR = 'mustachebash/app/LOGIN_ERROR',
	RECEIVE_USER = 'mustachebash/app/RECEIVE_USER',
	SOCKET_CONNECT = 'mustachebash/app/SOCKET_CONNECT',
	SOCKET_CONNECTED = 'mustachebash/app/SOCKET_CONNECTED',
	SOCKET_DISCONNECT = 'mustachebash/app/SOCKET_DISCONNECT',
	SOCKET_DISCONNECTED = 'mustachebash/app/SOCKET_DISCONNECTED';

const defaultSessionState = {
	loginError: '',
	user: null,
	socketConnected: false
};

export default function reducer(state = {}, action = {}) {
	switch (action.type) {
		default:
			return state;
	}
}

export function sessionReducer(state = defaultSessionState, action = {}) {
	switch (action.type) {
		case RECEIVE_USER:
			return {
				...state,
				loginError: '',
				user: action.user
			};

		case LOGIN_ERROR:
			return {
				...state,
				loginError: action.error
			};

		case SOCKET_CONNECTED:
			return {
				...state,
				socketConnected: true
			};

		case SOCKET_DISCONNECTED:
			return {
				...state,
				socketConnected: false
			};

		case LOG_IN_REQUEST:
		default:
			return state;
	}
}

export function controlReducer(state = {}, action = {}) {
	switch (action.type) {
		default:
			return state;
	}
}

export function receiveUser({ accessToken, refreshToken, user }) {
	window.localStorage.setItem('accessToken', accessToken);
	window.localStorage.setItem('refreshToken', refreshToken);

	return {
		type: RECEIVE_USER,
		user
	};
}

export function logInRequest() {
	return {
		type: LOG_IN_REQUEST
	};
}

export function loginError(error) {
	return {
		type: LOGIN_ERROR,
		error
	};
}

export function socketConnect() {
	return {
		type: SOCKET_CONNECT
	};
}

export function socketConnected() {
	return {
		type: SOCKET_CONNECTED
	};
}

export function socketDisconnect() {
	return {
		type: SOCKET_DISCONNECT
	};
}

export function socketDisconnected() {
	return {
		type: SOCKET_DISCONNECTED
	};
}

export function logIn({username, password, push}) {
	return (dispatch) => {
		dispatch(logInRequest());

		return apiClient.post('/authenticate', {username, password})
			.then(({accessToken, refreshToken}) => ({accessToken, refreshToken, user: jwtDecode(accessToken)}))
			.then(response => dispatch(receiveUser(response)))
			.then(() => dispatch(push('/')))
			.then(() => dispatch(socketConnect()))
			.catch(e => {
				if(e.statusCode === 401) return e.responseBody.then(response => dispatch(loginError(response.error)));

				dispatch(loginError('Something went wrong, please try again'));
			});
	};
}

export function connectToSocket() {
	return (dispatch) => {
		dispatch(socketConnect());
	};
}

export function logOut() {
	return (dispatch) => {
		dispatch(socketDisconnect());
		window.localStorage.removeItem('accessToken');
		window.localStorage.removeItem('refreshToken');
		window.location.assign('/');
	};
}
