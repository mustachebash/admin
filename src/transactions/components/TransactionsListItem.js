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
		const { transaction } = this.props;

		return (
			<li className="transaction">
				<div className="name">
					<p>{transaction.firstName} {transaction.lastName}</p>
				</div>
				<div className="amount">
					<p>${transaction.amount.toFixed(0)}</p>
				</div>
				<div className="additional-guests">
					<pre>
						{JSON.stringify(transaction.order, null, 2)}
					</pre>
				</div>
				<div className="date">
					<p>{moment.tz(transaction.created, 'America/Los_Angeles').format('MMM Do, h:mma')}</p>
				</div>
				<div className="transaction">
					<p>{transaction.braintreeTransactionId}</p>
				</div>
			</li>
		);
	}
}

TransactionsListItem.propTypes = {
	transaction: PropTypes.object.isRequired
};
