/**
 * Entry point
 * Global project logic, style, and setup
 */
import 'normalize.css';
import './admin.less';

import React from 'react';
import ReactDOM from 'react-dom';

import Root from './Root';

ReactDOM.render(
	<Root />,
	document.getElementById('app-root')
);
