import './Login.less';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect, withRouter } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import UserContext from 'UserContext';
import apiClient from 'utils/apiClient';

export default
@withRouter
class Login extends Component {
	static propTypes = {
		location: PropTypes.object.isRequired
	};

	static contextType = UserContext;

	state = {
		username: '',
		password: '',
		loginError: ''
	};

	handleInputChange = this.handleInputChange.bind(this);
	logIn = this.logIn.bind(this);

	handleInputChange(e) {
		this.setState({
			[e.target.name]: e.target.value
		});
	}

	logIn(e) {
		e.preventDefault();

		const { username, password } = this.state,
			{ setUser } = this.context;

		// eslint-disable-next-line
		if(!username || !password) return alert('Username and Password is required');

		apiClient.post('/authenticate', {username, password})
			.then(({accessToken, refreshToken}) => {
				window.localStorage.setItem('accessToken', accessToken);
				window.localStorage.setItem('refreshToken', refreshToken);

				setUser(jwtDecode(accessToken));
			})
			.catch(err => {
				if(err.statusCode === 401) return this.setState({loginError: 'Invalid username and/or password'});

				this.setState({loginError: 'Something went wrong, please try again'});
			});
	}

	render() {
		const { location } = this.props,
			{ username, password, loginError } = this.state,
			{ user } = this.context,
			{ handleInputChange, logIn } = this;

		if(user) return <Redirect to={(user.role === 'doorman' && {pathname: '/guests'}) || (location.state && location.state.from) || {pathname: '/'}} />;

		return (
			<section id="login">
				{loginError && <p>{loginError}</p>}
				<form onSubmit={logIn}>
					<input type="text" onChange={handleInputChange} name="username" value={username} placeholder="Username" />
					<input type="password" onChange={handleInputChange} name="password" value={password} placeholder="Password" />
					<button className="white" type="submit">Submit</button>
				</form>
			</section>
		);
	}
}
