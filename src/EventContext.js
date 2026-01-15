import React, { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import apiClient from 'utils/apiClient';

const EventContext = createContext({
	event: null,
	setEventId: () => {}
});

export default EventContext;

export function EventProvider({ children }) {
	const [eventId, setEventId] = useState('d716bc1b-4fae-45e1-be80-b359da47a1ea'),
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
