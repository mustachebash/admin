import './PromosList.less';

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import PromosListItem from './PromosListItem';

const PromosList = ({ promos, products, event, sortBy, sortOrder, sortPromos, switchPromosOrder }) => {
	const productsById = products.reduce((obj, cur) => (obj[cur.id] = cur, obj), {});

	return (
		<ul className="promos-list">
			<li className="table-header">
				<div className="status">
					<h5
						className={classnames({
							sortable: true,
							sorted: sortBy === 'status',
							asc: sortOrder === 1,
							desc: sortOrder === -1
						})}
						onClick={() => sortBy !== 'status' ? sortPromos('status') : switchPromosOrder()}
					>
						Status
					</h5>
				</div>
				<div className="recipient">
					<h5
						className={classnames({
							sortable: true,
							sorted: sortBy === 'name',
							asc: sortOrder === 1,
							desc: sortOrder === -1
						})}
						onClick={() => sortBy !== 'name' ? sortPromos('name') : switchPromosOrder()}
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
						onClick={() => sortBy !== 'date' ? sortPromos('date') : switchPromosOrder()}
					>
						Date Added
					</h5>
				</div>
				<div className="event">
					<h5>
						Event
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
				event={event}
				product={productsById[promo.productId]}
				promo={promo}
			/>)}
		</ul>
	);
};

export default PromosList;

PromosList.propTypes = {
	promos: PropTypes.array.isRequired,
	products: PropTypes.array.isRequired,
	event: PropTypes.object.isRequired,
	sortPromos: PropTypes.func.isRequired,
	switchPromosOrder: PropTypes.func.isRequired,
	sortBy: PropTypes.string.isRequired,
	sortOrder: PropTypes.number.isRequired
};
