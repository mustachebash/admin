import React from 'react';
import { hot } from 'react-hot-loader/root';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import { isAuthenticated, checkScope } from 'utils';
import AppLayout from './AppLayout';
import LoginView from './views/LoginView';
import DashboardView from './views/DashboardView';
import SettingsView from './views/SettingsView';
import TransactionsView from './transactions/views/TransactionsView';
import GuestsView from './guests/views/GuestsView';
import PromosView from './promos/views/PromosView';

const PrivateRoute = ({ component: Component, scope = 'read', exclude = [], ...rest }) => (
	<Route {...rest} render={props => {
		if(isAuthenticated()) {
			const userScope = jwtDecode(window.localStorage.getItem('accessToken')).role;

			return checkScope(userScope, scope) && !exclude.includes(userScope) && <Component {...props} />;
		} else {
			return <Redirect to={{
				pathname: '/login',
				state: {from: props.location}
			}} />;
		}
	}} />
);

const App = () => (
	<Router>
		<AppLayout>
			<PrivateRoute exclude={['doorman']} exact path="/" component={DashboardView} />
			<PrivateRoute scope="admin" path="/transactions" component={TransactionsView} />
			<PrivateRoute path="/guests" component={GuestsView} />
			<PrivateRoute scope="admin" path="/settings" component={SettingsView} />
			<PrivateRoute scope="admin" path="/promos" component={PromosView} />
			<Route path="/login" component={LoginView} />
		</AppLayout>
	</Router>
);

export default hot(App);
