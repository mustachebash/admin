import { combineReducers } from 'redux';
import { controlReducer, sessionReducer } from './appDuck';
import settingsReducer, { communicationReducer as settingsCommunicationReducer } from './settings/settingsDuck';
import transactionsReducer, { communicationReducer as transactionsCommunicationReducer } from './transactions/transactionsDuck';
import guestsReducer, { communicationReducer as guestsCommunicationReducer } from './guests/guestsDuck';

/* eslint-disable no-unused-vars*/
// Based around http://jamesknelson.com/5-types-react-application-state/
const sampleState = {
	// Our actual data
	data: {
		transactions: [
			{

			}
		],
		guests: [
			{

			}
		],
		settings: [
			{

			}
		]
	},

	// State about API requests
	communication: {
		transactions: {

		},
		guests: {

		},
		settings: {

		}
	},

	// State about App UI that must be shared across components
	// Do not use this unless you absolutely can't contain this within its own container lifecycle
	control: {

	},

	// State about the current user session
	session: {
		loginError: '',
		user: {

		}
	}
};
/* eslint-enable */

export default combineReducers({
	data: combineReducers({
		transactions: transactionsReducer,
		guests: guestsReducer,
		settings: settingsReducer
	}),
	communication: combineReducers({
		transactions: transactionsCommunicationReducer,
		guests: guestsCommunicationReducer,
		settings: settingsCommunicationReducer
	}),
	control: controlReducer,
	session: sessionReducer
});
