/**
 * Entry point
 * Global project logic, style, and setup
 */
import 'normalize.css';
import './base.less';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(
	<App />,
	document.getElementById('app-root')
);
