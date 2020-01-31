import React, { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import apiClient from 'utils/apiClient';

const EventContext = createContext({
	event: null,
	setEventId: () => {}
});

export default EventContext;

export function EventProvider({ children }) {
	const [eventId, setEventId] = useState('34a99b2a-f826-406a-8227-921efd03ebff'),
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
