import React, { createContext, useState } from 'react';
import PropTypes from 'prop-types';
import jwtDecode from 'jwt-decode';

const UserContext = createContext({
	user: null,
	setUser: () => {}
});

export default UserContext;

let cachedUser = null;
try {
	cachedUser = jwtDecode(window.localStorage.getItem('accessToken'));
} catch(e) {/* do nothing - bad jwt */}

export function UserProvider({ children }) {
	const [user, setUser] = useState(cachedUser);

	return (
		<UserContext.Provider value={{user, setUser}}>
			{children}
		</UserContext.Provider>
	);
}

UserProvider.propTypes = {
	children: PropTypes.node.isRequired
};
