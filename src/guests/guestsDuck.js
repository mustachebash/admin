/**
 * Guests reducer/actions/action creators
 * DUCKS!!! https://github.com/erikras/ducks-modular-redux
 */

import unionWith from 'lodash/unionWith';
import apiClient from 'utils/apiClient';

// Actions
const REQUEST_GUEST = 'mustachebash/guests/REQUEST_GUEST',
	REQUEST_GUESTS = 'mustachebash/guests/REQUEST_GUESTS',
	RECEIVE_GUEST = 'mustachebash/guests/RECEIVE_GUEST',
	RECEIVE_GUESTS = 'mustachebash/guests/RECEIVE_GUESTS',
	UPDATE_GUEST = 'mustachebash/guests/UPDATE_GUEST';

export default function reducer(state = [], action = {}) {
	switch (action.type) {
		case RECEIVE_GUEST:
			return unionWith([action.guest], state, (a, b) => a.id === b.id);

		case RECEIVE_GUESTS:
			return unionWith(action.guests, state, (a, b) => a.id === b.id);

		default:
			return state;
	}
}

export function communicationReducer(state = {}, action = {}) {
	switch (action.type) {
		case REQUEST_GUEST:
		case REQUEST_GUESTS:
			return {
				...state,
				isFetching: true
			};

		case RECEIVE_GUEST:
		case RECEIVE_GUESTS:
			return {
				...state,
				isFetching: false
			};

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

export function updateGuest(guestId) {
	return {
		type: UPDATE_GUEST,
		guestId
	};
}

export function checkIn(guestId) {
	return (dispatch) => {
		dispatch(updateGuest(guestId));

		apiClient.patch(`/guests/${guestId}`, {checkedIn: true})
			.then(g => dispatch(receiveGuest(g)))
			.catch(e => console.error('Guest API Error', e));
	};
}

export function checkOut(guestId) {
	return (dispatch, getState) => {
		dispatch(updateGuest(guestId));

		apiClient.patch(`/guests/${guestId}`, {checkedIn: false})
			.then(g => dispatch(receiveGuest(g)))
			.catch(e => console.error('Guest API Error', e));
	};
}

export function updateGuestName(guestId, { firstName, lastName }) {
	return (dispatch) => {
		dispatch(updateGuest(guestId));

		apiClient.patch(`/guests/${guestId}`, {firstName, lastName})
			.then(g => dispatch(receiveGuest(g)))
			.catch(e => console.error('Guest API Error', e));
	};
}

export function updateGuestNotes(guestId, notes) {
	return (dispatch) => {
		dispatch(updateGuest(guestId));

		apiClient.patch(`/guests/${guestId}`, {notes})
			.then(g => dispatch(receiveGuest(g)))
			.catch(e => console.error('Guest API Error', e));
	};
}

export function archiveGuest(guestId) {
	return (dispatch) => {
		return apiClient.delete(`/guests/${guestId}`)
			.then(guest => dispatch(receiveGuest(guest)))
			.catch(e => console.error('Guest API Error', e));
	};
}

export function fetchGuest(guestId) {
	return (dispatch) => {
		dispatch(requestGuest(guestId));

		return apiClient.get(`/guests/${guestId}`)
			.then(guest => dispatch(receiveGuest(guest)))
			.catch(e => console.error('Guest API Error', e));
	};
}

export function fetchGuests(query) {
	return (dispatch) => {
		dispatch(requestGuests());

		return apiClient.get('/guests', query)
			.then(guests => dispatch(receiveGuests(guests)))
			.catch(e => console.error('Guest API Error', e));
	};
}

export function addGuest(guest) {
	return (dispatch) => {
		return apiClient.post('/guests', guest)
			.then(guest => dispatch(receiveGuest(guest)))
			.catch(e => console.error('Guest API Error', e));
	};
}
