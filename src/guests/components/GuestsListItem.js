import './GuestsListItem.less';

import React, { memo, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import { format } from 'date-fns';
import { checkScope } from 'utils';
import apiClient from 'utils/apiClient';

const GuestsListItem = ({ guest, event, role }) => {
	// This is trash design pattern but it's quick and dirty
	const [ vip, setVIP ] = useState(!!guest.vip);

	const toggleVIP = useCallback(() => {
		apiClient.patch(`/guests/${guest.id}`, {vip: !vip})
			.then(g => setVIP(!!g.vip))
			.catch(e => console.error('Guest API Error', e));
	}, [guest, vip]);

	return (
		<li className="guests-list-item">
			<div className="checked-in">
				{guest.status === 'archived'
					? <span className="no-entry">&#x26D4; No entry</span>
					: <span
						className={guest.checkedIn ? 'checked' : 'unchecked'}
						title={guest.checkedIn ? format(new Date(guest.checkedIn), 'MMM do, h:mma', {timeZone: 'America/Los_Angeles'}) : 'Check In'}
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
			<div className={classnames('vip', {'is-vip': vip})}>
				{checkScope(role, 'admin')
					? <button onClick={toggleVIP}>{vip ? '\u2713' : 'Make'} VIP</button>
					: guest.vip
						? <p>&#9989;</p>
						: ''
				}
			</div>
		</li>
	);
};

GuestsListItem.propTypes = {
	guest: PropTypes.object.isRequired,
	event: PropTypes.object.isRequired,
	role: PropTypes.string.isRequired
};

export default memo(GuestsListItem);
