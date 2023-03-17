import './GuestsListItem.less';

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import { format } from 'date-fns';
import { checkScope } from 'utils';

/* eslint-disable no-alert */
const GuestsListItem = ({ guest, updateGuest, event, role }) => (
	<li className="guests-list-item">
		<div className="checked-in">
			{guest.status === 'archived'
				? <span className="no-entry">&#x26D4; No entry</span>
				: <span
					className={classnames(guest.checkedIn ? 'checked' : 'unchecked', {comped: guest.confirmationId === 'COMPED'})}
					title={guest.checkedIn ? format(new Date(guest.checkedIn), 'MMM do, h:mma', {timeZone: 'America/Los_Angeles'}) : 'Check In'}
					onClick={() => (
						guest.confirmationId === 'COMPED' ||
						(!guest.checkedIn && window.confirm('Are you sure you want to manually update this guest?'))
					) && updateGuest(guest.id, {checkedIn: !guest.checkedIn})}
				>
				</span>
			}
		</div>

		<div className="name">
			<p><Link to={`/guests/${guest.id}`}>{guest.firstName} {guest.lastName}</Link></p>
			{guest.notes && <p className="guest-notes">Notes: {guest.notes}</p>}
		</div>
		<div className="date">
			<p>{format(new Date(guest.created), 'MMM do, h:mma', {timeZone: 'America/Los_Angeles'})}</p>
		</div>
		<div className="event">
			<p>{guest.eventId === EVENT_2020_ID ? 'Mustache Bash 2020' : event.name}</p>
		</div>
		<div className="confirmation">
			<p>
				{guest.confirmationId === 'COMPED'
					? guest.confirmationId
					: <Link to={`/transactions/${guest.transactionId}`}>{guest.confirmationId}</Link>
				}
			</p>
		</div>
		<div className={classnames('vip', {'is-vip': guest.vip})}>
			{checkScope(role, 'admin')
				? <button onClick={() => updateGuest(guest.id, {vip: !guest.vip})}>{guest.vip ? '\u2713' : 'Make'} VIP</button>
				: guest.vip
					? <p>&#9989;</p>
					: ''
			}
		</div>
	</li>
);
/* eslint-enable */

GuestsListItem.propTypes = {
	guest: PropTypes.object.isRequired,
	event: PropTypes.object.isRequired,
	role: PropTypes.string.isRequired,
	updateGuest: PropTypes.func.isRequired
};

export default memo(GuestsListItem);
