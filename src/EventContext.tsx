import React, { createContext, useState, useEffect } from 'react';
import apiClient from '@/utils/apiClient';
import type { Event } from '@/types';

interface EventContextValue {
	event: Event | null;
	setEventId: (id: string) => void;
}

const EventContext = createContext<EventContextValue>({
	event: null,
	setEventId: () => {}
});

export default EventContext;

export function EventProvider({ children }: { children: React.ReactNode }) {
	const [eventId, setEventId] = useState('d716bc1b-4fae-45e1-be80-b359da47a1ea'),
		[event, setEvent] = useState<Event | null>(null);

	useEffect(() => {
		apiClient
			.get<Event>(`/events/${eventId}`)
			.then(setEvent)
			.catch(e => console.error('Events API Error', e));
	}, [eventId]);

	return <EventContext.Provider value={{ event, setEventId }}>{children}</EventContext.Provider>;
}
