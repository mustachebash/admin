import React, { useContext } from 'react';
import { hot } from 'react-hot-loader/root';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { checkScope } from 'utils';
import UserContext, { UserProvider } from './UserContext';
import { EventProvider } from './EventContext';
import ErrorBoundary from './ErrorBoundary';
import Header from './components/Header';
import LoginView from './views/LoginView';
import DashboardView from './views/DashboardView';
import SettingsView from './views/SettingsView';
import CheckInView from './views/CheckInView';
import InspectView from './views/InspectView';
import OrdersView from './orders/views/OrdersView';
import OrderView from './orders/views/OrderView';
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
	<GoogleOAuthProvider clientId="198337388430-lc8hopgbqp8d1s4eajfqjhli3g5kbk2r.apps.googleusercontent.com">
		<UserProvider>
			<Router>
				<ErrorBoundary>
					<Switch>
						<Route path="/login" component={LoginView} />
						<PrivateRoute path="/">
							<EventProvider>
								<Header />
								<Switch>
									<PrivateRoute exclude={['doorman']} exact path="/" component={DashboardView} />
									<PrivateRoute scope="write" path="/orders/:id" component={OrderView} />
									<PrivateRoute scope="write" path="/orders" component={OrdersView} />
									<PrivateRoute scope="admin" path="/transactions/:id" component={TransactionView} />
									<PrivateRoute scope="admin" path="/transactions" component={TransactionsView} />
									<PrivateRoute scope="admin" path="/inspect" component={InspectView} />
									<PrivateRoute path="/check-in" component={CheckInView} />
									<PrivateRoute path="/guests/:id" component={GuestView} />
									<PrivateRoute path="/guests" component={GuestsView} />
									<PrivateRoute scope="admin" path="/settings" component={SettingsView} />
									<PrivateRoute scope="write" path="/promos" component={PromosView} />
								</Switch>
							</EventProvider>
						</PrivateRoute>
					</Switch>

					<footer>
						<p className="copyright">
							&copy;2024 Mustache Bash. All Rights Reserved.
						</p>
					</footer>
				</ErrorBoundary>
			</Router>
		</UserProvider>
	</GoogleOAuthProvider>
);

export default hot(App);
