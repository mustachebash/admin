export type UserRole = 'root' | 'god' | 'admin' | 'write' | 'doorman' | 'read';

export interface User {
	id: string;
	email: string;
	name: string;
	role: UserRole;
	iat?: number;
	exp?: number;
}

export interface Event {
	id: string;
	name: string;
	date: string;
	location?: string;
	description?: string;
	ticketsSold?: number;
	capacity?: number;
	[key: string]: unknown;
}
