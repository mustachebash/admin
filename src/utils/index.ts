export function formatThousands(number: number): string {
	try {
		return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	} catch {
		// Gracefully return the input
		return String(number);
	}
}

export function checkScope(userRole: string, scopeRequired: string): boolean {
	const roles = ['root', 'god', 'admin', 'write', 'doorman', 'read'];

	const userLevel = roles.indexOf(userRole);

	return Boolean(~userLevel && userLevel <= roles.indexOf(scopeRequired));
}
