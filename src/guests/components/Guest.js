import './Guest.less';

import React, { useState, useEffect, useCallback, useContext, memo } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { checkScope } from 'utils';
import UserContext from 'UserContext';
import apiClient from 'utils/apiClient';
import TicketsList from 'components/TicketsList';

const Guest = ({ id }) => {
	const [guest, setGuest] = useState(),
		[event, setEvent] = useState(),
		[tickets, setTickets] = useState([]),
		[editingNotes, setEditingNotes] = useState(''),
		[notesInput, setNotesInput] = useState('');

	const { user } = useContext(UserContext);

	useEffect(() => {
		apiClient.get(`/guests/${id}`)
			.then(setGuest)
			.catch(e => console.error('Guest API Error', e));

		apiClient.get(`/guests/${id}/tickets`)
			.then(setTickets)
			.catch(e => console.error('Guest Tickets API Error', e));
	}, [id]);

	useEffect(() => {
		if(!guest) return;

		if(guest.notes) setNotesInput(guest.notes);

		const { eventId } = guest;
		apiClient.get(`/events/${eventId}`)
			.then(setEvent)
			.catch(e => console.error('Event API Error', e));
	}, [guest]);

	const saveNotes = useCallback(() => {
		apiClient.patch(`/guests/${id}`, {notes: notesInput})
			.then(setGuest)
			.then(() => setEditingNotes(false))
			.catch(e => console.error('Guest API Error', e));
	}, [notesInput, id]);

	if(!guest || !event) return <p>Loading...</p>;

	const {
			firstName,
			lastName,
			created,
			createdBy,
			status,
			transactionId,
			confirmationId,
			checkedIn,
			notes,
			vip,
			updatedBy
		} = guest,
		{ name: eventName } = event,
		{ role } = user;

	return (
		<div className="guest">
			<h1>Guest - {eventName}</h1>
			<div className="flex-row">
				<div className="flex-item">
					<h2><span>{firstName} {lastName}</span>{!!vip && <span title={updatedBy} className="vip">&nbsp;- VIP</span>}</h2>
					<h3><span>Created:</span> {format(new Date(created), 'M/dd/yy - HH:mm')}</h3>
					<h3>
						<span>Status:</span> {
							checkedIn
								? <>Checked In {format(new Date(checkedIn), 'M/dd/yy - HH:mm')}</>
								: status
						}
					</h3>
					<h3>
						<span>Notes:</span> {
							editingNotes
								? <fieldset>
									<input type="text" name="notes" placeholder="Notes" value={notesInput} onChange={e => setNotesInput(e.currentTarget.value)} />
									<button className="white" onClick={saveNotes}>Save</button><button onClick={() => (setEditingNotes(false), setNotesInput(notes))}>Cancel</button>
								</fieldset>
								: <>{notes || ' n/a '} <a href="#" onClick={e => (e.preventDefault(), setEditingNotes(true))}>edit</a></>
						}
					</h3>

					<h3>
						{checkScope(role, 'admin')
							? createdBy === 'purchase'
								? <><span>Confirmation Id:</span> <Link to={`/transactions/${transactionId}`}>{confirmationId}</Link></>
								: transactionId === 'COMPED'
									? <><span>Comped by:</span> {createdBy}</>
									: <><span>Created by:</span> {createdBy}/{transactionId}</>
							: <><span>Confirmation Id:</span> {confirmationId}</>
						}
					</h3>

					{checkScope(role, 'admin') && updatedBy && <h3><span>Updated by:</span> {updatedBy}</h3>}
				</div>
				<div className="flex-item">
					<h4>Tickets</h4>
					<TicketsList tickets={tickets} />
				</div>
			</div>
		</div>
	);
};

Guest.propTypes = {
	id: PropTypes.string.isRequired
};

export default memo(Guest);
