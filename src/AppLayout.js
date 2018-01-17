import React, { Component } from 'react';
import Header from './containers/Header';

export default class AppLayout extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<Header />
				{this.props.children}
			</div>
		);
	}
}
