import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { logOut } from '../appDuck';

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
									<li><Link to="/admin" activeClassName="active" onlyActiveOnIndex={true}>Dashboard</Link></li>
									<li><Link to="/admin/guests" activeClassName="active">Guests</Link></li>

									{['admin', 'planner'].includes(user.role) &&
										<li><Link to="/admin/transactions" activeClassName="active">Transactions</Link></li>}

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

export default connect(mapStateToProps, {
	logOut
})(Header);
