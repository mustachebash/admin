/**
 * Guests reducer/actions/action creators
 * DUCKS!!! https://github.com/erikras/ducks-modular-redux
 */

import _ from 'lodash';
import apiClient from 'utils/apiClient';

// Actions
export const REQUEST_GUEST = 'mustachebash/guests/REQUEST_GUEST',
	REQUEST_GUESTS = 'mustachebash/guests/REQUEST_GUESTS',
	RECEIVE_GUEST = 'mustachebash/guests/RECEIVE_GUEST',
	RECEIVE_GUESTS = 'mustachebash/guests/RECEIVE_GUESTS',
	UPDATE_GUEST = 'mustachebash/guests/UPDATE_GUEST';

export default function reducer(state = [], action = {}) {
	let guestIndex;

	switch (action.type) {
		case REQUEST_GUEST:
			return state;

		case REQUEST_GUESTS:
			return state;

		case RECEIVE_GUEST:
			guestIndex = state.findIndex(guest => guest.id === action.guest.id);
			if(~guestIndex) {
				return [
					...state.slice(0, guestIndex),
					action.guest,
					...state.slice(guestIndex + 1)
				];
			} else {
				return [
					...state.slice(),
					action.guest
				];
			}

		case RECEIVE_GUESTS:
			return _.unionWith(action.guests, state, (a, b) => a.id === b.id);

		default:
			return state;
	}
}

export function communicationReducer(state = {}, action = {}) {
	switch (action.type) {
		case REQUEST_GUEST:
		case REQUEST_GUESTS:
			return Object.assign({}, state, {
				...state,
				isFetching: true
			});

		case RECEIVE_GUEST:
		case RECEIVE_GUESTS:
			return Object.assign({}, state, {
				...state,
				isFetching: false
			});

		default:
			return state;
	}
}


export function requestGuest(guestId) {
	return {
		type: REQUEST_GUEST,
		guestId
	};
}

export function requestGuests() {
	return {
		type: REQUEST_GUESTS
	};
}

export function receiveGuest(guest) {
	return {
		type: RECEIVE_GUEST,
		guest
	};
}

export function receiveGuests(guests) {
	return {
		type: RECEIVE_GUESTS,
		guests
	};
}

export function updateGuest(guest) {
	return {
		type: UPDATE_GUEST,
		guest
	};
}

export function checkIn(guestId) {
	return (dispatch, getState) => {
		const {data: { guests }, session: { socketConnected }} = getState(),
			guest = Object.assign({}, guests.find(g => g.id === guestId));

		guest.checked_in = true;

		dispatch(updateGuest(guest));

		// If there's no socket connected, resort to HTTP
		if(!socketConnected) {
			apiClient.patch(`/guests/${guestId}`, {checked_in: true}, {requiresAuth: true})
				.then(response => dispatch(receiveGuest(response.guest)))
				.catch(e => console.error(e));
		}
	};
}

export function checkOut(guestId) {
	return (dispatch, getState) => {
		const {data: { guests }, session: { socketConnected }} = getState(),
			guest = Object.assign({}, guests.find(g => g.id === guestId));

		guest.checked_in = false;

		dispatch(updateGuest(guest));

		// If there's no socket connected, resort to HTTP
		if(!socketConnected) {
			apiClient.patch(`/guests/${guestId}`, {checked_in: false}, {requiresAuth: true})
				.then(response => dispatch(receiveGuest(response.guest)))
				.catch(e => console.error(e));
		}
	};
}

export function fetchGuest(guestId) {
	return (dispatch) => {
		dispatch(requestGuest(guestId));

		return apiClient.get(`/guests/${guestId}`, {requiresAuth: true})
			.then(response => dispatch(receiveGuest(response.guest)))
			.catch(e => console.error(e));
	};
}

export function fetchGuests(forceRefresh) {
	return (dispatch, getState) => {
		dispatch(requestGuests());

		return apiClient.get('/guests', {requiresAuth: true})
			.then(response => dispatch(receiveGuests(response.guests)))
			.catch(e => console.error(e));
	};
}
