/**
 * Entry point
 * Global project logic, style, and setup
 */
import 'normalize.css';
import './base.less';

import React from 'react';
import ReactDOM from 'react-dom';
import jwtDecode from 'jwt-decode';
import App from './App';

// Create redux store
const initialState = {},
	accessToken = window.localStorage.getItem('accessToken');

if(accessToken) {
	try {
		const user = jwtDecode(accessToken);

		initialState.session = {user};
	} catch(e) {/* do nothing - bad jwt */}
}

ReactDOM.render(
	<App />,
	document.getElementById('app-root')
);
