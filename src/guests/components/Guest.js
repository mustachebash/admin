import './Guest.less';

import React, { useState, useEffect, useContext, memo } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { checkScope } from 'utils';
import UserContext from 'UserContext';
import apiClient from 'utils/apiClient';

const Guest = ({ id }) => {
	const [guest, setGuest] = useState(),
		[event, setEvent] = useState(),
		[tickets, setTickets] = useState([]);

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

		const { eventId } = guest;
		apiClient.get(`/events/${eventId}`)
			.then(setEvent)
			.catch(e => console.error('Event API Error', e));
	}, [guest]);

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
			updatedBy
		} = guest,
		{ name: eventName } = event,
		{ role } = user;

	return (
		<div className="guest">
			<h1>Guest - {eventName}</h1>
			<div className="flex-row">
				<div className="flex-item">
					<h2><span>{firstName} {lastName}</span></h2>
					<h3><span>Created:</span> {format(new Date(created), 'M/dd/yy - HH:mm')}</h3>
					<h3>
						<span>Status:</span> {
							checkedIn
								? <>Checked In {format(new Date(checkedIn), 'M/dd/yy - HH:mm')}</>
								: status
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
					{tickets.map(ticket => <>{JSON.stringify(ticket)}</>)}
				</div>
			</div>
		</div>
	);
};

Guest.propTypes = {
	id: PropTypes.string.isRequired
};

export default memo(Guest);
