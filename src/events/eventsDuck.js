/**
 * Events reducer/actions/action creators
 * DUCKS!!! https://github.com/erikras/ducks-modular-redux
 */

import _ from 'lodash';
import apiClient from 'utils/apiClient';

// Actions
const REQUEST_EVENTS = 'mustachebash/events/REQUEST_EVENTS',
	REQUEST_EVENT = 'mustachebash/events/REQUEST_EVENT',
	RECEIVE_EVENTS = 'mustachebash/events/RECEIVE_EVENTS',
	RECEIVE_EVENT = 'mustachebash/events/RECEIVE_EVENT',
	UPDATE_EVENT = 'mustachebash/events/UPDATE_EVENT';

export default function reducer(state = [], action = {}) {
	let eventsIndex;

	switch (action.type) {
		case RECEIVE_EVENT:
			eventsIndex = state.findIndex(event => event.key === action.event.key);
			if(~eventsIndex) {
				return [
					...state.slice(0, eventsIndex),
					action.event,
					...state.slice(eventsIndex + 1)
				];
			} else {
				return [
					...state.slice(),
					action.event
				];
			}

		case RECEIVE_EVENTS:
			return _.unionWith(action.events, state, (a, b) => a.key === b.key);

		default:
			return state;
	}
}

export function communicationReducer(state = {}, action = {}) {
	switch (action.type) {
		case REQUEST_EVENT:
		case REQUEST_EVENTS:
			return Object.assign({}, state, {
				...state,
				isFetching: true
			});

		case RECEIVE_EVENT:
		case RECEIVE_EVENTS:
			return Object.assign({}, state, {
				...state,
				isFetching: false
			});

		default:
			return state;
	}
}

export function requestEvent(eventKey) {
	return {
		type: REQUEST_EVENT,
		eventKey
	};
}

export function requestEvents() {
	return {
		type: REQUEST_EVENTS
	};
}

export function receiveEvent(event) {
	return {
		type: RECEIVE_EVENT,
		event
	};
}

export function receiveEvents(events) {
	return {
		type: RECEIVE_EVENTS,
		events
	};
}

export function updateEvent(event) {
	return {
		type: UPDATE_EVENT,
		event
	};
}

export function fetchEvent(eventKey, forceRefresh) {
	return (dispatch, getState) => {
		const state = getState();

		if(!forceRefresh && ~state.data.splitTests.findIndex(test => test.id === eventKey)) {
			return Promise.resolve();
		} else {
			dispatch(requestEvent(eventKey));

			return apiClient.get(`/events/${eventKey}`, {requiresAuth: true})
				.then(response => dispatch(receiveEvent(response.event)))
				.catch(e => console.error(e));
		}
	};
}

export function fetchEvents(forceRefresh) {
	return (dispatch, getState) => {
		dispatch(requestEvents());

		return apiClient.get('/events', {requiresAuth: true})
			.then(response => dispatch(receiveEvents(response.events)))
			.catch(e => console.error(e));
	};
}
