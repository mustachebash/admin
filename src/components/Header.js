import './Header.less';

import React, { Component } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import UserContext from 'UserContext';
import { checkScope } from 'utils';

function logOut() {
	window.localStorage.removeItem('accessToken');
	window.localStorage.removeItem('refreshToken');
	window.location.assign('/');
}

export default
@withRouter
class Header extends Component {
	static contextType = UserContext;

	state = {
		navOpen: false
	};

	toggleNavMenu = this.toggleNavMenu.bind(this);

	toggleNavMenu() {
		this.setState({navOpen: !this.state.navOpen});
	}

	render() {
		const { user } = this.context;

		/* eslint-disable max-len */
		return (
			<header id="header">
				<div className="container-1230">
					<div className="logo">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 278 117.51"><defs><style>{'.svg-logo{fill:#fff;}'}</style></defs><path className="svg-logo" d="M-5133.63,1804.27l5.14,31.36h.14l4.24-31.36H-5110l5.57,53.15h-10.79l-2.53-38.28h-.14l-1.69,13.11-4.51,25.17h-8.11l-5.14-25.45-1.77-11.84v-1h-.14l-1.55,38.28h-11.28l4.66-53.15Z" transform="translate(5152.82 -1803.43)"/><path className="svg-logo" d="M-5088.85,1804.27V1855c0,4-.49,11.35,5.22,11.35,5.14,0,5.14-3.88,5.21-7.83v-54.23h10.51v56.35c0,5.64-.64,15.23-15.79,15.23-9.8,0-15.65-4.58-15.65-14.53v-57Z" transform="translate(5152.82 -1803.43)"/><path className="svg-logo" d="M-5038.86,1816.25c-2.11-1.83-4.72-3.38-7.61-3.38-3.24,0-5.28,2-5.28,5.21,0,8.74,16,9.24,16,23.62,0,9.44-5.43,16.56-15.3,16.56a16.22,16.22,0,0,1-9-2.68v-10a13.55,13.55,0,0,0,8,2.81c3.39,0,6.07-2.26,6.07-5.77,0-4.09-3.25-5.65-6.2-7.76-6.07-4.08-9.8-8-9.8-15.79,0-8.38,4.86-15.64,13.88-15.64a18,18,0,0,1,9.3,2.6Z" transform="translate(5152.82 -1803.43)"/><path className="svg-logo" d="M-5005.29,1804.27v9.87h-8.32v43.28h-10.5v-43.28h-8.24v-9.87Z" transform="translate(5152.82 -1803.43)"/><path className="svg-logo" d="M-4983,1804.27l12.76,53.15h-11.21l-2-9h-10.64l-1.91,9h-10.42l12.33-53.15Zm-4.65,21.71-1.2-8h-.14l-1.12,8-2.26,14.16h7.4Z" transform="translate(5152.82 -1803.43)"/><path className="svg-logo" d="M-4940.62,1814.28a15,15,0,0,0-3.95-.56c-9.23,0-13.25,8.38-13.25,16.56,0,7.9,4,17.62,13.18,17.62a13.61,13.61,0,0,0,4-.77v9.94a12.76,12.76,0,0,1-4.86.91c-15.16,0-23.54-13.67-23.54-27.63,0-13.18,8.74-26.72,23.05-26.72a15.77,15.77,0,0,1,5.35,1Z" transform="translate(5152.82 -1803.43)"/><path className="svg-logo" d="M-4924.74,1804.27v20.79h10.64v-20.79h10.5v53.15h-10.5v-22.49h-10.64v22.49h-10.5v-53.15Z" transform="translate(5152.82 -1803.43)"/><path className="svg-logo" d="M-4875,1804.27v9.87h-10.65v11.55h9.38v9.87h-9.38v12h10.79v9.87h-21.29v-53.15Z" transform="translate(5152.82 -1803.43)"/><path className="svg-logo" d="M-5007.33,1920.09V1867H-4997c4.09,0,7.61.14,11,2.89a15.61,15.61,0,0,1,5.43,12,12.32,12.32,0,0,1-5.72,11c4.38,2.12,6.56,7.76,6.56,12.34,0,10.5-7.75,14.94-17.34,14.94Zm10.5-44.33v13c3.95,0,6.28-2.68,6.28-6.7C-4990.55,1878.16-4992.81,1875.55-4996.83,1875.76Zm0,21.14v14.38c4.23.22,6.7-2.89,6.7-7.32C-4990.13,1899.79-4992.66,1896.76-4996.83,1896.9Z" transform="translate(5152.82 -1803.43)"/><path className="svg-logo" d="M-4953.65,1867l12.75,53.14h-11.21l-2-8.95h-10.64l-1.91,8.95h-10.43l12.34-53.14Zm-4.66,21.71-1.19-8h-.15l-1.13,8-2.25,14.16h7.4Z" transform="translate(5152.82 -1803.43)"/><path className="svg-logo" d="M-4915.65,1878.93c-2.11-1.83-4.72-3.38-7.61-3.38-3.24,0-5.29,2-5.29,5.21,0,8.74,16,9.24,16,23.61,0,9.45-5.43,16.56-15.3,16.56a16.32,16.32,0,0,1-9-2.67v-10a13.5,13.5,0,0,0,8,2.82c3.38,0,6.06-2.26,6.06-5.78,0-4.09-3.24-5.64-6.2-7.75-6.06-4.09-9.79-8-9.79-15.79,0-8.39,4.86-15.65,13.88-15.65a18,18,0,0,1,9.3,2.61Z" transform="translate(5152.82 -1803.43)"/><path className="svg-logo" d="M-4896,1867v20.79h10.64V1867h10.51v53.14h-10.51v-22.48H-4896v22.48h-10.5V1867Z" transform="translate(5152.82 -1803.43)"/><path className="svg-logo" d="M-5083.63,1898.08c-1.1,7.06-21.14,13.44-21.14,13.44s-32.15,7.71-43.16,0,0-21.59,0-21.59c1.1,15.21,10.79,2.87,10.79,2.87,17-23.56,53.51-24.88,53.51-24.88s36.56,1.32,53.52,24.88c0,0,9.68,12.34,10.78-2.87,0,0,11,13.89,0,21.59s-43.16,0-43.16,0S-5082.52,1905.14-5083.63,1898.08Z" transform="translate(5152.82 -1803.43)"/></svg>
					</div>
					{user &&
						<div>
							<div onClick={this.toggleNavMenu} id="menu-icon">
								<div></div>
								<div></div>
								<div></div>
							</div>
							<nav className={this.state.navOpen ? 'open' : ''}>
								<ul>
									{user.role !== 'doorman' && <li><NavLink exact to="/">Dashboard</NavLink></li>}
									<li><NavLink to="/guests">Guests</NavLink></li>

									{checkScope(user.role, 'admin') &&
										<React.Fragment>
											<li><NavLink to="/transactions">Transactions</NavLink></li>
											<li><NavLink to="/promos">Promos</NavLink></li>
											<li><NavLink to="/settings">Settings</NavLink></li>
										</React.Fragment>
									}

									<li><button className="white" onClick={logOut} title={`Logged in as ${user.name}`}>Log Out</button></li>
								</ul>
							</nav>
							{user.role === 'doorman' &&
								<React.Fragment>
									<p>
										<strong>Guest Help:</strong> Mike Sasaki 209.747.1188<br />
										<strong>Guest List/Website Issues:</strong> Joe Furfaro 714.861.9593<br />
										<strong>Vendor/Bands:</strong> Dustin O'Reilly 916.879.1848
									</p>
									<h4>Remember! If they're not on the list, no entry!</h4>
								</React.Fragment>
							}
						</div>
					}
				</div>
			</header>
		);
	}
}
