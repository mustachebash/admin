import './Inspect.less';

import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { QrReader } from 'react-qr-reader';
import apiClient from 'utils/apiClient';

const CheckIn = () => {
	const [ guest, setGuest ] = useState(null),
		[ guestError, setGuestError ] = useState(''),
		[ scanWithCamera, setScanWithCamera ] = useState('');

	const inspectTicket = useCallback(ticketToken => {
		apiClient.post('/inspect', {ticketToken})
			.then(setGuest)
			.catch(err => {
				console.error('Ticket Inspect API Error', err);

				let errorMessage;
				switch(err.statusCode) {
					case 404:
						errorMessage = 'Guest not found';
						break;

					default:
						errorMessage = 'Something went wrong - scan again';
						break;
				}

				setGuestError(errorMessage);
			});
	}, []);

	const {
		firstName,
		lastName,
		created,
		createdReason,
		status,
		orderId,
		meta,
		admissionTier,
		checkInTime,
		eventName
	} = guest || {};

	return (
		<div className="inspect">
			<div className="camera-scan" onClick={() => (guest && setGuest(null), guestError && setGuestError(''), setScanWithCamera(!scanWithCamera))}>
				<p className="scan-text">{scanWithCamera ? 'Cancel Scanning' : 'Scan With Camera'}</p>
				{scanWithCamera &&
					<QrReader onResult={(result, error) => {
						if(result) return (inspectTicket(result.text), setScanWithCamera(false));
						if(error?.message) return (console.error(error));
					}} constraints={{facingMode: 'environment', height: 200, width: 200}} />
				}
			</div>
			{guestError && <p>{guestError}</p>}
			{guest &&
				<div className="ticket-data">
					<h2><span>{firstName} {lastName}</span>{admissionTier === 'vip' && <span className="vip">&nbsp;- VIP</span>}</h2>
					<h3><span>Created:</span> {format(new Date(created), 'M/dd/yy - HH:mm')}</h3>
					<h3><span>Event:</span> {eventName}</h3>
					<h3>
						<span>Status:</span> {
							status === 'checked_in'
								? <>Checked In {format(new Date(checkInTime), 'M/dd/yy - HH:mm')}</>
								: status
						}
					</h3>
					<h3><span>Notes:</span> {meta.comment || ' n/a '}</h3>

					<h3>
						<span>Order Id:</span> <Link to={`/orders/${orderId}`}>{orderId}</Link>
						{createdReason === 'transfer' && 'TRANSFER RECIPIENT'}
					</h3>
				</div>
			}
		</div>
	);
};

export default CheckIn;
