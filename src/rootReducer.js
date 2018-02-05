import { combineReducers } from 'redux';
import { controlReducer, sessionReducer } from './appDuck';
import eventsReducer, { communicationReducer as eventsCommunicationReducer, summaryReducer as eventsSummaryReducer } from './events/eventsDuck';
import productsReducer, { communicationReducer as productsCommunicationReducer } from './products/productsDuck';
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
		events: [
			{

			}
		],

		eventSummaries: [
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
		events: {

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
		events: eventsReducer,
		eventSummaries: eventsSummaryReducer,
		products: productsReducer
	}),
	communication: combineReducers({
		transactions: transactionsCommunicationReducer,
		guests: guestsCommunicationReducer,
		events: eventsCommunicationReducer,
		products: productsCommunicationReducer
	}),
	control: controlReducer,
	session: sessionReducer
});
