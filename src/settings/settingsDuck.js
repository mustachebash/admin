/**
 * Settings reducer/actions/action creators
 * DUCKS!!! https://github.com/erikras/ducks-modular-redux
 */

import _ from 'lodash';
import apiClient from 'utils/apiClient';

// Actions
const REQUEST_SETTINGS = 'mustachebash/settings/REQUEST_SETTINGS',
	REQUEST_SETTING = 'mustachebash/settings/REQUEST_SETTING',
	RECEIVE_SETTINGS = 'mustachebash/settings/RECEIVE_SETTINGS',
	RECEIVE_SETTING = 'mustachebash/settings/RECEIVE_SETTING',
	UPDATE_SETTING = 'mustachebash/settings/UPDATE_SETTING';

export default function reducer(state = [], action = {}) {
	let settingsIndex;

	switch (action.type) {
		case RECEIVE_SETTING:
			settingsIndex = state.findIndex(setting => setting.key === action.setting.key);
			if(~settingsIndex) {
				return [
					...state.slice(0, settingsIndex),
					action.setting,
					...state.slice(settingsIndex + 1)
				];
			} else {
				return [
					...state.slice(),
					action.setting
				];
			}

		case RECEIVE_SETTINGS:
			return _.unionWith(action.settings, state, (a, b) => a.key === b.key);

		default:
			return state;
	}
}

export function communicationReducer(state = {}, action = {}) {
	switch (action.type) {
		case REQUEST_SETTING:
		case REQUEST_SETTINGS:
			return Object.assign({}, state, {
				...state,
				isFetching: true
			});

		case RECEIVE_SETTING:
		case RECEIVE_SETTINGS:
			return Object.assign({}, state, {
				...state,
				isFetching: false
			});

		default:
			return state;
	}
}

export function requestSetting(settingKey) {
	return {
		type: REQUEST_SETTING,
		settingKey
	};
}

export function requestSettings() {
	return {
		type: REQUEST_SETTINGS
	};
}

export function receiveSetting(setting) {
	return {
		type: RECEIVE_SETTING,
		setting
	};
}

export function receiveSettings(settings) {
	return {
		type: RECEIVE_SETTINGS,
		settings
	};
}

export function updateSetting(setting) {
	return {
		type: UPDATE_SETTING,
		setting
	};
}

export function fetchSetting(settingKey, forceRefresh) {
	return (dispatch, getState) => {
		const state = getState();

		if(!forceRefresh && ~state.data.splitTests.findIndex(test => test.id === settingKey)) {
			return Promise.resolve();
		} else {
			dispatch(requestSetting(settingKey));

			return apiClient.get(`/admin/settings/${settingKey}`, {requiresAuth: true})
				.then(response => dispatch(receiveSetting(response.setting)))
				.catch(e => console.error(e));
		}
	};
}

export function fetchSettings(forceRefresh) {
	return (dispatch, getState) => {
		dispatch(requestSettings());

		return apiClient.get('/admin/settings', {requiresAuth: true})
			.then(response => dispatch(receiveSettings(response.settings)))
			.catch(e => console.error(e));
	};
}

export function turnOnSales() {
	return (dispatch, getState) => {
		dispatch(updateSetting({key: 'salesOn', value: true}));

		return apiClient.patch('/admin/settings/salesOn', {value: true}, {requiresAuth: true})
			.then(response => dispatch(receiveSetting(response.setting)))
			.catch(e => console.error(e));
	};
}

export function turnOffSales() {
	return (dispatch, getState) => {
		dispatch(updateSetting({key: 'salesOn', value: false}));

		return apiClient.patch('/admin/settings/salesOn', {value: false}, {requiresAuth: true})
			.then(response => dispatch(receiveSetting(response.setting)))
			.catch(e => console.error(e));
	};
}
