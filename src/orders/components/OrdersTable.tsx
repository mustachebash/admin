import styles from './OrdersTable.module.css';

import { useState, useEffect, useContext } from 'react';
import FlexRow from '@/components/FlexRow';
import EventContext from '@/EventContext';
import apiClient from '@/utils/apiClient';
import OrdersList from '../components/OrdersList';
import Search from '@/components/Search';
import EventSelector from '@/components/EventSelector';

function getOrderComparator(sortBy: string, sortOrder: number) {
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

const OrdersTable = () => {
	const [orders, setOrders] = useState<any[]>([]),
		[products, setProducts] = useState<any[]>([]),
		[filter, setFilter] = useState(''),
		[sort, setSort] = useState({ sortBy: 'date', sortOrder: -1 }); // asc

	const { event } = useContext(EventContext);

	useEffect(() => {
		if (event)
			apiClient
				.get('/orders', { eventId: event.id })
				.then(setOrders)
				.catch(e => console.error('Orders API Error', e));
	}, [event]);

	useEffect(() => {
		apiClient
			.get('/products')
			.then(setProducts)
			.catch(e => console.error('Products API Error', e));
	}, []);

	function sortOrders(sortBy: string) {
		setSort({
			sortOrder: 1,
			sortBy
		});
	}

	function switchOrdersOrder() {
		setSort({
			sortOrder: sort.sortOrder * -1,
			sortBy: sort.sortBy
		});
	}

	const filterRegExp = new RegExp(filter, 'i');

	let filteredOrders = orders.filter((o: any) => {
		if (!filter) return true;

		return filterRegExp.test(o.customerFirstName + ' ' + o.customerLastName) || filterRegExp.test(o.id) || filterRegExp.test(o.customerEmail);
	});

	if (sort.sortBy !== 'date' || sort.sortOrder !== -1) {
		filteredOrders.sort(getOrderComparator(sort.sortBy, sort.sortOrder));
	}

	// don't show more than 100 at a time
	filteredOrders = filteredOrders.slice(0, 100);

	return (
		<div className={styles.ordersTable}>
			<FlexRow className={styles.filters}>
				<div>
					<Search handleQueryChange={setFilter} />
				</div>
				<div>
					<EventSelector />
				</div>
			</FlexRow>

			<p>
				Showing {filteredOrders.length} of {orders.length} total
			</p>

			<OrdersList orders={filteredOrders} products={products} sortOrders={sortOrders} switchOrdersOrder={switchOrdersOrder} sortBy={sort.sortBy} sortOrder={sort.sortOrder} />
		</div>
	);
};

export default OrdersTable;
