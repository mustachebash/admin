import styles from './GuestsList.module.css';

import { useContext } from 'react';
import classnames from 'classnames';
import UserContext from '@/UserContext';
import GuestsListItem from './GuestsListItem';

interface GuestsListProps {
	guests: any[];
	updateGuest: (id: string, updates: Record<string, unknown>) => void;
	event: any;
	sortBy: string;
	sortOrder: number;
	sortGuests: (by: string) => void;
	switchGuestsOrder: () => void;
}

const GuestsList = ({ guests, updateGuest, event, sortBy, sortOrder, sortGuests, switchGuestsOrder }: GuestsListProps) => {
	const { user } = useContext(UserContext);

	return (
		<ul className={styles.guestsList}>
			<li className={styles.tableHeader}>
				<div className="checked-in">
					<h5>Checked In</h5>
				</div>

				<div className="name">
					<h5
						className={classnames({
							sortable: true,
							sorted: sortBy === 'name',
							asc: sortOrder === 1,
							desc: sortOrder === -1
						})}
						onClick={() => (sortBy !== 'name' ? sortGuests('name') : switchGuestsOrder())}
					>
						Name
					</h5>
				</div>
				<div className={styles.date}>
					<h5
						className={classnames({
							sortable: true,
							sorted: sortBy === 'date',
							asc: sortOrder === 1,
							desc: sortOrder === -1
						})}
						onClick={() => (sortBy !== 'date' ? sortGuests('date') : switchGuestsOrder())}
					>
						Date Added
					</h5>
				</div>
				<div className="event">
					<h5>Event</h5>
				</div>
				<div className="order-id">
					<h5>Order ID</h5>
				</div>
				<div className="vip">
					<h5>VIP</h5>
				</div>
			</li>
			{guests.map(guest => (
				<GuestsListItem key={guest.id} updateGuest={updateGuest} guest={guest} event={event} role={user!.role} />
			))}
		</ul>
	);
};

export default GuestsList;
