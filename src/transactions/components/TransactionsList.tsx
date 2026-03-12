import styles from './TransactionsList.module.css';

import React from 'react';
import classnames from 'classnames';
import TransactionsListItem from './TransactionsListItem';

interface TransactionsListProps {
	transactions: any[];
	products: any[];
	sortBy: string;
	sortOrder: number;
	sortTransactions: (by: string) => void;
	switchTransactionsOrder: () => void;
}

const TransactionsList = ({ transactions, products, sortBy, sortOrder, sortTransactions, switchTransactionsOrder }: TransactionsListProps) => {
	const productsById = products.reduce((obj: any, cur: any) => ((obj[cur.id] = cur), obj), {});

	return (
		<ul className={styles.transactionsList}>
			<li className={styles.tableHeader}>
				<div className="name">
					<h5
						className={classnames({
							sortable: true,
							sorted: sortBy === 'name',
							asc: sortOrder === 1,
							desc: sortOrder === -1
						})}
						onClick={() => (sortBy !== 'name' ? sortTransactions('name') : switchTransactionsOrder())}
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
						onClick={() => (sortBy !== 'amount' ? sortTransactions('amount') : switchTransactionsOrder())}
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
						onClick={() => (sortBy !== 'date' ? sortTransactions('date') : switchTransactionsOrder())}
					>
						Date Paid
					</h5>
				</div>
				<div className="confirmation">
					<h5>Confirmation</h5>
				</div>
				<div className="email">
					<h5>Email</h5>
				</div>
			</li>
			{transactions.map(transaction => (
				<React.Fragment key={transaction.id}>
					<TransactionsListItem key={transaction.id} transaction={transaction} productsById={productsById} />
					{transaction.transfer && <TransactionsListItem key={transaction.transfer.id} transferee transaction={transaction.transfer} productsById={productsById} />}
				</React.Fragment>
			))}
		</ul>
	);
};

export default TransactionsList;
