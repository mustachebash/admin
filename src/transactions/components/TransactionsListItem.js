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
					<p>{transaction.first_name} {transaction.last_name}</p>
				</div>
				<div className="amount">
					<p>${Number(transaction.transaction_amount).toFixed(0)}</p>
				</div>
				<div className="additional-guests">
					<ul>
						{transaction.additional_guests && transaction.additional_guests.map((guest, i) => <li key={guest.first_name + guest.last_name + i}>{guest.first_name}&nbsp;{guest.last_name}</li>)}
					</ul>
				</div>
				<div className="date">
					<p>{moment.tz(transaction.timestamp, 'America/Los_Angeles').format('MMM Do, h:mma')}</p>
				</div>
				<div className="transaction">
					<p>{transaction.transaction_id}</p>
				</div>
			</li>
		);
	}
}

TransactionsListItem.propTypes = {
	transaction: PropTypes.object.isRequired
};
