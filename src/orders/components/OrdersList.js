import './OrdersList.less';

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import OrdersListItem from './OrdersListItem';

const OrdersList = ({ orders, products, sortBy, sortOrder, sortOrders, switchOrdersOrder }) => {
	const productsById = products.reduce((obj, cur) => (obj[cur.id] = cur, obj), {});

	return (
		<ul className="orders-list">
			<li className="table-header">
				<div className="name">
					<h5
						className={classnames({
							sortable: true,
							sorted: sortBy === 'name',
							asc: sortOrder === 1,
							desc: sortOrder === -1
						})}
						onClick={() => sortBy !== 'name' ? sortOrders('name') : switchOrdersOrder()}
					>
						Name
					</h5>
				</div>
				<div className="amount">
					<h5
						className={classnames({
							sortable: true,
							sorted: sortBy === 'amount',
							asc: sortOrder === 1,
							desc: sortOrder === -1
						})}
						onClick={() => sortBy !== 'amount' ? sortOrders('amount') : switchOrdersOrder()}
					>
						Amount
					</h5>
				</div>
				<div className="additional-guests">
					<h5>
						Order
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
						onClick={() => sortBy !== 'date' ? sortOrders('date') : switchOrdersOrder()}
					>
						Date Paid
					</h5>
				</div>
				<div className="confirmation">
					<h5>
						Confirmation
					</h5>
				</div>
				<div className="email">
					<h5>
						Email
					</h5>
				</div>
			</li>
			{orders.map(order =>
				<React.Fragment key={order.id}>
					<OrdersListItem key={order.id} order={order} productsById={productsById} />
					{/*{order.status === 'transferred' && <OrdersListItem key={order.transfer.id} transferee order={order.transfer} productsById={productsById} />}*/}
				</React.Fragment>
			)}
		</ul>
	);
};

export default OrdersList;

OrdersList.propTypes = {
	orders: PropTypes.array.isRequired,
	products: PropTypes.array.isRequired,
	sortOrders: PropTypes.func.isRequired,
	switchOrdersOrder: PropTypes.func.isRequired,
	sortBy: PropTypes.string.isRequired,
	sortOrder: PropTypes.number.isRequired
};
