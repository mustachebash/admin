import './TransactionsList.less';

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import TransactionsListItem from './TransactionsListItem';

const TransactionsList = ({ transactions, products, sortBy, sortOrder, sortTransactions, switchTransactionsOrder }) => {
	const productsById = products.reduce((obj, cur) => (obj[cur.id] = cur, obj), {});

	return (
		<ul className="transactions-list">
			<li className="table-header">
				<div className="name">
					<h5
						className={classnames({
							sortable: true,
							sorted: sortBy === 'name',
							asc: sortOrder === 1,
							desc: sortOrder === -1
						})}
						onClick={() => sortBy !== 'name' ? sortTransactions('name') : switchTransactionsOrder()}
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
						onClick={() => sortBy !== 'amount' ? sortTransactions('amount') : switchTransactionsOrder()}
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
						onClick={() => sortBy !== 'date' ? sortTransactions('date') : switchTransactionsOrder()}
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
			{transactions.map(transaction =>
				<>
					<TransactionsListItem key={transaction.id} transaction={transaction} productsById={productsById} />
					{transaction.transfer && <TransactionsListItem key={transaction.transfer.id} transferee transaction={transaction.transfer} productsById={productsById} />}
				</>
			)}
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
