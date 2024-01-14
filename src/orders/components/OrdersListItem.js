import './OrdersListItem.less';

import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const OrdersListItem = ({ order, productsById, transferee }) => (
	<li className={`orders-list-item ${['refunded', 'voided', 'transferred'].includes(order.status) ? 'refunded' : ''} ${transferee ? 'transferee' : ''}`}>
		<div className="name">
			<p><Link to={`/orders/${order.id}`}>{order.customerFirstName} {order.customerLastName}</Link></p>
		</div>
		<div className="amount">
			{!transferee && <p>${order.amount.toFixed(0)}</p>}
		</div>
		<div className="products">
			<ul>
				{order.items.map(({productId, quantity}) => {
					const product = productsById[productId];
					if(!product) return null;

					return <li key={`${order.id}-${productId}`}>{product.name}: {quantity}</li>;
				})}
			</ul>
		</div>
		<div className="date">
			<p>{format(new Date(order.created), 'MMM do, h:mma', {timeZone: 'America/Los_Angeles'}) }</p>
		</div>
		<div className="confirmation">
			<p>{transferee ? order.parentOrderId.substring(0, 8) : order.processorTransactionId}</p>
		</div>
		<div className="email">
			<p>{order.customerEmail}</p>
		</div>
	</li>
);

OrdersListItem.propTypes = {
	order: PropTypes.object.isRequired,
	productsById: PropTypes.object.isRequired,
	transferee: PropTypes.oneOfType([PropTypes.object, PropTypes.bool])
};

export default OrdersListItem;
