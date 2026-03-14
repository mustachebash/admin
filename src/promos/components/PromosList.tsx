import styles from './PromosList.module.css';

import classnames from 'classnames';
import PromosListItem from './PromosListItem';

interface PromosListProps {
	type: 'single-use' | 'coupon';
	promos: any[];
	products: any[];
	users: any[];
	sortBy: string;
	sortOrder: number;
	sortPromos: (by: string) => void;
	switchPromosOrder: () => void;
	disablePromo: (id: string) => void;
}

const PromosList = ({ type, promos, products, users, sortBy, sortOrder, sortPromos, switchPromosOrder, disablePromo }: PromosListProps) => {
	const productsById = products.reduce((obj: any, cur: any) => ((obj[cur.id] = cur), obj), {});

	return (
		<ul className={styles.promosList}>
			<li className={styles.tableHeader}>
				<div className={styles.status}>
					<h5>Status</h5>
				</div>
				{type === 'single-use' && (
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
				)}
				{type === 'coupon' && (
					<div className="discount">
						<h5>Discount</h5>
					</div>
				)}
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
				{type === 'coupon' && (
					<div className="meta">
						<h5>Details</h5>
					</div>
				)}
				<div className={styles.link}>
					<h5>Link</h5>
				</div>
				<div className={styles.editPromo}>{/* Empty header */}</div>
			</li>
			{promos.map(promo => (
				<PromosListItem
					key={promo.id}
					type={type}
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
