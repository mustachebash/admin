import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import PromosListItem from './PromosListItem';

const PromosList = (props) => {
	const { promos } = props,
		productsById = {};

	props.products.forEach(p => productsById[p.id] = p);

	return (
		<ul className="promos-list">
			<li className="table-header">
				<div className="claimed">
					<h5
						className={classnames({
							sortable: true,
							sorted: props.sortBy === 'claimed',
							asc: props.sortOrder === 1,
							desc: props.sortOrder === -1
						})}
						onClick={() => props.sortBy !== 'claimed' ? props.sortPromos('claimed') : props.switchPromosOrder()}
					>
						Claimed
					</h5>
				</div>
				<div className="recipient">
					<h5
						className={classnames({
							sortable: true,
							sorted: props.sortBy === 'name',
							asc: props.sortOrder === 1,
							desc: props.sortOrder === -1
						})}
						onClick={() => props.sortBy !== 'name' ? props.sortPromos('name') : props.switchPromosOrder()}
					>
						Recipient
					</h5>
				</div>
				<div className="date">
					<h5
						className={classnames({
							sortable: true,
							sorted: props.sortBy === 'date',
							asc: props.sortOrder === 1,
							desc: props.sortOrder === -1
						})}
						onClick={() => props.sortBy !== 'date' ? props.sortPromos('date') : props.switchPromosOrder()}
					>
						Date Added
					</h5>
				</div>
				<div className="product">
					<h5>
						Product
					</h5>
				</div>
				<div className="link">
					<h5>
						Link
					</h5>
				</div>
				<div className="edit-promo">
					{/* Empty header */}
				</div>
			</li>
			{promos.map(promo => <PromosListItem
				key={promo.id}
				product={productsById[promo.productId]}
				promo={promo}
				disablePromo={props.disablePromo}
			/>)}
		</ul>
	);
};

export default PromosList;

PromosList.propTypes = {
	promos: PropTypes.array.isRequired,
	products: PropTypes.array.isRequired,
	sortPromos: PropTypes.func.isRequired,
	switchPromosOrder: PropTypes.func.isRequired,
	sortBy: PropTypes.string.isRequired,
	sortOrder: PropTypes.number.isRequired,
	disablePromo: PropTypes.func.isRequired
};
