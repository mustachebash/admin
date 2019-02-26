import React from 'react';
import { applyMiddleware, createStore, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import jwtDecode from 'jwt-decode';
import { socketMiddleware } from './utils/socketClient';
import rootReducer from './rootReducer';
import App from './App';

// Create store enhancers
const enhancer = compose(applyMiddleware(thunk, socketMiddleware));

// Create redux store
const initialState = {},
	accessToken = window.localStorage.getItem('accessToken');

if(accessToken) {
	try {
		const user = jwtDecode(accessToken);

		initialState.session = {user};
	} catch(e) {/* do nothing - bad jwt */}
}

const store = createStore(rootReducer, initialState, enhancer);

const Root = () => (
	<Provider store={store}>
		<App />
	</Provider>
);

export default Root;
