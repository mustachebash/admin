/**
 * Products reducer/actions/action creators
 * DUCKS!!! https://github.com/erikras/ducks-modular-redux
 */

import unionWith from 'lodash/unionWith';
import apiClient from 'utils/apiClient';

// Actions
const REQUEST_PRODUCTS = 'mustachebash/products/REQUEST_PRODUCTS',
	REQUEST_PRODUCT = 'mustachebash/products/REQUEST_PRODUCT',
	RECEIVE_PRODUCTS = 'mustachebash/products/RECEIVE_PRODUCTS',
	RECEIVE_PRODUCT = 'mustachebash/products/RECEIVE_PRODUCT',
	UPDATE_PRODUCT = 'mustachebash/products/UPDATE_PRODUCT';

export default function reducer(state = [], action = {}) {
	switch (action.type) {
		case RECEIVE_PRODUCT:
			return unionWith([action.product], state, (a, b) => a.id === b.id);

		case RECEIVE_PRODUCTS:
			return unionWith(action.products, state, (a, b) => a.id === b.id);

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

export function fetchProduct(id) {
	return (dispatch) => {
		dispatch(requestProduct(id));

		return apiClient.get(`/products/${id}`)
			.then(product => dispatch(receiveProduct(product)))
			.catch(e => console.error('Products API Error', e));
	};
}

export function fetchProducts() {
	return (dispatch) => {
		dispatch(requestProducts());

		return apiClient.get('/products')
			.then(products => dispatch(receiveProducts(products)))
			.catch(e => console.error('Products API Error', e));
	};
}
