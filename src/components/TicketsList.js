import './TicketsList.less';

import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

function sortTickets(a, b) {
	// Rank by tier first
	if(a.admissionTier === 'vip' && b.admissionTier !== 'vip') return -1;
	if(a.admissionTier !== 'vip' && b.admissionTier === 'vip') return 1;

	return a.lastName > b.lastName ? 1 : -1;
}

const TicketsList = ({ tickets, selectedTickets, setSelectedTickets }) => {
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

	const checkboxHandler = useCallback(e => {
		const { checked, value: ticketId } = e.target;
		setSelectedTickets(checked ? [...selectedTickets, ticketId] : selectedTickets.filter(id => id !== ticketId));
	}, [selectedTickets, setSelectedTickets]);

	return Object.values(eventsById).map(({ id: eventId, name: eventName, dateString, timeString, tickets: eventTickets }) => (
		<div key={eventId}>
			<h5>{eventName}</h5>
			<ul className="tickets-list">
				{[...eventTickets].sort(sortTickets).map(({
					id,
					admissionTier,
					status,
					firstName,
					lastName
				}) => (
					<li key={id}>
						<input
							type="checkbox"
							id={`ticket-${id}`}
							checked={selectedTickets.includes(id)}
							value={id}
							onChange={checkboxHandler}
							disabled={status !== 'active'}
						/>&nbsp;&nbsp;
						<strong>{admissionTier}</strong> - <span className={`ticket-status-${status}`}>{status}</span>: <Link to={`/guests/${id}`}>{firstName} {lastName} [{id.substring(0, 8)}]</Link>
					</li>
				))}
			</ul>
		</div>
	));
};

TicketsList.propTypes = {
	tickets: PropTypes.array.isRequired,
	selectedTickets: PropTypes.array.isRequired,
	setSelectedTickets: PropTypes.func.isRequired
};

export default TicketsList;
