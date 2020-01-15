/**
 * Promos reducer/actions/action creators
 * DUCKS!!! https://github.com/erikras/ducks-modular-redux
 */

import unionWith from 'lodash/unionWith';
import apiClient from 'utils/apiClient';

// Actions
const REQUEST_PROMO = 'mustachebash/promos/REQUEST_PROMO',
	REQUEST_PROMOS = 'mustachebash/promos/REQUEST_PROMOS',
	RECEIVE_PROMO = 'mustachebash/promos/RECEIVE_PROMO',
	RECEIVE_PROMOS = 'mustachebash/promos/RECEIVE_PROMOS',
	UPDATE_PROMO = 'mustachebash/promos/UPDATE_PROMO';

export default function reducer(state = [], action = {}) {
	switch (action.type) {
		case RECEIVE_PROMO:
			return unionWith([action.promo], state, (a, b) => a.id === b.id);

		case RECEIVE_PROMOS:
			return unionWith(action.promos, state, (a, b) => a.id === b.id);

		default:
			return state;
	}
}

export function communicationReducer(state = {}, action = {}) {
	switch (action.type) {
		case REQUEST_PROMO:
		case REQUEST_PROMOS:
			return {
				...state,
				isFetching: true
			};

		case RECEIVE_PROMO:
		case RECEIVE_PROMOS:
			return {
				...state,
				isFetching: false
			};

		default:
			return state;
	}
}


export function requestPromo(promoId) {
	return {
		type: REQUEST_PROMO,
		promoId
	};
}

export function requestPromos() {
	return {
		type: REQUEST_PROMOS
	};
}

export function receivePromo(promo) {
	return {
		type: RECEIVE_PROMO,
		promo
	};
}

export function receivePromos(promos) {
	return {
		type: RECEIVE_PROMOS,
		promos
	};
}

export function updatePromoRequest(promoId) {
	return {
		type: UPDATE_PROMO,
		promoId
	};
}

export function updatePromo(promoId, { firstName, lastName }) {
	return (dispatch) => {
		dispatch(updatePromoRequest(promoId));

		apiClient.patch(`/promos/${promoId}`, {firstName, lastName})
			.then(g => dispatch(receivePromo(g)))
			.catch(e => console.error('Promo API Error', e));
	};
}

export function disablePromo(promoId) {
	return (dispatch) => {
		return apiClient.delete(`/promos/${promoId}`)
			.then(promo => dispatch(receivePromo(promo)))
			.catch(e => console.error('Promo API Error', e));
	};
}

export function fetchPromos(query) {
	return (dispatch) => {
		dispatch(requestPromos());

		return apiClient.get('/promos', query)
			.then(promos => dispatch(receivePromos(promos)))
			.catch(e => console.error('Promo API Error', e));
	};
}

export function addPromo(promo) {
	return (dispatch) => {
		return apiClient.post('/promos', promo)
			.then(promo => dispatch(receivePromo(promo)))
			.catch(e => console.error('Promo API Error', e));
	};
}
