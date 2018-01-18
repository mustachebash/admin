import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import { logOut } from '../appDuck';
import { checkScope } from '../utils';

export class Header extends Component {
	constructor(props) {
		super(props);

		this.state = {
			navOpen: false
		};

		this.toggleNavMenu = this.toggleNavMenu.bind(this);
	}

	toggleNavMenu() {
		this.setState({navOpen: !this.state.navOpen});
	}

	render() {
		const user = this.props.user;

		return (
			<header>
				<div className="container-1230">
					<div className="logo"></div>
					{user &&
						<div>
							<div onClick={this.toggleNavMenu} id="menu-icon">
								<div></div>
								<div></div>
								<div></div>
							</div>
							<nav className={this.state.navOpen ? 'open' : ''}>
								<ul>
									<li><NavLink exact to="/">Dashboard</NavLink></li>
									<li><NavLink to="/guests">Guests</NavLink></li>

									{checkScope(user.role, 'admin') &&
										<li><NavLink to="/transactions">Transactions</NavLink></li>}

									<li><button className="white" onClick={this.props.logOut}>Log Out</button></li>
								</ul>
							</nav>
						</div>
					}
				</div>
			</header>
		);
	}
}

Header.propTypes = {
	user: PropTypes.object,
	logOut: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => ({
	user: state.session.user
});

export default withRouter(connect(mapStateToProps, {
	logOut
})(Header));
