import styles from './PromosList.module.css';

import classnames from 'classnames';
import PromosListItem from './PromosListItem';

interface PromosListProps {
	promos: any[];
	products: any[];
	users: any[];
	event: any;
	sortBy: string;
	sortOrder: number;
	sortPromos: (by: string) => void;
	switchPromosOrder: () => void;
	disablePromo: (id: string) => void;
}

const PromosList = ({ promos, products, users, event, sortBy, sortOrder, sortPromos, switchPromosOrder, disablePromo }: PromosListProps) => {
	const productsById = products.reduce((obj: any, cur: any) => ((obj[cur.id] = cur), obj), {});

	return (
		<ul className={styles.promosList}>
			<li className={styles.tableHeader}>
				<div className="status">
					<h5>Status</h5>
				</div>
				<div className="recipient">
					<h5
						className={classnames({
							sortable: true,
							sorted: sortBy === 'recipient',
							asc: sortOrder === 1,
							desc: sortOrder === -1
						})}
						onClick={() => (sortBy !== 'recipient' ? sortPromos('recipient') : switchPromosOrder())}
					>
						Recipient
					</h5>
				</div>
				<div className="date">
					<h5
						className={classnames({
							sortable: true,
							sorted: sortBy === 'date',
							asc: sortOrder === 1,
							desc: sortOrder === -1
						})}
						onClick={() => (sortBy !== 'date' ? sortPromos('date') : switchPromosOrder())}
					>
						Date Added
					</h5>
				</div>
				<div className="event">
					<h5>Event</h5>
				</div>
				<div className="product">
					<h5>Product</h5>
				</div>
				<div className="link">
					<h5>Link</h5>
				</div>
				<div className={styles.editPromo}>{/* Empty header */}</div>
			</li>
			{promos.map(promo => (
				<PromosListItem
					key={promo.id}
					event={event}
					product={productsById[promo.productId]}
					promo={promo}
					createdByName={users?.find((u: any) => u.id === promo.createdBy)?.displayName}
					disablePromo={disablePromo}
				/>
			))}
		</ul>
	);
};

export default PromosList;
