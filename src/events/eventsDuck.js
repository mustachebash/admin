/**
 * Events reducer/actions/action creators
 * DUCKS!!! https://github.com/erikras/ducks-modular-redux
 */

import unionWith from 'lodash/unionWith';
import apiClient from 'utils/apiClient';

// Actions
const REQUEST_EVENTS = 'mustachebash/events/REQUEST_EVENTS',
	REQUEST_EVENT = 'mustachebash/events/REQUEST_EVENT',
	RECEIVE_EVENTS = 'mustachebash/events/RECEIVE_EVENTS',
	RECEIVE_EVENT = 'mustachebash/events/RECEIVE_EVENT',
	RECEIVE_EVENT_SUMMARY = 'mustachebash/events/RECEIVE_EVENT_SUMMARY',
	RECEIVE_EVENT_CHART = 'mustachebash/events/RECEIVE_EVENT_CHART',
	UPDATE_EVENT = 'mustachebash/events/UPDATE_EVENT';

export default function reducer(state = [], action = {}) {
	switch (action.type) {
		case RECEIVE_EVENT:
			return unionWith([action.event], state, (a, b) => a.id === b.id);

		case RECEIVE_EVENTS:
			return unionWith(action.events, state, (a, b) => a.id === b.id);

		default:
			return state;
	}
}

export function summaryReducer(state = [], action = {}) {
	switch (action.type) {
		case RECEIVE_EVENT_SUMMARY:
			return unionWith([action.eventSummary], state, (a, b) => a.eventId === b.eventId);

		default:
			return state;
	}
}

export function chartReducer(state = [], action = {}) {
	switch (action.type) {
		case RECEIVE_EVENT_CHART:
			return unionWith([action.eventChart], state, (a, b) => a.eventId === b.eventId);

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

export function requestEvent(id) {
	return {
		type: REQUEST_EVENT,
		id
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

export function receiveEventSummary(eventSummary) {
	return {
		type: RECEIVE_EVENT_SUMMARY,
		eventSummary
	};
}

export function receiveEventChart(eventChart) {
	return {
		type: RECEIVE_EVENT_CHART,
		eventChart
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

export function fetchEvent(id) {
	return (dispatch) => {
		dispatch(requestEvent(id));

		return apiClient.get(`/events/${id}`)
			.then(event => dispatch(receiveEvent(event)))
			.catch(e => console.error('Events API Error', e));
	};
}

export function fetchEventSummary(id) {
	return (dispatch) => {
		dispatch(requestEvent(id));

		return apiClient.get(`/events/${id}/summary`)
			.then(eventSummary => dispatch(receiveEventSummary(eventSummary)))
			.catch(e => console.error('Events API Error', e));
	};
}

export function fetchEventChart(id) {
	return (dispatch) => {
		dispatch(requestEvent(id));

		return apiClient.get(`/events/${id}/chart`)
			.then(eventChart => dispatch(receiveEventChart(eventChart)))
			.catch(e => console.error('Events API Error', e));
	};
}

export function fetchEvents(status) {
	return (dispatch) => {
		dispatch(requestEvents());

		let query;
		if(status) {
			query = {status};
		}

		return apiClient.get('/events', query)
			.then(events => dispatch(receiveEvents(events)))
			.catch(e => console.error('Events API Error', e));
	};
}
