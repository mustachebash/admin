import './PromosList.less';

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import PromosListItem from './PromosListItem';

const PromosList = ({ promos, products, users, event, sortBy, sortOrder, sortPromos, switchPromosOrder, disablePromo }) => {
	const productsById = products.reduce((obj, cur) => (obj[cur.id] = cur, obj), {});

	return (
		<ul className="promos-list">
			<li className="table-header">
				<div className="status">
					<h5>
						Status
					</h5>
				</div>
				<div className="recipient">
					<h5
						className={classnames({
							sortable: true,
							sorted: sortBy === 'recipient',
							asc: sortOrder === 1,
							desc: sortOrder === -1
						})}
						onClick={() => sortBy !== 'recipient' ? sortPromos('recipient') : switchPromosOrder()}
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
				createdByName={users.find(u => u.id === promo.createdBy)?.displayName}
				disablePromo={disablePromo}
			/>)}
		</ul>
	);
};

export default PromosList;

PromosList.propTypes = {
	promos: PropTypes.array.isRequired,
	products: PropTypes.array.isRequired,
	users: PropTypes.array.isRequired,
	event: PropTypes.object.isRequired,
	sortPromos: PropTypes.func.isRequired,
	switchPromosOrder: PropTypes.func.isRequired,
	sortBy: PropTypes.string.isRequired,
	sortOrder: PropTypes.number.isRequired,
	disablePromo: PropTypes.func.isRequired
};
