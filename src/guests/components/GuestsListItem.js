import './GuestsListItem.less';

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const GuestsListItem = ({ guest, event }) => (
	<li className="guests-list-item">
		<div className="checked-in">
			{guest.status === 'archived'
				? <span className="no-entry">&#x26D4; No entry</span>
				: <span
					className={guest.checkedIn ? 'checked' : 'unchecked'}
					title={guest.checkedIn ? format(new Date(guest.checkedIn), 'MMM Do, h:mma', {timeZone: 'America/Los_Angeles'}) : 'Check In'}
				>
				</span>
			}
		</div>

		<div className="name">
			<p><Link to={`/guests/${guest.id}`}>{guest.firstName} {guest.lastName}</Link></p>
			{guest.notes && <p className="guest-notes">Notes: {guest.notes}</p>}
		</div>
		<div className="date">
			<p>{format(new Date(guest.created), 'MMM Do, h:mma', {timeZone: 'America/Los_Angeles'})}</p>
		</div>
		<div className="event">
			<p>{event.name}</p>
		</div>
		<div className="confirmation">
			<p>
				{guest.confirmationId === 'COMPED'
					? guest.confirmationId
					: <Link to={`/transactions/${guest.transactionId}`}>{guest.confirmationId}</Link>
				}
			</p>
		</div>
	</li>
);

GuestsListItem.propTypes = {
	guest: PropTypes.object.isRequired,
	event: PropTypes.object.isRequired
};

export default memo(GuestsListItem);
