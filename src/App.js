import React, { useContext } from 'react';
import { hot } from 'react-hot-loader/root';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import { checkScope } from 'utils';
import UserContext, { UserProvider } from './UserContext';
import { EventProvider } from './EventContext';
import ErrorBoundary from './ErrorBoundary';
import Header from './components/Header';
import LoginView from './views/LoginView';
// import DashboardView from './views/DashboardView';
// import SettingsView from './views/SettingsView';
import TransactionsView from './transactions/views/TransactionsView';
import TransactionView from './transactions/views/TransactionView';
import GuestsView from './guests/views/GuestsView';
import GuestView from './guests/views/GuestView';
import PromosView from './promos/views/PromosView';

/* eslint-disable react/prop-types */
const PrivateRoute = ({ component: Component, children, scope = 'read', exclude = [], ...rest }) => {
	const { user } = useContext(UserContext);

	return (
		<Route {...rest} render={props => {
			if(user) {
				const userScope = user.role;

				return checkScope(userScope, scope) && !exclude.includes(userScope) && (
					children || <Component {...props} />
				);
			} else {
				return <Redirect to={{
					pathname: '/login',
					state: {from: props.location}
				}} />;
			}
		}} />
	);
};
/* eslint-enable */

const App = () => (
	<UserProvider>
		<Router>
			<ErrorBoundary>
				<Switch>
					<Route path="/login" component={LoginView} />
					<PrivateRoute path="/">
						<EventProvider>
							<Header />
							<Switch>
								{/* <PrivateRoute exclude={['doorman']} exact path="/" component={DashboardView} /> */}
								<PrivateRoute scope="admin" path="/transactions/:id" component={TransactionView} />
								<PrivateRoute scope="admin" path="/transactions" component={TransactionsView} />
								<PrivateRoute path="/guests/:id" component={GuestView} />
								<PrivateRoute path="/guests" component={GuestsView} />
								{/* <PrivateRoute scope="admin" path="/settings" component={SettingsView} /> */}
								<PrivateRoute scope="admin" path="/promos" component={PromosView} />
							</Switch>
						</EventProvider>
					</PrivateRoute>
				</Switch>

				<footer>
					<p className="copyright">
						&copy;2020 Mustache Bash. All Rights Reserved.
					</p>
				</footer>
			</ErrorBoundary>
		</Router>
	</UserProvider>
);

export default hot(App);
