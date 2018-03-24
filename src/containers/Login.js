import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { logIn } from '../appDuck';

export class Login extends Component {
	constructor(props) {
		super(props);

		this.state = {
			username: '',
			password: ''
		};

		this.handleInputChange = this.handleInputChange.bind(this);
		this.logIn = this.logIn.bind(this);
	}

	handleInputChange(e) {
		this.setState({
			[e.target.name]: e.target.value
		});
	}

	logIn(e) {
		e.preventDefault();

		// eslint-disable-next-line
		if(!this.state.username || !this.state.password) return alert('Username and Password is required');

		this.props.logIn({username: this.state.username, password: this.state.password});
	}

	render() {
		if(this.props.user) return <Redirect to={(this.props.user.role === 'doorman' && {pathname: '/guests'}) || (this.props.location.state && this.props.location.state.from) || {pathname: '/'}} />;

		return (
			<section id="login">
				{this.props.loginError && <p>{this.props.loginError}</p>}
				<form onSubmit={this.logIn}>
					<input type="text" onChange={this.handleInputChange} name="username" value={this.state.username} placeholder="Username" />
					<input type="password" onChange={this.handleInputChange} name="password" value={this.state.password} placeholder="Password" />
					<button className="white" type="submit">Submit</button>
				</form>
			</section>
		);
	}
}

Login.propTypes = {
	loginError: PropTypes.string.isRequired,
	logIn: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => ({
	user: state.session.user,
	loginError: state.session.loginError
});

export default withRouter(connect(mapStateToProps, {
	logIn
})(Login));
