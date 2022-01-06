import React, { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import apiClient from 'utils/apiClient';

const EventContext = createContext({
	event: null,
	setEventId: () => {}
});

export default EventContext;

export function EventProvider({ children }) {
	const [eventId, setEventId] = useState('a0ae862c-1755-497c-b843-8457b5696a2a'),
		[event, setEvent] = useState(null);

	useEffect(() => {
		apiClient.get(`/events/${eventId}`)
			.then(setEvent)
			.catch(e => console.error('Events API Error', e));
	}, [eventId]);

	return (
		<EventContext.Provider value={{event, setEventId}}>
			{children}
		</EventContext.Provider>
	);
}

EventProvider.propTypes = {
	children: PropTypes.node.isRequired
};
