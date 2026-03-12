import styles from './OrdersList.module.css';

import React from 'react';
import classnames from 'classnames';
import OrdersListItem from './OrdersListItem';

interface OrdersListProps {
	orders: any[];
	products: any[];
	sortBy: string;
	sortOrder: number;
	sortOrders: (by: string) => void;
	switchOrdersOrder: () => void;
}

const OrdersList = ({ orders, products, sortBy, sortOrder, sortOrders, switchOrdersOrder }: OrdersListProps) => {
	const productsById = products.reduce((obj: any, cur: any) => ((obj[cur.id] = cur), obj), {});

	return (
		<ul className={styles.ordersList}>
			<li className={styles.tableHeader}>
				<div className="name">
					<h5
						className={classnames({
							sortable: true,
							sorted: sortBy === 'name',
							asc: sortOrder === 1,
							desc: sortOrder === -1
						})}
						onClick={() => (sortBy !== 'name' ? sortOrders('name') : switchOrdersOrder())}
					>
						Name
					</h5>
				</div>
				<div className={styles.amount}>
					<h5
						className={classnames({
							sortable: true,
							sorted: sortBy === 'amount',
							asc: sortOrder === 1,
							desc: sortOrder === -1
						})}
						onClick={() => (sortBy !== 'amount' ? sortOrders('amount') : switchOrdersOrder())}
					>
						Amount
					</h5>
				</div>
				<div className="additional-guests">
					<h5>Order</h5>
				</div>
				<div className="date">
					<h5
						className={classnames({
							sortable: true,
							sorted: sortBy === 'date',
							asc: sortOrder === 1,
							desc: sortOrder === -1
						})}
						onClick={() => (sortBy !== 'date' ? sortOrders('date') : switchOrdersOrder())}
					>
						Date Paid
					</h5>
				</div>
				<div className="confirmation">
					<h5>ID</h5>
				</div>
				<div className="email">
					<h5>Email</h5>
				</div>
			</li>
			{orders.map(order => (
				<React.Fragment key={order.id}>
					<OrdersListItem key={order.id} order={order} productsById={productsById} />
					{/*{order.status === 'transferred' && <OrdersListItem key={order.transfer.id} transferee order={order.transfer} productsById={productsById} />}*/}
				</React.Fragment>
			))}
		</ul>
	);
};

export default OrdersList;
