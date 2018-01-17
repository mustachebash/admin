/**
 * Entry point
 * Global project logic, style, and setup
 */
import 'normalize.css';
import './admin.less';

import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import App from './App';

const render = Component => {
	ReactDOM.render(
		<AppContainer>
			<Component />
		</AppContainer>,
		document.getElementById('app-root')
	);
};

render(App);

if (module.hot) {
	module.hot.accept('./App', () => render(App));
}
