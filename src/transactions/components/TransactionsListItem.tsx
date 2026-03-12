import styles from './TransactionsListItem.module.css';

import React from 'react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import classnames from 'classnames';

interface TransactionsListItemProps {
	transaction: any;
	productsById: Record<string, any>;
	transferee?: boolean;
}

const TransactionsListItem = ({ transaction, productsById, transferee }: TransactionsListItemProps) => (
	<li className={classnames(styles.transactionsListItem, {
		[styles.refunded]: ['refunded', 'voided', 'transferred'].includes(transaction.status),
		[styles.transferee]: transferee
	})}>
		<div className="name">
			<p>
				<Link to={`/transactions/${transaction.id}`}>
					{transaction.firstName} {transaction.lastName}
				</Link>
			</p>
		</div>
		<div className={styles.amount}>{!transferee && <p>${transaction.amount.toFixed(0)}</p>}</div>
		<div className={styles.products}>
			<ul>
				{transaction.order.map(({ productId, quantity }: any) => {
					const product = productsById[productId];
					if (!product) return null;

					return (
						<li key={`${transaction.id}-${productId}`}>
							{product.name}: {quantity}
						</li>
					);
				})}
			</ul>
		</div>
		<div className={styles.date}>
			<p>{format(new Date(transaction.created), 'MMM do, h:mma')}</p>
		</div>
		<div className="confirmation">
			<p>{transferee ? transaction.originalTransactionId.substring(0, 8) : transaction.braintreeTransactionId}</p>
		</div>
		<div className="email">
			<p>{transaction.email}</p>
		</div>
	</li>
);

export default TransactionsListItem;
