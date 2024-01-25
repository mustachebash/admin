export function formatThousands(number) {
	try {
		return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	}
	catch(e) {
		// Gracefully return the input
		return number;
	}
}

export function checkScope(userRole, scopeRequired) {
	const roles = [
		'root',
		'god',
		'admin',
		'write',
		'doorman',
		'read'
	];

	const userLevel = roles.indexOf(userRole);

	return Boolean(~userLevel && userLevel <= roles.indexOf(scopeRequired));
}
