import styles from './Inspect.module.css';

import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import apiClient from '@/utils/apiClient';
import QrScanner from './QrScanner';

interface InspectGuest {
	id: string;
	firstName: string;
	lastName: string;
	created: string;
	createdReason?: string;
	status: string;
	orderId: string;
	admissionTier: string;
	checkInTime: string | null;
	eventId: string;
	eventName: string;
	eventDate: string;
	eventStatus: string;
}

const CheckIn = () => {
	const [guest, setGuest] = useState<InspectGuest | null>(null),
		[guestError, setGuestError] = useState(''),
		[scanWithCamera, setScanWithCamera] = useState(false);

	const inspectTicket = useCallback((ticketToken: string) => {
		apiClient
			.post<InspectGuest>('/inspect', { ticketToken })
			.then(setGuest)
			.catch(err => {
				console.error('Ticket Inspect API Error', err);

				let errorMessage;
				switch (err.statusCode) {
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

	const { firstName, lastName, created, createdReason, status, orderId, admissionTier, checkInTime, eventName } = guest || ({} as InspectGuest);

	return (
		<div className={styles.inspect}>
			<div className={styles.cameraScan} onClick={() => (guest && setGuest(null), guestError && setGuestError(''), setScanWithCamera(prev => !prev))}>
				<p className={styles.scanText}>{scanWithCamera ? 'Cancel Scanning' : 'Scan With Camera'}</p>
				{scanWithCamera && (
					<QrScanner
						active={scanWithCamera}
						className={styles.scannerMount}
						onScan={decodedText => {
							inspectTicket(decodedText);
							setScanWithCamera(false);
						}}
						onError={message => console.error('QR scan error', message)}
					/>
				)}
			</div>
			{guestError && <p>{guestError}</p>}
			{guest && (
				<div className="ticket-data">
					<h2>
						<span>
							{firstName} {lastName}
						</span>
						{admissionTier === 'vip' && <span className="vip">&nbsp;- VIP</span>}
					</h2>
					<h3>
						<span>Created:</span> {format(new Date(created), 'M/dd/yy - HH:mm')}
					</h3>
					<h3>
						<span>Event:</span> {eventName}
					</h3>
					<h3>
						<span>Status:</span> {status === 'checked_in' && checkInTime ? <>Checked In {format(new Date(checkInTime), 'M/dd/yy - HH:mm')}</> : status}
					</h3>

					<h3>
						<span>Order Id:</span> <Link to={`/orders/${orderId}`}>{orderId}</Link>
						{createdReason === 'transfer' && 'TRANSFER RECIPIENT'}
					</h3>
				</div>
			)}
		</div>
	);
};

export default CheckIn;
