import './GuestsList.less';

import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import UserContext from 'UserContext';
import GuestsListItem from './GuestsListItem';

const GuestsList = ({ guests, updateGuest, event, sortBy, sortOrder, sortGuests, switchGuestsOrder }) => {
	const { user } = useContext(UserContext);

	return (
		<ul className="guests-list">
			<li className="table-header">
				<div className="checked-in">
					<h5>
						Checked In
					</h5>
				</div>

				<div className="name">
					<h5
						className={classnames({
							sortable: true,
							sorted: sortBy === 'name',
							asc: sortOrder === 1,
							desc: sortOrder === -1
						})}
						onClick={() => sortBy !== 'name' ? sortGuests('name') : switchGuestsOrder()}
					>
						Name
					</h5>
				</div>
				<div className="date">
					<h5
						className={classnames({
							sortable: true,
							sorted: sortBy === 'date',
							asc: sortOrder === 1,
							desc: sortOrder === -1
						})}
						onClick={() => sortBy !== 'date' ? sortGuests('date') : switchGuestsOrder()}
					>
						Date Added
					</h5>
				</div>
				<div className="event">
					<h5>
						Event
					</h5>
				</div>
				<div className="order-id">
					<h5>
						Order ID
					</h5>
				</div>
				<div className="vip">
					<h5>
						VIP
					</h5>
				</div>
			</li>
			{guests.map(guest => <GuestsListItem
				key={guest.id}
				updateGuest={updateGuest}
				guest={guest}
				event={event}
				role={user.role}
			/>)}
		</ul>
	);
};

export default GuestsList;

GuestsList.propTypes = {
	guests: PropTypes.array.isRequired,
	event: PropTypes.object.isRequired,
	updateGuest: PropTypes.func.isRequired,
	sortGuests: PropTypes.func.isRequired,
	switchGuestsOrder: PropTypes.func.isRequired,
	sortBy: PropTypes.string.isRequired,
	sortOrder: PropTypes.number.isRequired
};
