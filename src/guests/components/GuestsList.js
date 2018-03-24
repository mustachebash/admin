import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import GuestsListItem from './GuestsListItem';
import { checkScope } from 'utils';

const GuestsList = (props) => {
	const { guests, user } = props,
		eventsById = {};

	props.events.forEach(e => eventsById[e.id] = e);

	return (
		<ul className="guests-list">
			<li className="table-header">
				{checkScope(user.role, 'doorman') &&
					<div className="checked-in">
						<h5>
							Checked In
						</h5>
					</div>
				}
				<div className="name">
					<h5
						className={classnames({
							sortable: true,
							sorted: props.sortBy === 'name',
							asc: props.sortOrder === 1,
							desc: props.sortOrder === -1
						})}
						onClick={() => props.sortBy !== 'name' ? props.sortGuests('name') : props.switchGuestsOrder()}
					>
						Name
					</h5>
				</div>
				<div className="date">
					<h5
						className={classnames({
							sortable: true,
							sorted: props.sortBy === 'date',
							asc: props.sortOrder === 1,
							desc: props.sortOrder === -1
						})}
						onClick={() => props.sortBy !== 'date' ? props.sortGuests('date') : props.switchGuestsOrder()}
					>
						Date Added
					</h5>
				</div>
				<div className="event">
					<h5>
						Event
					</h5>
				</div>
				<div className="confirmation">
					<h5>
						Confirmation
					</h5>
				</div>
				{checkScope(user.role, 'admin') &&
					<div className="edit-guest">
						{/* Empty header */}
					</div>
				}
			</li>
			{guests.map(guest => <GuestsListItem
				key={guest.id}
				event={eventsById[guest.eventId]}
				guest={guest}
				checkIn={props.checkIn}
				checkOut={props.checkOut}
				updateGuestName={props.updateGuestName}
				archiveGuest={props.archiveGuest}
				user={props.user}
			/>)}
		</ul>
	);
};

export default GuestsList;

GuestsList.propTypes = {
	user: PropTypes.object.isRequired,
	guests: PropTypes.array.isRequired,
	events: PropTypes.array.isRequired,
	sortGuests: PropTypes.func.isRequired,
	switchGuestsOrder: PropTypes.func.isRequired,
	sortBy: PropTypes.string.isRequired,
	sortOrder: PropTypes.number.isRequired,
	checkIn: PropTypes.func.isRequired,
	checkOut: PropTypes.func.isRequired,
	updateGuestName: PropTypes.func.isRequired
};
