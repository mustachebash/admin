import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';

export default class TransactionsListItem extends Component {
	constructor(props) {
		super(props);
	}

	shouldComponentUpdate(nextProps) {
		return nextProps.transaction !== this.props.transaction;
	}

	render() {
		const { transaction, productsById } = this.props;

		return (
			<li className="transaction">
				<div className="name">
					<p>{transaction.firstName} {transaction.lastName}</p>
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
					<p>{moment.tz(transaction.created, 'America/Los_Angeles').format('MMM Do, h:mma')}</p>
				</div>
				<div className="confirmation">
					<p>{transaction.braintreeTransactionId}</p>
				</div>
				<div className="email">
					<p>{transaction.email}</p>
				</div>
			</li>
		);
	}
}

TransactionsListItem.propTypes = {
	transaction: PropTypes.object.isRequired,
	productsById: PropTypes.object.isRequired
};
