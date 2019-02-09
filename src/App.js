import React from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { applyMiddleware, createStore, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import jwtDecode from 'jwt-decode';
import { isAuthenticated, checkScope } from 'utils';
import { socketMiddleware } from './utils/socketClient';
import rootReducer from './rootReducer';
import AppLayout from './AppLayout';
import LoginView from './views/LoginView';
import DashboardView from './views/DashboardView';
import SettingsView from './views/SettingsView';
import TransactionsView from './transactions/views/TransactionsView';
import GuestsView from './guests/views/GuestsView';
import PromosView from './promos/views/PromosView';


// Create store enhancers
const enhancer = compose(applyMiddleware(thunk, socketMiddleware));

// Create redux store
const initialState = {},
	accessToken = window.localStorage.getItem('accessToken');

if(accessToken) {
	try {
		const user = jwtDecode(accessToken);

		initialState.session = {user};
	} catch(e) {/* do nothing - bad jwt */}
}

const store = createStore(rootReducer, initialState, enhancer);

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
	<Provider store={store}>
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
	</Provider>
);

export default App;
