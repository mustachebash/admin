import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Search extends Component {
	constructor(props) {
		super(props);

		this.state = {
			query: ''
		};

		this.handleQueryChange = this.handleQueryChange.bind(this);
	}

	handleQueryChange(e) {
		this.setState({
			query: e.target.value
		});

		this.props.handleQueryChange(e.target.value);
	}

	render() {
		return (
			<div className="search">
				<aside>
					<input type="text" value={this.state.query} onChange={this.handleQueryChange} placeholder="Search..." />
				</aside>
			</div>
		);
	}
}

Search.propTypes = {
	handleQueryChange: PropTypes.func.isRequired
};
