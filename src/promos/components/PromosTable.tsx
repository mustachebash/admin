import styles from './PromosTable.module.css';

import { useState, useEffect, useContext } from 'react';
import FlexRow from '@/components/FlexRow';
import apiClient from '@/utils/apiClient';
import EventContext from '@/EventContext';
import CreatePromoForm from '../components/CreatePromoForm';
import EventSelector from '@/components/EventSelector';
import PromosList from './PromosList';
import Search from '@/components/Search';

function getPromoComparator({ sortBy, sortOrder }: { sortBy: string; sortOrder: number }) {
	return (a: any, b: any) => {
		let sort = 0;

		switch (sortBy) {
			case 'date':
				// This will (should) never be the same
				sort = a.created > b.created ? 1 : -1;
				break;

			default:
			case 'recipient':
				sort = a.recipientName > b.recipientName ? 1 : a.recipientName === b.recipientName ? 0 : -1;
				break;
		}

		return sort * sortOrder;
	};
}

const PromosTable = () => {
	const [promos, setPromos] = useState<any[]>([]),
		[products, setProducts] = useState<any[]>([]),
		[users, setUsers] = useState<any[]>(),
		[filter, setFilter] = useState(''),
		[sort, setSort] = useState({ sortBy: 'date', sortOrder: 1 }), // asc
		[activeTab, setActiveTab] = useState<'single-use' | 'coupon'>('single-use');

	const { event } = useContext(EventContext);

	useEffect(() => {
		if (event)
			apiClient
				.get('/promos', { eventId: event.id })
				.then(setPromos)
				.catch(e => console.error('Promo API Error', e));
	}, [event]);

	useEffect(() => {
		apiClient
			.get('/products')
			.then(setProducts)
			.catch(e => console.error('Products API Error', e));

		apiClient
			.get('/users')
			.then(setUsers)
			.catch(e => console.error('Users API Error', e));
	}, []);

	function sortPromos(sortBy: string) {
		setSort({
			sortOrder: 1,
			sortBy
		});
	}

	function switchPromosOrder() {
		setSort({
			sortOrder: sort.sortOrder * -1,
			sortBy: sort.sortBy
		});
	}

	function disablePromo(id: string) {
		apiClient
			.delete(`/promos/${id}`)
			.then(promo => {
				const promoIndex = promos.findIndex((p: any) => p.id === promo.id),
					// Create the new array before splicing in place
					newPromos = [...promos];

				newPromos.splice(promoIndex, 1, promo);

				setPromos(newPromos);
			})
			.catch(e => console.error('Promo API Error', e));
	}

	const filteredProducts = products.filter((p: any) => p.promo && p.eventId === event?.id),
		filterRegExp = new RegExp(filter, 'i');

	let filteredPromos = promos.filter((p: any) => {
		if (p.type !== activeTab) return false;
		if (!filter) return true;

		const metaValues = Object.values(p.meta ?? {}).map((v: any) => (typeof v === 'object' ? JSON.stringify(v) : String(v)));

		return filterRegExp.test(p.recipientName) || filterRegExp.test(p.email) || filterRegExp.test(p.code) || metaValues.some(v => filterRegExp.test(v));
	});

	filteredPromos.sort(getPromoComparator(sort));

	// No one needs to see more than 100 promos at a time
	filteredPromos = filteredPromos.slice(0, 100);

	function switchTab(tab: 'single-use' | 'coupon') {
		setActiveTab(tab);
		setSort({ sortBy: 'date', sortOrder: 1 });
	}

	return (
		<div className={styles.promosTable}>
			<FlexRow className={styles.filters}>
				<div>
					<Search handleQueryChange={setFilter} />
				</div>
				<div>
					<EventSelector />
				</div>
			</FlexRow>

			<div className={styles.tabs}>
				<button className={`${styles.tab}${activeTab === 'single-use' ? ` ${styles.activeTab}` : ''}`} onClick={() => switchTab('single-use')}>
					Single-Use
				</button>
				<button className={`${styles.tab}${activeTab === 'coupon' ? ` ${styles.activeTab}` : ''}`} onClick={() => switchTab('coupon')}>
					Coupons
				</button>
			</div>

			{activeTab === 'single-use' && <CreatePromoForm onAdd={promo => setPromos([promo, ...promos])} />}

			<p>
				Showing {filteredPromos.length} of {promos.filter((p: any) => p.type === activeTab).length} total
			</p>
			{event && (
				<PromosList
					type={activeTab}
					promos={filteredPromos}
					products={filteredProducts}
					users={users ?? []}
					sortPromos={sortPromos}
					switchPromosOrder={switchPromosOrder}
					sortBy={sort.sortBy}
					sortOrder={sort.sortOrder}
					disablePromo={disablePromo}
				/>
			)}
		</div>
	);
};

export default PromosTable;
