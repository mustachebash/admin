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
	const [eventId, setEventId] = useState('86c2d349-1131-4f51-a750-34c3a2446897'),
		[event, setEvent] = useState<Event | null>(null);

	useEffect(() => {
		apiClient
			.get<Event>(`/events/${eventId}`)
			.then(setEvent)
			.catch(e => console.error('Events API Error', e));
	}, [eventId]);

	return <EventContext.Provider value={{ event, setEventId }}>{children}</EventContext.Provider>;
}
