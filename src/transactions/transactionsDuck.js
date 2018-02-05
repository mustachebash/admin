/**
 * Transactions reducer/actions/action creators
 * DUCKS!!! https://github.com/erikras/ducks-modular-redux
 */

import { unionWith } from 'lodash';
import apiClient from 'utils/apiClient';

// Actions
const REQUEST_TRANSACTION = 'mustachebash/transactions/REQUEST_TRANSACTION',
	REQUEST_TRANSACTIONS = 'mustachebash/transactions/REQUEST_TRANSACTIONS',
	RECEIVE_TRANSACTION = 'mustachebash/transactions/RECEIVE_TRANSACTION',
	RECEIVE_TRANSACTIONS = 'mustachebash/transactions/RECEIVE_TRANSACTIONS';

export default function reducer(state = [], action = {}) {
	switch (action.type) {
		case REQUEST_TRANSACTION:
			return state;

		case REQUEST_TRANSACTIONS:
			return state;

		case RECEIVE_TRANSACTION:
			return unionWith([action.transaction], state, (a, b) => a.id === b.id);

		case RECEIVE_TRANSACTIONS:
			return unionWith(action.transactions, state, (a, b) => a.id === b.id);

		default:
			return state;
	}
}

export function communicationReducer(state = {}, action = {}) {
	switch (action.type) {
		case REQUEST_TRANSACTION:
		case REQUEST_TRANSACTIONS:
			return Object.assign({}, state, {
				...state,
				isFetching: true
			});

		case RECEIVE_TRANSACTION:
		case RECEIVE_TRANSACTIONS:
			return Object.assign({}, state, {
				...state,
				isFetching: false
			});

		default:
			return state;
	}
}

export function requestTransaction(transactionId) {
	return {
		type: REQUEST_TRANSACTION,
		transactionId
	};
}

export function requestTransactions() {
	return {
		type: REQUEST_TRANSACTIONS
	};
}

export function receiveTransaction(transaction) {
	return {
		type: RECEIVE_TRANSACTION,
		transaction
	};
}

export function receiveTransactions(transactions) {
	return {
		type: RECEIVE_TRANSACTIONS,
		transactions
	};
}

export function fetchTransaction(transactionId) {
	return (dispatch) => {
		dispatch(requestTransaction(transactionId));

		return apiClient.get(`/transactions/${transactionId}`)
			.then(transaction => dispatch(receiveTransaction(transaction)))
			.catch(e => console.error('Transactions API Error', e));
	};
}

export function fetchTransactions(query) {
	return (dispatch) => {
		dispatch(requestTransactions());

		return apiClient.get('/transactions', query)
			.then(transactions => dispatch(receiveTransactions(transactions)))
			.catch(e => console.error('Transactions API Error', e));
	};
}
