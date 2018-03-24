export function formatThousands(number) {
	try {
		return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	}
	catch(e) {
		// Gracefully return the input
		return number;
	}
}

export function isAuthenticated() {
	return !!(
		window.localStorage.getItem('accessToken')
		&& window.localStorage.getItem('refreshToken')
	);
}

export function checkScope(userRole, scopeRequired) {
	const roles = [
		'root',
		'god',
		'admin',
		'doorman',
		'read'
	];

	const userLevel = roles.indexOf(userRole);

	return Boolean(~userLevel && userLevel <= roles.indexOf(scopeRequired));
}
