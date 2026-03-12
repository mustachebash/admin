import { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { checkScope } from '@/utils';
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

const PrivateRoute = ({ scope = 'read', exclude = [] }: { scope?: string; exclude?: string[] }) => {
	const { user } = useContext(UserContext);
	const location = useLocation();
	if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
	if (!checkScope(user.role, scope) || exclude.includes(user.role)) return <Navigate to="/" replace />;
	return <Outlet />;
};

const App = () => (
	<GoogleOAuthProvider clientId="198337388430-lc8hopgbqp8d1s4eajfqjhli3g5kbk2r.apps.googleusercontent.com">
		<UserProvider>
			<Router>
				<ErrorBoundary>
					<Routes>
						<Route path="/login" element={<LoginView />} />
						<Route element={<PrivateRoute />}>
							<Route
								element={
									<EventProvider>
										<Header />
										<Outlet />
									</EventProvider>
								}
							>
								<Route element={<PrivateRoute exclude={['doorman']} />}>
									<Route index element={<DashboardView />} />
								</Route>
								<Route element={<PrivateRoute scope="write" />}>
									<Route path="orders/:id" element={<OrderView />} />
									<Route path="orders" element={<OrdersView />} />
									<Route path="promos" element={<PromosView />} />
								</Route>
								<Route element={<PrivateRoute scope="admin" />}>
									<Route path="transactions/:id" element={<TransactionView />} />
									<Route path="transactions" element={<TransactionsView />} />
									<Route path="inspect" element={<InspectView />} />
									<Route path="settings" element={<SettingsView />} />
								</Route>
								<Route path="check-in" element={<CheckInView />} />
								<Route path="guests/:id" element={<GuestView />} />
								<Route path="guests" element={<GuestsView />} />
							</Route>
						</Route>
					</Routes>

					<footer>
						<p className="copyright">&copy;2024 Mustache Bash. All Rights Reserved.</p>
					</footer>
				</ErrorBoundary>
			</Router>
		</UserProvider>
	</GoogleOAuthProvider>
);

export default App;
