import { combineReducers } from 'redux';
import { controlReducer, sessionReducer } from './appDuck';
import eventsReducer, { communicationReducer as eventsCommunicationReducer, summaryReducer as eventsSummaryReducer, chartReducer as eventsChartReducer } from './events/eventsDuck';
import productsReducer, { communicationReducer as productsCommunicationReducer } from './products/productsDuck';
import transactionsReducer, { communicationReducer as transactionsCommunicationReducer } from './transactions/transactionsDuck';
import guestsReducer, { communicationReducer as guestsCommunicationReducer } from './guests/guestsDuck';
import promosReducer, { communicationReducer as promosCommunicationReducer } from './promos/promosDuck';

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
		promos: [
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
		],

		eventCharts: [
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
		promos: {

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
		promos: promosReducer,
		events: eventsReducer,
		eventSummaries: eventsSummaryReducer,
		eventCharts: eventsChartReducer,
		products: productsReducer
	}),
	communication: combineReducers({
		transactions: transactionsCommunicationReducer,
		guests: guestsCommunicationReducer,
		promos: promosCommunicationReducer,
		events: eventsCommunicationReducer,
		products: productsCommunicationReducer
	}),
	control: controlReducer,
	session: sessionReducer
});
