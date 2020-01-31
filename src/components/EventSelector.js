import React, { useState, useEffect, useContext, memo } from 'react';
import EventContext from 'EventContext';
import apiClient from 'utils/apiClient';

const EventSelector = () => {
	const [events, setEvents] = useState([]);

	const { event, setEventId } = useContext(EventContext);

	useEffect(() => {
		apiClient.get('/events')
			.then(res => setEvents(res.sort((a, b) => a.date > b.date ? -1 : 1)))
			.catch(e => console.error('Events API Error', e));
	}, []);

	return (
		<div className="events-selector">
			<div className="select-wrap">
				<select name="guests-events" value={event?.id} disabled={!event} onChange={e => setEventId(e.currentTarget.value)}>
					{event
						? events.map(ev => <option value={ev.id} key={ev.id}>{ev.name}</option>)
						: <option disabled value="">Loading...</option>
					}
				</select>
			</div>
		</div>
	);
};

export default memo(EventSelector);
