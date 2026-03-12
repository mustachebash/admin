import styles from './TransactionsTable.module.css';

import { useState, useEffect, useContext } from 'react';
import FlexRow from '@/components/FlexRow';
import EventContext from '@/EventContext';
import apiClient from '@/utils/apiClient';
import TransactionsList from '../components/TransactionsList';
import Search from '@/components/Search';
import EventSelector from '@/components/EventSelector';

function getTransactionComparator(sortBy: string, sortOrder: number) {
	return (a: any, b: any) => {
		let sort = 0;

		switch (sortBy) {
			default:
			case 'date':
				// This will (should) never be the same
				sort = a.created > b.created ? 1 : -1;
				break;

			case 'name':
				sort = a.lastName > b.lastName ? -1 : a.lastName === b.lastName ? 0 : 1;
				break;

			case 'amount':
				sort = a.amount > b.amount ? 1 : a.amount === b.amount ? 0 : -1;
				break;
		}

		return sort * sortOrder;
	};
}

const TransactionsTable = () => {
	const [transactions, setTransactions] = useState<any[]>([]),
		[products, setProducts] = useState<any[]>([]),
		[filter, setFilter] = useState(''),
		[sort, setSort] = useState({ sortBy: 'date', sortOrder: -1 }); // asc

	const { event } = useContext(EventContext);

	useEffect(() => {
		if (event)
			apiClient
				.get('/transactions', { eventId: event.id })
				.then(setTransactions)
				.catch(e => console.error('Transactions API Error', e));
	}, [event]);

	useEffect(() => {
		apiClient
			.get('/products')
			.then(setProducts)
			.catch(e => console.error('Products API Error', e));
	}, []);

	function sortTransactions(sortBy: string) {
		setSort({
			sortOrder: 1,
			sortBy
		});
	}

	function switchTransactionsOrder() {
		setSort({
			sortOrder: sort.sortOrder * -1,
			sortBy: sort.sortBy
		});
	}

	const filterRegExp = new RegExp(filter, 'i');

	let filteredTransactions = transactions.filter((t: any) => {
		if (!filter) return true;

		return (
			filterRegExp.test(t.firstName + ' ' + t.lastName) ||
			filterRegExp.test(t.braintreeTransactionId) ||
			filterRegExp.test(t.email) ||
			(t.transfer &&
				(filterRegExp.test(t.transfer.firstName + ' ' + t.transfer.lastName) || filterRegExp.test(t.transfer.originalTransactionId.substring(0, 8)) || filterRegExp.test(t.transfer.email)))
		);
	});

	if (sort.sortBy !== 'date' || sort.sortOrder !== -1) {
		filteredTransactions.sort(getTransactionComparator(sort.sortBy, sort.sortOrder));
	}

	// don't show more than 100 at a time
	filteredTransactions = filteredTransactions.slice(0, 100);

	return (
		<div className={styles.transactionsTable}>
			<FlexRow className={styles.filters}>
				<div>
					<Search handleQueryChange={setFilter} />
				</div>
				<div>
					<EventSelector />
				</div>
			</FlexRow>

			<p>
				Showing {filteredTransactions.length} of {transactions.length} total
			</p>

			<TransactionsList
				transactions={filteredTransactions}
				products={products}
				sortTransactions={sortTransactions}
				switchTransactionsOrder={switchTransactionsOrder}
				sortBy={sort.sortBy}
				sortOrder={sort.sortOrder}
			/>
		</div>
	);
};

export default TransactionsTable;
