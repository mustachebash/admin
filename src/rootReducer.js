import { combineReducers } from 'redux';
import { controlReducer, sessionReducer } from './appDuck';
import eventsReducer, { communicationReducer as eventsCommunicationReducer, summaryReducer as eventsSummaryReducer, chartReducer as eventsChartReducer } from './events/eventsDuck';
import productsReducer, { communicationReducer as productsCommunicationReducer } from './products/productsDuck';
import transactionsReducer, { communicationReducer as transactionsCommunicationReducer } from './transactions/transactionsDuck';
import guestsReducer, { communicationReducer as guestsCommunicationReducer } from './guests/guestsDuck';
import promosReducer, { communicationReducer as promosCommunicationReducer } from './promos/promosDuck';

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
