import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import GuestsListItem from './GuestsListItem';

const GuestsList = (props) => {
	const guests = props.guests;

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
				<div className="transaction">
					<h5>
						Confirmation
					</h5>
				</div>
			</li>
			{guests.map(guest => <GuestsListItem key={guest.id} guest={guest} checkIn={props.checkIn} checkOut={props.checkOut} />)}
		</ul>
	);
};

export default GuestsList;

GuestsList.propTypes = {
	guests: PropTypes.array.isRequired,
	sortGuests: PropTypes.func.isRequired,
	switchGuestsOrder: PropTypes.func.isRequired,
	sortBy: PropTypes.string.isRequired,
	sortOrder: PropTypes.number.isRequired,
	checkIn: PropTypes.func.isRequired,
	checkOut: PropTypes.func.isRequired
};
