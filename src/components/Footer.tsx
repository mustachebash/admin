import { useContext } from 'react';
import UserContext from '@/UserContext';

function logOut() {
	window.localStorage.removeItem('accessToken');
	window.localStorage.removeItem('refreshToken');
	window.location.assign('/');
}

const Footer = () => {
	const { user } = useContext(UserContext);

	return (
		<footer>
			{user && (
				<button className="white" onClick={logOut} title={`Logged in as ${user.name}`}>
					Log Out
				</button>
			)}
			<p className="copyright">&copy;2024 Mustache Bash. All Rights Reserved.</p>
		</footer>
	);
};

export default Footer;
