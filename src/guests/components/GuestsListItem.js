import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { checkScope } from 'utils';

export default class GuestsListItem extends Component {
	constructor(props) {
		super(props);

		this.toggleCheckIn = this.toggleCheckIn.bind(this);
	}

	shouldComponentUpdate(nextProps) {
		return nextProps.guest !== this.props.guest;
	}

	toggleCheckIn() {
		// eslint-disable-next-line
		if(this.props.guest.checkedIn && confirm('Are you sure you want to mark this guest as not checked in?')) {
			return this.props.checkOut(this.props.guest.id);
		}

		if(!this.props.guest.checkedIn) {
			return this.props.checkIn(this.props.guest.id);
		}
	}

	render() {
		const { guest, user, event } = this.props;

		return (
			<li className="guest">
				<div className="check-in">
					{false && checkScope(user.role, 'doorman') &&
						<span className={guest.checkedIn ? 'checked' : ''} onClick={this.toggleCheckIn}>
							{guest.checkedIn ? '' : 'Check In'}
						</span>
					}
				</div>
				<div className="name">
					<p>{guest.firstName} {guest.lastName}</p>
				</div>
				<div className="date">
					<p>{moment.tz(guest.created, 'America/Los_Angeles').format('MMM Do, h:mma')}</p>
				</div>
				<div className="event">
					<p>{event.name}</p>
				</div>
				<div className="transaction">
					<p>{guest.confirmationId}</p>
				</div>
			</li>
		);
	}
}

GuestsListItem.propTypes = {
	user: PropTypes.object.isRequired,
	event: PropTypes.object.isRequired,
	guest: PropTypes.object.isRequired,
	checkIn: PropTypes.func.isRequired,
	checkOut: PropTypes.func.isRequired
};
