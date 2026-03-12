import styles from './GuestsListItem.module.css';

import { memo } from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import { format } from 'date-fns';
import { checkScope } from '@/utils';
import { EVENT_2020_ID } from '@/config';

interface GuestsListItemProps {
	guest: any;
	updateGuest: (id: string, updates: Record<string, unknown>) => void;
	event: any;
	role: string;
}

const GuestsListItem = ({ guest, updateGuest, event, role }: GuestsListItemProps) => (
	<li className={styles.guestsListItem}>
		<div className={styles.checkedIn}>
			{guest.status === 'archived' ? (
				<span className={styles.noEntry}>&#x26D4; No entry</span>
			) : (
				<span
					className={classnames({ [styles.checked]: guest.status === 'checked_in', [styles.comped]: guest.createdReason === 'comp' })}
					title={guest.status === 'checked_in' ? format(new Date(guest.checkInTime), 'MMM do, h:mma') : 'Check In'}
					onClick={() =>
						(guest.createdReason === 'comp' || window.confirm('Are you sure you want to manually update this guest?')) &&
						updateGuest(guest.id, { status: guest.status === 'checked_in' ? 'active' : 'checked_in' })
					}
				></span>
			)}
		</div>

		<div className="name">
			<p>
				<Link to={`/guests/${guest.id}`}>
					{guest.firstName} {guest.lastName}
				</Link>
			</p>
			{guest.meta.comment && <p className={styles.guestNotes}>Notes: {guest.meta.comment}</p>}
		</div>
		<div className={styles.date}>
			<p>{format(new Date(guest.created), 'MMM do, h:mma')}</p>
		</div>
		<div className="event">
			<p>{guest.eventId === EVENT_2020_ID ? 'Mustache Bash 2020' : event.name}</p>
		</div>
		<div className="order-id">
			<p>{guest.orderId ? <Link to={`/orders/${guest.orderId}`}>{guest.orderId.slice(0, 8)}</Link> : `${guest.createdReason} - ${guest.admissionTier}`}</p>
		</div>
		<div className={classnames(styles.vip, { [styles.isVip]: guest.admissionTier === 'vip' })}>
			{guest.admissionTier === 'vip' ? (
				checkScope(role, 'write') ? (
					<button onClick={() => confirm('Are you sure you want to downgrade this guest?') && updateGuest(guest.id, { admissionTier: 'general' })}>{'\u2713'} VIP</button>
				) : (
					<p>&#9989;</p>
				)
			) : checkScope(role, 'write') && guest.admissionTier === 'general' ? (
				<button onClick={() => updateGuest(guest.id, { admissionTier: 'vip' })}>Make VIP</button>
			) : (
				''
			)}
		</div>
	</li>
);

export default memo(GuestsListItem);
