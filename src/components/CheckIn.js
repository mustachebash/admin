import './CheckIn.less';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import { format } from 'date-fns';
import { QrReader } from 'react-qr-reader';
import apiClient from 'utils/apiClient';

const CheckIn = () => {
	const [ inputting, setInputting ] = useState(false),
		[ checkInResponse, setCheckInResponse ] = useState(null),
		[ checkInError, setCheckInError ] = useState(null),
		[ scanWithCamera, setScanWithCamera ] = useState(''),
		// Create a permament reference to a mutable object
		data = useRef(''),
		responseDisplayTimeout = useRef(null);

	const reset = useCallback(() => {
		data.current = '';
		setInputting(false);
		setCheckInError(null);
	}, [data]);

	const checkInWithToken = useCallback(ticketToken => {
		apiClient.post('/check-ins', {ticketToken})
			.then(response => {
				setCheckInResponse(response);

				responseDisplayTimeout.current = setTimeout(() => setCheckInResponse(null), 3000);
			})
			.catch(err => {
				console.error('Check In API Error', err);

				const errData = {},
					guest = err.responseBody;

				switch(err.statusCode) {
					case 404:
						errData.message = 'Ticket not found';
						break;

					case 409:
						errData.message = `Guest already checked in at ${format(new Date(guest.checkInTime), 'HH:mm')}`;
						errData.context = <p><Link to={`/guests/${guest.id}`}>See details for {`${guest.firstName} ${guest.lastName}`}</Link></p>;
						break;

					case 410:
						errData.message = 'Event no longer available';
						errData.context = <p>Ticket is for {guest.eventName} - {format(new Date(guest.eventDate), 'M/dd/yy')}</p>;
						break;

					case 412:
						errData.message = 'Event has not started';
						errData.context = <p>Check In for {guest.eventName} available at {format(new Date(guest.eventDate), 'M/dd/yy - HH:mm')}</p>;
						break;

					case 423:
						errData.message = 'Ticket no longer valid';
						errData.context = <p>
							Ticket status is {guest.status},&nbsp;
							<Link to={`/guests/${guest.id}`}>Guest status is {guest.status}</Link> {guest.checkedIn && `and has already checked in at ${format(new Date(guest.checkInTime), 'HH:mm')}`}
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
	}, [data, responseDisplayTimeout]);

	useEffect(() => {
		const handleKeydown = e => {
			// Enter is the final character inserted by the scanner
			// Don't attempt to submit empty values
			if(e.key === 'Enter' && data.current) {
				checkInWithToken(data.current);
			}

			// Anything else is not a single character
			if(e.key.length === 1) {
				// don't set this until we're for sure appending data
				if(!data.current) {
					setInputting(true);
					setCheckInResponse(null);
					setCheckInError(null);
					clearTimeout(responseDisplayTimeout.current);
				}

				data.current += e.key;
			}
		};

		document.addEventListener('keydown', handleKeydown);

		return () => document.removeEventListener('keydown', handleKeydown);
	}, []);

	return (
		<div className="check-in">
			<div className={classnames('status', {inputting, success: checkInResponse, error: checkInError, vip: checkInResponse?.admissionTier === 'vip'})} onClick={reset}>
				<p className="status-text">
					{inputting
						? 'Scanning...'
						: checkInResponse
							? `${checkInResponse.firstName} ${checkInResponse.lastName}${checkInResponse.admissionTier === 'vip' ? ' - VIP 🕺' : ''}`
							: checkInError?.message || 'Ready!'
					}
				</p>
			</div>
			{checkInError?.context}
			<div className="camera-scan" onClick={() => setScanWithCamera(!scanWithCamera)}>
				<p className="scan-text">{scanWithCamera ? 'Cancel Scanning' : 'Scan With Camera'}</p>
				{scanWithCamera &&
					<QrReader onResult={(result, error) => {
						if(result) return (checkInWithToken(result.text), setScanWithCamera(false));
						if(error?.message) return (console.error(error));
					}} constraints={{facingMode: 'environment', height: 200, width: 200}} />
				}
			</div>
		</div>
	);
};

export default CheckIn;
