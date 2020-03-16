import './TransactionsListItem.less';

import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const TransactionsListItem = ({ transaction, productsById }) => (
	<li className={`transactions-list-item ${transaction.status === 'refunded' ? 'refunded' : ''}`}>
		<div className="name">
			<p><Link to={`/transactions/${transaction.id}`}>{transaction.firstName} {transaction.lastName}</Link></p>
		</div>
		<div className="amount">
			<p>${transaction.amount.toFixed(0)}</p>
		</div>
		<div className="products">
			<ul>
				{transaction.order.map(({productId, quantity}) => {
					const product = productsById[productId];
					if(!product) return null;

					return <li key={`${transaction.id}-${productId}`}>{product.name}: {quantity}</li>;
				})}
			</ul>
		</div>
		<div className="date">
			<p>{format(new Date(transaction.created), 'MMM do, h:mma', {timeZone: 'America/Los_Angeles'}) }</p>
		</div>
		<div className="confirmation">
			<p>{transaction.braintreeTransactionId}</p>
		</div>
		<div className="email">
			<p>{transaction.email}</p>
		</div>
	</li>
);

TransactionsListItem.propTypes = {
	transaction: PropTypes.object.isRequired,
	productsById: PropTypes.object.isRequired
};

export default TransactionsListItem;
