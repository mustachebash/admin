import React from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { applyMiddleware, createStore, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import jwtDecode from 'jwt-decode';
import { socketMiddleware } from './utils/socketClient';
import rootReducer from './rootReducer';
import AppLayout from './AppLayout';
import Login from './containers/Login';
import DashboardView from './views/DashboardView';
import TransactionsView from './transactions/views/TransactionsView';
import GuestsView from './guests/views/GuestsView';


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

function isAuthenticated() {
	return !!(
		window.localStorage.getItem('accessToken')
		&& window.localStorage.getItem('refreshToken')
	);
}

const PrivateRoute = ({ component: Component, ...rest }) => (
	<Route {...rest} render={props => (
		isAuthenticated()
			? <Component {...props} />
			: <Redirect to={{
				pathname: '/login',
				state: {from: props.location}
			}} />
	)} />
);

// const checkPlannerScope = (nextState, replace) => {
// 	let user;
// 	try {
// 		user = jwtDecode(window.localStorage.getItem('accessToken'));
// 	} catch(e) {
// 		// Shouldn't get here, logout
// 		window.localStorage.removeItem('accessToken');
// 		window.localStorage.removeItem('refreshToken');
// 		window.location.assign('/');
// 	}
//
// 	if(!['admin', 'planner'].includes(user.role)) return replace('/admin');
// };

const App = () => (
	<Provider store={store}>
		<Router>
			<AppLayout>
				<PrivateRoute exact path="/" component={DashboardView} />
				<PrivateRoute path="/transactions" component={TransactionsView} />
				<PrivateRoute path="/guests" component={GuestsView} />
				<Route path="/login" component={Login} />
			</AppLayout>
		</Router>
	</Provider>
);

export default App;
