import './TicketsList.less';

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

function sortTickets(a, b) {
	// Rank by tier first
	if(a.admissionTier === 'vip' && b.admissionTier !== 'vip') return -1;
	if(a.admissionTier !== 'vip' && b.admissionTier === 'vip') return 1;

	return a.id > b.id ? 1 : -1;
}

const TicketsList = ({ tickets }) => {
	const eventsById = {};

	tickets.forEach(ticket => {
		const { eventId, eventName, eventDate } = ticket;
		if(!eventsById[eventId]) {
			eventsById[eventId] = {
				id: eventId,
				name: eventName,
				tickets: []
			};
		}

		eventsById[eventId].tickets.push(ticket);
	});

	return Object.values(eventsById).map(({ id: eventId, name: eventName, dateString, timeString, tickets: eventTickets }) => (
		<div key={eventId}>
			<h5>{eventName}</h5>
			<ul className="tickets-list">
				{[...eventTickets].sort(sortTickets).map(({
					id,
					admissionTier,
					status
				}) => <li key={id}><strong>{admissionTier}</strong>: <Link to={`/guests/${id}`}>{id.substring(0, 8)}</Link> - <span className={`ticket-status-${status}`}>{status}</span></li>)}
			</ul>
		</div>
	));
};

TicketsList.propTypes = {
	tickets: PropTypes.array.isRequired
};

export default TicketsList;
