export function formatThousands(number) {
	try {
		return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	}
	catch(e) {
		// Gracefully return the input
		return number;
	}
}
