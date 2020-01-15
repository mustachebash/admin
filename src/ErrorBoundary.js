/**
 * Top-level error boundary to display a
 * helpful message/action in the event of a JS error
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

export default
@withRouter
class ErrorBoundary extends Component {
	static propTypes = {
		children: PropTypes.node.isRequired
	};

	static getDerivedStateFromError() {
		return { error: true };
	}

	state = {
		error: false
	};

	componentDidCatch(err) {
		console.error(err);
	}

	render() {
		if (this.state.error) {
			return (
				<p>
					Oops, an unexpected error occured. Please{' '}
					<button type="button" onClick={() => location.reload()}>
						click here
					</button>{' '}
					to refresh the page.
				</p>
			);
		}

		return this.props.children;
	}
}
