import React, { Component } from 'react';
import PropTypes from 'prop-types';

import moment from 'moment-timezone';

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
		if(this.props.guest.checked_in && confirm('Are you sure you want to mark this guest as not checked in?')) {
			return this.props.checkOut(this.props.guest.id);
		}

		if(!this.props.guest.checked_in) {
			return this.props.checkIn(this.props.guest.id);
		}
	}

	render() {
		const { guest } = this.props;

		return (
			<li className="guest">
				<div className="check-in">
					<span className={guest.checked_in ? 'checked' : ''} onClick={this.toggleCheckIn}>
						{guest.checked_in ? '' : 'Check In'}
					</span>
				</div>
				<div className="name">
					<p>{guest.first_name} {guest.last_name}</p>
				</div>
				<div className="date">
					<p>{moment.tz(guest.timestamp, 'America/Los_Angeles').format('MMM Do, h:mma')}</p>
				</div>
				<div className="transaction">
					<p>{guest.transaction_id}</p>
				</div>
			</li>
		);
	}
}

GuestsListItem.propTypes = {
	guest: PropTypes.object.isRequired,
	checkIn: PropTypes.func.isRequired,
	checkOut: PropTypes.func.isRequired
};
