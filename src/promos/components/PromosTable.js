import './PromosTable.less';

import React, { useState, useEffect, useContext } from 'react';
import apiClient from 'utils/apiClient';
import EventContext from 'EventContext';
import CreatePromoForm from '../components/CreatePromoForm';
import EventSelector from 'components/EventSelector';
import PromosList from './PromosList';
import Search from 'components/Search';

function getPromoComparator({sortBy, sortOrder}) {
	return (a, b) => {
		let sort = 0;

		switch(sortBy) {
			case 'date':
				// This will (should) never be the same
				sort = a.created > b.created ? 1 : -1;
				break;

			default:
			case 'recipient':
				sort = a.recipientName > b.recipientName
					? 1
					: a.recipientName === b.recipientName
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
		[users, setUsers] = useState(),
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

		apiClient.get('/users')
			.then(setUsers)
			.catch(e => console.error('Users API Error', e));
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

	function disablePromo(id) {
		apiClient.delete(`/promos/${id}`)
			.then(promo => {
				const promoIndex = promos.findIndex(p => p.id === promo.id),
					// Create the new array before splicing in place
					newPromos = [...promos];

				newPromos.splice(promoIndex, 1, promo);

				setPromos(newPromos);
			})
			.catch(e => console.error('Promo API Error', e));
	}

	const filteredProducts = products.filter(p => p.promo && p.eventId === event?.id),
		filterRegExp = new RegExp(filter, 'i');

	let filteredPromos = promos.filter(p => {
		if(!filter) return true;

		return (
			filterRegExp.test(p.recipientName) ||
			filterRegExp.test(p.email)
		);
	});

	filteredPromos.sort(getPromoComparator(sort));

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
				users={users}
				sortPromos={sortPromos}
				switchPromosOrder={switchPromosOrder}
				sortBy={sort.sortBy}
				sortOrder={sort.sortOrder}
				disablePromo={disablePromo}
			/>}
		</div>
	);
};

export default PromosTable;
