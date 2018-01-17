import React, { Component } from 'react';
import PropTypes from 'prop-types';
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

		if(!this.state.username || !this.state.password) return alert('Username and Password is required');

		this.props.logIn({username: this.state.username, password: this.state.password});
	}

	render() {

		return (
			<section id="login">
				<div className="container-1230">
					{this.props.loginError && <p>{this.props.loginError}</p>}
					<form onSubmit={this.logIn}>
						<input type="text" onChange={this.handleInputChange} name="username" value={this.state.username} placeholder="Username" />
						<input type="password" onChange={this.handleInputChange} name="password" value={this.state.password} placeholder="Password" />
						<button className="white" type="submit">Submit</button>
					</form>
				</div>
			</section>
		);
	}
}

Login.propTypes = {
	loginError: PropTypes.string.isRequired,
	logIn: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => ({
	loginError: state.session.loginError
});

export default connect(mapStateToProps, {
	logIn
})(Login);
