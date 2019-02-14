import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import TransactionsListItem from './TransactionsListItem';

const TransactionsList = (props) => {
	const { transactions, products } = props,
		productsById = {};

	products.forEach(p => productsById[p.id] = p);

	return (
		<ul className="transactions-list">
			<li className="table-header">
				<div className="name">
					<h5
						className={classnames({
							sortable: true,
							sorted: props.sortBy === 'name',
							asc: props.sortOrder === 1,
							desc: props.sortOrder === -1
						})}
						onClick={() => props.sortBy !== 'name' ? props.sortTransactions('name') : props.switchTransactionsOrder()}
					>
						Name
					</h5>
				</div>
				<div className="amount">
					<h5
						className={classnames({
							sortable: true,
							sorted: props.sortBy === 'amount',
							asc: props.sortOrder === 1,
							desc: props.sortOrder === -1
						})}
						onClick={() => props.sortBy !== 'amount' ? props.sortTransactions('amount') : props.switchTransactionsOrder()}
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
							sorted: props.sortBy === 'date',
							asc: props.sortOrder === 1,
							desc: props.sortOrder === -1
						})}
						onClick={() => props.sortBy !== 'date' ? props.sortTransactions('date') : props.switchTransactionsOrder()}
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
			{transactions.map(transaction => <TransactionsListItem key={transaction.id} transaction={transaction} productsById={productsById} />)}
		</ul>
	);
};

export default TransactionsList;

TransactionsList.propTypes = {
	transactions: PropTypes.array.isRequired,
	products: PropTypes.array.isRequired,
	sortTransactions: PropTypes.func.isRequired,
	switchTransactionsOrder: PropTypes.func.isRequired,
	sortBy: PropTypes.string.isRequired,
	sortOrder: PropTypes.number.isRequired
};
