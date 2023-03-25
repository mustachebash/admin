import './Inspect.less';

import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import { format } from 'date-fns';
import { QrReader } from 'react-qr-reader';
import apiClient from 'utils/apiClient';

const CheckIn = () => {
	const [ guest, setGuest ] = useState(null),
		[ guestError, setGuestError ] = useState(''),
		[ scanWithCamera, setScanWithCamera ] = useState('');

	const inspectTicket = useCallback(ticketToken => {
		try {
			const {aud: guestId} = jwtDecode(ticketToken);

			apiClient.get(`/guests/${guestId}`)
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
		} catch(e) {
			setGuestError(`Failed to decode. QR contents: '${ticketToken}'`);
		}
	}, []);

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
					<h2><span>{firstName} {lastName}</span>{!!vip && <span title={updatedBy} className="vip">&nbsp;- VIP</span>}</h2>
					<h3><span>Created:</span> {format(new Date(created), 'M/dd/yy - HH:mm')}</h3>
					<h3>
						<span>Status:</span> {
							checkedIn
								? <>Checked In {format(new Date(checkedIn), 'M/dd/yy - HH:mm')}</>
								: status
						}
					</h3>
					<h3><span>Notes:</span> {notes || ' n/a '}</h3>

					<h3>
						{createdBy === 'purchase'
							? <><span>Confirmation Id:</span> <Link to={`/transactions/${transactionId}`}>{confirmationId}</Link></>
							: transactionId === 'COMPED'
								? <><span>Comped by:</span> {createdBy}</>
								: <><span>Created by:</span> {createdBy}/{transactionId}</>
						}
					</h3>

					{updatedBy && <h3><span>Updated by:</span> {updatedBy}</h3>}
				</div>
			}
		</div>
	);
};

export default CheckIn;
