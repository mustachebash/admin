import './CheckIn.less';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import { format } from 'date-fns';
import apiClient from 'utils/apiClient';

const CheckIn = () => {
	const [ inputting, setInputting ] = useState(false),
		[ checkInResponse, setCheckInResponse ] = useState(null),
		[ checkInError, setCheckInError ] = useState(null),
		// Create a permament reference to a mutable object
		data = useRef('');

	const reset = useCallback(() => {
		data.current = '';
		setInputting(false);
		setCheckInError(null);
	}, [data]);

	useEffect(() => {
		let responseDisplayTimeout;
		const handleKeydown = e => {
			// Enter is the final character inserted by the scanner
			// Don't attempt to submit empty values
			if(e.key === 'Enter' && data.current) {
				const lastToken = data.current;
				apiClient.post('/check-ins', {ticketToken: lastToken})
					.then(response => {
						setCheckInResponse(response);

						responseDisplayTimeout = setTimeout(() => setCheckInResponse(null), 3000);
					})
					.catch(err => {
						console.error('Check In API Error', err);

						const errData = {},
							{ ticket, guest, event } = err.responseBody || {};

						switch(err.statusCode) {
							case 404:
								errData.message = 'Ticket not found';
								break;

							case 409:
								errData.message = `Guest already checked in at ${format(new Date(guest.checkedIn), 'HH:mm')}`;
								errData.context = <p><Link to={`/guests/${guest.id}`}>See details for {`${guest.firstName} ${guest.lastName}`}</Link></p>;
								break;

							case 410:
								errData.message = 'Event no longer available';
								errData.context = <p>Ticket is for {event.name} - {format(new Date(event.date), 'M/dd/yy')}</p>;
								break;

							case 412:
								errData.message = 'Event has not started';
								errData.context = <p>Check In for {event.name} available at {format(new Date(event.date), 'M/dd/yy - HH:mm')}</p>;
								break;

							case 423:
								errData.message = 'Ticket no longer valid';
								errData.context = <p>
									Ticket status is {ticket.status},&nbsp;
									<Link to={`/guests/${guest.id}`}>Guest status is {guest.status}</Link> {guest.checkedIn && `and has already checked in at ${format(new Date(guest.checkedIn), 'HH:mm')}`}
								</p>;
								break;

							default:
								errData.message = 'Something went wrong - scan again';
								break;
						}

						setCheckInError(errData);
					})
					.finally(() => {
						setInputting(false);
						data.current = '';
					});
			}

			// Anything else is not a single character
			if(e.key.length === 1) {
				// don't set this until we're for sure appending data
				if(!data.current) {
					setInputting(true);
					setCheckInResponse(null);
					setCheckInError(null);
					clearTimeout(responseDisplayTimeout);
				}

				data.current += e.key;
			}
		};

		document.addEventListener('keydown', handleKeydown);

		return () => document.removeEventListener('keydown', handleKeydown);
	}, []);

	return (
		<div className="check-in">
			<div className={classnames('status', {inputting, success: checkInResponse, error: checkInError})} onClick={reset}>
				<p className="status-text">
					{inputting
						? 'Scanning...'
						: checkInResponse
							? `${checkInResponse.guest.firstName} ${checkInResponse.guest.lastName}`
							: checkInError?.message || 'Ready!'
					}
				</p>
			</div>
			{checkInError?.context}
		</div>
	);
};

export default CheckIn;
