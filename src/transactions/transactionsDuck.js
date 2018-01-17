/**
 * Transactions reducer/actions/action creators
 * DUCKS!!! https://github.com/erikras/ducks-modular-redux
 */

import _ from 'lodash';
import apiClient from 'utils/apiClient';

// Actions
const REQUEST_TRANSACTION = 'mustachebash/transactions/REQUEST_TRANSACTION',
	REQUEST_TRANSACTIONS = 'mustachebash/transactions/REQUEST_TRANSACTIONS',
	RECEIVE_TRANSACTION = 'mustachebash/transactions/RECEIVE_TRANSACTION',
	RECEIVE_TRANSACTIONS = 'mustachebash/transactions/RECEIVE_TRANSACTIONS';

export default function reducer(state = [], action = {}) {
	let transactionIndex;

	switch (action.type) {
		case REQUEST_TRANSACTION:
			return state;

		case REQUEST_TRANSACTIONS:
			return state;

		case RECEIVE_TRANSACTION:
			transactionIndex = state.findIndex(transaction => transaction.id === action.transaction.id);
			if(~transactionIndex) {
				return [
					...state.slice(0, transactionIndex),
					action.transaction,
					...state.slice(transactionIndex + 1)
				];
			} else {
				return [
					...state.slice(),
					action.transaction
				];
			}

		case RECEIVE_TRANSACTIONS:
			return _.unionWith(action.transactions, state, (a, b) => a.id === b.id);

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

export function fetchTransaction(transactionId, forceRefresh) {
	return (dispatch, getState) => {
		const state = getState();

		if(!forceRefresh && ~state.data.splitTests.findIndex(test => test.id === transactionId)) {
			return Promise.resolve();
		} else {
			dispatch(requestTransaction(transactionId));

			return apiClient.get(`/transactions/${transactionId}`, {requiresAuth: true})
				.then(response => dispatch(receiveTransaction(response.transaction)))
				.catch(e => console.error(e));
		}
	};
}

export function fetchTransactions(forceRefresh) {
	return (dispatch, getState) => {
		dispatch(requestTransactions());

		return apiClient.get('/transactions', {requiresAuth: true})
			.then(response => dispatch(receiveTransactions(response.transactions)))
			.catch(e => console.error(e));
	};
}
