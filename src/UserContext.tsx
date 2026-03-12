import { createContext, useState, type ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import type { User } from '@/types';

interface UserContextValue {
	user: User | null;
	setUser: (u: User | null) => void;
}

const UserContext = createContext<UserContextValue>({
	user: null,
	setUser: () => {}
});

export default UserContext;

let cachedUser: User | null = null;
try {
	cachedUser = jwtDecode<User>(window.localStorage.getItem('accessToken') ?? '');
} catch {
	/* do nothing - bad jwt */
}

export function UserProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(cachedUser);

	return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
}
