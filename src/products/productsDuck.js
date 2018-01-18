/**
 * Products reducer/actions/action creators
 * DUCKS!!! https://github.com/erikras/ducks-modular-redux
 */

import _ from 'lodash';
import apiClient from 'utils/apiClient';

// Actions
const REQUEST_PRODUCTS = 'mustachebash/products/REQUEST_PRODUCTS',
	REQUEST_PRODUCT = 'mustachebash/products/REQUEST_PRODUCT',
	RECEIVE_PRODUCTS = 'mustachebash/products/RECEIVE_PRODUCTS',
	RECEIVE_PRODUCT = 'mustachebash/products/RECEIVE_PRODUCT',
	UPDATE_PRODUCT = 'mustachebash/products/UPDATE_PRODUCT';

export default function reducer(state = [], action = {}) {
	let productsIndex;

	switch (action.type) {
		case RECEIVE_PRODUCT:
			productsIndex = state.findIndex(product => product.key === action.product.key);
			if(~productsIndex) {
				return [
					...state.slice(0, productsIndex),
					action.product,
					...state.slice(productsIndex + 1)
				];
			} else {
				return [
					...state.slice(),
					action.product
				];
			}

		case RECEIVE_PRODUCTS:
			return _.unionWith(action.products, state, (a, b) => a.key === b.key);

		default:
			return state;
	}
}

export function communicationReducer(state = {}, action = {}) {
	switch (action.type) {
		case REQUEST_PRODUCT:
		case REQUEST_PRODUCTS:
			return Object.assign({}, state, {
				...state,
				isFetching: true
			});

		case RECEIVE_PRODUCT:
		case RECEIVE_PRODUCTS:
			return Object.assign({}, state, {
				...state,
				isFetching: false
			});

		default:
			return state;
	}
}

export function requestProduct(productKey) {
	return {
		type: REQUEST_PRODUCT,
		productKey
	};
}

export function requestProducts() {
	return {
		type: REQUEST_PRODUCTS
	};
}

export function receiveProduct(product) {
	return {
		type: RECEIVE_PRODUCT,
		product
	};
}

export function receiveProducts(products) {
	return {
		type: RECEIVE_PRODUCTS,
		products
	};
}

export function updateProduct(product) {
	return {
		type: UPDATE_PRODUCT,
		product
	};
}

export function fetchProduct(productKey, forceRefresh) {
	return (dispatch, getState) => {
		const state = getState();

		if(!forceRefresh && ~state.data.splitTests.findIndex(test => test.id === productKey)) {
			return Promise.resolve();
		} else {
			dispatch(requestProduct(productKey));

			return apiClient.get(`/products/${productKey}`, {requiresAuth: true})
				.then(response => dispatch(receiveProduct(response.product)))
				.catch(e => console.error(e));
		}
	};
}

export function fetchProducts(forceRefresh) {
	return (dispatch, getState) => {
		dispatch(requestProducts());

		return apiClient.get('/products', {requiresAuth: true})
			.then(response => dispatch(receiveProducts(response.products)))
			.catch(e => console.error(e));
	};
}
