/**
 * Top-level error boundary to display a
 * helpful message/action in the event of a JS error
 */
import React, { Component } from 'react';

interface ErrorBoundaryProps {
	children: React.ReactNode;
}

interface ErrorBoundaryState {
	error: boolean;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	static getDerivedStateFromError() {
		return { error: true };
	}

	state: ErrorBoundaryState = {
		error: false
	};

	componentDidCatch(err: Error) {
		console.error(err);
	}

	render() {
		if (this.state.error) {
			return (
				<>
					<p>Oops, an unexpected error occured. Text Joe (714) 861-9593:</p>
					<p className="error">{String(this.state.error)}</p>
					<p>
						Please{' '}
						<button type="button" onClick={() => location.reload()}>
							click here
						</button>{' '}
						to refresh the page.
					</p>
				</>
			);
		}

		return this.props.children;
	}
}
