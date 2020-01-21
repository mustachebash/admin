import './GuestsList.less';

import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import UserContext from 'UserContext';
import { checkScope } from 'utils';
import GuestsListItem from './GuestsListItem';

const GuestsList = ({ guests, sortBy, sortOrder, sortGuests, switchGuestsOrder }) => {
	const { user } = useContext(UserContext);

	return (
		<ul className="guests-list">
			<li className="table-header">
				{checkScope(user.role, 'root') &&
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
				guest={guest}
				user={user}
			/>)}
		</ul>
	);
};

export default GuestsList;

GuestsList.propTypes = {
	guests: PropTypes.array.isRequired,
	sortGuests: PropTypes.func.isRequired,
	switchGuestsOrder: PropTypes.func.isRequired,
	sortBy: PropTypes.string.isRequired,
	sortOrder: PropTypes.number.isRequired
};
