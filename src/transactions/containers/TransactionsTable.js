import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchTransactions } from '../transactionsDuck';
import TransactionsList from '../components/TransactionsList';
import Search from 'components/Search';

export class TransactionsTable extends Component {
	constructor(props) {
		super(props);

		this.state = {
			filter: '',
			sortBy: 'date',
			sortOrder: -1 // DESC
		};

		this.sortTransactions = this.sortTransactions.bind(this);
		this.switchTransactionsOrder = this.switchTransactionsOrder.bind(this);
		this.handleFilterChange = this.handleFilterChange.bind(this);
	}

	componentDidMount() {
		this.props.fetchTransactions(this.state.statusFilter);
	}

	getTransactionComparator() {
		return (a, b) => {
			let sort = 0;

			switch(this.state.sortBy) {
				default:
				case 'date':
					// This will (should) never be the same
					sort = a.timestamp > b.timestamp ? 1 : -1;
					break;

				case 'name':
					sort = a.last_name > b.last_name ? -1 : a.last_name === b.last_name ? 0 : 1;
					break;

				case 'amount':
					sort = Number(a.transaction_amount) > Number(b.transaction_amount) ? 1 : Number(a.transaction_amount) === Number(b.transaction_amount) ? 0 : -1;
					break;
			}

			return sort * this.state.sortOrder;
		};
	}

	sortTransactions(sortBy) {
		this.setState({
			sortBy
		});
	}

	switchTransactionsOrder() {
		this.setState({
			sortOrder: this.state.sortOrder * (-1)
		});
	}

	handleFilterChange(q) {
		this.setState({
			filter: q
		});
	}

	render() {
		const transactions = this.props.transactions.filter(p => {
			if(!this.state.filter) return true;

			const filter = this.state.filter.toLowerCase();

			return (
				(p.first_name + ' ' + p.last_name).toLowerCase().includes(filter) ||
				p.transaction_id.toLowerCase().includes(filter)
			);
		}).sort(this.getTransactionComparator());

		return (
			<div>
				<Search handleQueryChange={this.handleFilterChange} />

				<TransactionsList
					transactions={transactions}
					sortTransactions={this.sortTransactions}
					switchTransactionsOrder={this.switchTransactionsOrder}
					sortBy={this.state.sortBy}
					sortOrder={this.state.sortOrder}
				/>
			</div>
		);
	}
}

TransactionsTable.propTypes = {
	transactions: PropTypes.array.isRequired,
	fetchTransactions: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => ({
	transactions: state.data.transactions
});

export default connect(mapStateToProps, {
	fetchTransactions
})(TransactionsTable);
