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
					sort = a.created > b.created ? 1 : -1;
					break;

				case 'name':
					sort = a.lastName > b.lastName ? -1 : a.lastName === b.lastName ? 0 : 1;
					break;

				case 'amount':
					sort = a.amount > b.amount ? 1 : a.amount === b.amount ? 0 : -1;
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
				(p.firstName + ' ' + p.lastName).toLowerCase().includes(filter) ||
				p.braintreeTransactionId.toLowerCase().includes(filter)
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
