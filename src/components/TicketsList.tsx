import styles from './TicketsList.module.css';

import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';

interface Ticket {
	id: string;
	eventId: string;
	eventName: string;
	eventDate?: string;
	admissionTier: string;
	status: string;
	firstName: string;
	lastName: string;
}

interface TicketsListProps {
	tickets: Ticket[];
	selectedTickets: string[];
	setSelectedTickets: (tickets: string[]) => void;
}

function sortTickets(a: Ticket, b: Ticket) {
	// Rank by tier first
	if (a.admissionTier === 'vip' && b.admissionTier !== 'vip') return -1;
	if (a.admissionTier !== 'vip' && b.admissionTier === 'vip') return 1;

	return a.lastName > b.lastName ? 1 : -1;
}

const TicketsList = ({ tickets, selectedTickets, setSelectedTickets }: TicketsListProps) => {
	const eventsById: Record<string, { id: string; name: string; tickets: Ticket[] }> = {};

	tickets.forEach(ticket => {
		const { eventId, eventName } = ticket;
		if (!eventsById[eventId]) {
			eventsById[eventId] = {
				id: eventId,
				name: eventName,
				tickets: []
			};
		}

		eventsById[eventId].tickets.push(ticket);
	});

	const checkboxHandler = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const { checked, value: ticketId } = e.target;
			setSelectedTickets(checked ? [...selectedTickets, ticketId] : selectedTickets.filter(id => id !== ticketId));
		},
		[selectedTickets, setSelectedTickets]
	);

	return Object.values(eventsById).map(({ id: eventId, name: eventName, tickets: eventTickets }) => (
		<div key={eventId}>
			<h5>{eventName}</h5>
			<ul className={styles.ticketsList}>
				{[...eventTickets].sort(sortTickets).map(({ id, admissionTier, status, firstName, lastName }) => (
					<li key={id}>
						<input type="checkbox" id={`ticket-${id}`} checked={selectedTickets.includes(id)} value={id} onChange={checkboxHandler} disabled={status !== 'active'} />
						&nbsp;&nbsp;
						<strong>{admissionTier}</strong> - <span className={`ticket-status-${status}`}>{status}</span>:{' '}
						<Link to={`/guests/${id}`}>
							{firstName} {lastName} [{id.substring(0, 8)}]
						</Link>
					</li>
				))}
			</ul>
		</div>
	));
};

export default TicketsList;
