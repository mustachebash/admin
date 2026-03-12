import styles from './OrdersListItem.module.css';

import React from 'react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import classnames from 'classnames';

interface OrdersListItemProps {
	order: any;
	productsById: Record<string, any>;
	transferee?: boolean;
}

const OrdersListItem = ({ order, productsById, transferee }: OrdersListItemProps) => (
	<li
		className={classnames(styles.ordersListItem, {
			[styles.canceled]: order.status === 'canceled',
			[styles.transferred]: order.status === 'transferred',
			[styles.transferee]: transferee
		})}
	>
		<div className="name">
			<p>
				<Link to={`/orders/${order.id}`}>
					{order.customerFirstName} {order.customerLastName}
				</Link>
			</p>
		</div>
		<div className={styles.amount}>{!transferee && <p>${order.amount.toFixed(0)}</p>}</div>
		<div className={styles.products}>
			<ul>
				{order.items.map(({ productId, quantity }: any) => {
					const product = productsById[productId];
					if (!product) return null;

					return (
						<li key={`${order.id}-${productId}`}>
							{product.name}: {quantity}
						</li>
					);
				})}
			</ul>
		</div>
		<div className={styles.date}>
			<p>{format(new Date(order.created), 'MMM do, h:mma')}</p>
		</div>
		<div className="order-id">
			<p title={order.id}>
				<Link to={`/orders/${order.id}`}>{transferee ? order.parentOrderId.substring(0, 8) : order.id.slice(0, 8)}</Link>
			</p>
		</div>
		<div className="email">
			<p>{order.customerEmail}</p>
		</div>
	</li>
);

export default OrdersListItem;
