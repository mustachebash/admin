import styles from './CheckIn.module.css';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import { format } from 'date-fns';
import apiClient from '@/utils/apiClient';
import QrScanner from './QrScanner';

interface CheckInResponse {
	admissionTier: string;
	firstName: string;
	lastName: string;
}

interface CheckInErrorData {
	message: string;
	context?: React.ReactNode;
}

interface CheckInGuest {
	id: string;
	firstName: string;
	lastName: string;
	checkInTime: string;
	eventName: string;
	eventDate: string;
	status: string;
	checkedIn?: boolean;
}

const CheckIn = () => {
	const [inputting, setInputting] = useState(false),
		[checkInResponse, setCheckInResponse] = useState<CheckInResponse | null>(null),
		[checkInError, setCheckInError] = useState<CheckInErrorData | null>(null),
		[scanWithCamera, setScanWithCamera] = useState(false),
		// Create a permament reference to a mutable object
		data = useRef(''),
		responseDisplayTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

	const reset = useCallback(() => {
		data.current = '';
		setInputting(false);
		setCheckInError(null);
	}, [data]);

	const checkInWithToken = useCallback(
		(ticketToken: string) => {
			apiClient
				.post<CheckInResponse>('/check-ins', { ticketToken })
				.then(response => {
					setCheckInResponse(response);

					responseDisplayTimeout.current = setTimeout(() => setCheckInResponse(null), 3000);
				})
				.catch(err => {
					console.error('Check In API Error', err);

					const errData: CheckInErrorData = { message: '' },
						guest: CheckInGuest = err.responseBody;

					switch (err.statusCode) {
						case 404:
							errData.message = 'Ticket not found';
							break;

						case 409:
							errData.message = `Guest already checked in at ${format(new Date(guest.checkInTime), 'HH:mm')}`;
							errData.context = (
								<p>
									<Link to={`/guests/${guest.id}`}>See details for {`${guest.firstName} ${guest.lastName}`}</Link>
								</p>
							);
							break;

						case 410:
							errData.message = 'Event no longer available';
							errData.context = (
								<p>
									Ticket is for {guest.eventName} - {format(new Date(guest.eventDate), 'M/dd/yy')}
								</p>
							);
							break;

						case 412:
							errData.message = 'Event has not started';
							errData.context = (
								<p>
									Check In for {guest.eventName} available at {format(new Date(guest.eventDate), 'M/dd/yy - HH:mm')}
								</p>
							);
							break;

						case 423:
							errData.message = 'Ticket no longer valid';
							errData.context = (
								<p>
									Ticket status is {guest.status},&nbsp;
									<Link to={`/guests/${guest.id}`}>Guest status is {guest.status}</Link>{' '}
									{guest.checkedIn && `and has already checked in at ${format(new Date(guest.checkInTime), 'HH:mm')}`}
								</p>
							);
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
		},
		[data, responseDisplayTimeout]
	);

	useEffect(() => {
		const handleKeydown = (e: KeyboardEvent) => {
			// Enter is the final character inserted by the scanner
			// Don't attempt to submit empty values
			if (e.key === 'Enter' && data.current) {
				checkInWithToken(data.current);
			}

			// Anything else is not a single character
			if (e.key.length === 1) {
				// don't set this until we're for sure appending data
				if (!data.current) {
					setInputting(true);
					setCheckInResponse(null);
					setCheckInError(null);
					if (responseDisplayTimeout.current) {
						clearTimeout(responseDisplayTimeout.current);
					}
				}

				data.current += e.key;
			}
		};

		document.addEventListener('keydown', handleKeydown);

		return () => document.removeEventListener('keydown', handleKeydown);
	}, [checkInWithToken]);

	return (
		<div className={styles.checkIn}>
			<div
				className={classnames(styles.status, {
					[styles.inputting]: inputting,
					[styles.success]: checkInResponse,
					[styles.error]: checkInError,
					[styles.vip]: checkInResponse?.admissionTier === 'vip'
				})}
				onClick={reset}
			>
				<p className={styles.statusText}>
					{inputting
						? 'Scanning...'
						: checkInResponse
							? `${checkInResponse.firstName} ${checkInResponse.lastName}${checkInResponse.admissionTier === 'vip' ? ' - VIP 🕺' : ''}`
							: checkInError?.message || 'Ready!'}
				</p>
			</div>
			{checkInError?.context}
			<div className={styles.cameraScan} onClick={() => setScanWithCamera(prev => !prev)}>
				<p className={styles.scanText}>{scanWithCamera ? 'Cancel Scanning' : 'Scan With Camera'}</p>
				{scanWithCamera && (
					<QrScanner
						active={scanWithCamera}
						className={styles.scannerMount}
						onScan={decodedText => {
							checkInWithToken(decodedText);
							setScanWithCamera(false);
						}}
						onError={message => console.error('QR scan error', message)}
					/>
				)}
			</div>
		</div>
	);
};

export default CheckIn;
