import './PromosTable.less';

import React, { useState, useEffect, useContext } from 'react';
import apiClient from 'utils/apiClient';
import EventContext from 'EventContext';
import CreatePromoForm from '../components/CreatePromoForm';
import EventSelector from 'components/EventSelector';
import PromosList from './PromosList';
import Search from 'components/Search';

function getPromoComparator(sortBy, sortOrder) {
	return (a, b) => {
		let sort = 0;

		switch(sortBy) {
			case 'date':
				// This will (should) never be the same
				sort = a.created > b.created ? 1 : -1;
				break;

			default:
			case 'recipient':
				sort = a.recipient > b.recipient
					? 1
					: a.recipient === b.recipient
						? 0
						: -1;
				break;
		}

		return sort * sortOrder;
	};
}

const PromosTable = () => {
	const [promos, setPromos] = useState([]),
		[products, setProducts] = useState([]),
		[filter, setFilter] = useState(''),
		[sort, setSort] = useState({sortBy: 'recipient', sortOrder: 1}); // asc

	const { event } = useContext(EventContext);

	useEffect(() => {
		if(event) apiClient.get('/promos', {eventId: event.id})
			.then(setPromos)
			.catch(e => console.error('Promo API Error', e));
	}, [event]);

	useEffect(() => {
		apiClient.get('/products')
			.then(setProducts)
			.catch(e => console.error('Products API Error', e));
	}, []);

	function sortPromos(sortBy) {
		setSort({
			sortOrder: 1,
			sortBy
		});
	}

	function switchPromosOrder() {
		setSort({
			sortOrder: sort.sortOrder * (-1),
			sortBy: sort.sortBy
		});
	}

	const filteredProducts = products.filter(p => p.promo && p.eventId === event?.id),
		filterRegExp = new RegExp(filter, 'i');

	let filteredPromos = promos.filter(p => {
		if(!filter) return true;

		return (
			filterRegExp.test(p.recipient) ||
			filterRegExp.test(p.email)
		);
	});

	filteredPromos.sort(getPromoComparator());

	// No one needs to see more than 100 promos at a time
	filteredPromos = filteredPromos.slice(0, 100);

	return (
		<div className="promos-table">

			<CreatePromoForm onAdd={promo => setPromos([promo, ...promos])} />

			<div className="filters flex-row">
				<div><Search handleQueryChange={setFilter} /></div>
				<div><EventSelector /></div>
			</div>

			<p>Showing {filteredPromos.length} of {promos.length} total</p>
			{event && <PromosList
				promos={filteredPromos}
				event={event}
				products={filteredProducts}
				sortPromos={sortPromos}
				switchPromosOrder={switchPromosOrder}
				sortBy={sort.sortBy}
				sortOrder={sort.sortOrder}
			/>}
		</div>
	);
};

export default PromosTable;
