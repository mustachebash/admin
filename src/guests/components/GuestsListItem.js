import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { checkScope } from 'utils';
import Modal from 'components/Modal';
import GuestUpdateModal from './GuestUpdateModal';

export default class GuestsListItem extends Component {
	constructor(props) {
		super(props);

		this.state = {
			showEditModal: false
		};

		this.toggleCheckIn = this.toggleCheckIn.bind(this);
		this.archiveGuest = this.archiveGuest.bind(this);
		this.showEditModal = this.showEditModal.bind(this);
		this.closeEditModal = this.closeEditModal.bind(this);
	}

	shouldComponentUpdate(nextProps, nextState) {
		return nextProps.guest !== this.props.guest || nextState.showEditModal !== this.state.showEditModal;
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

	showEditModal() {
		this.setState({showEditModal: true});
	}

	closeEditModal() {
		this.setState({showEditModal: false});
	}

	archiveGuest() {
		// eslint-disable-next-line no-alert
		if(confirm('Are you sure you want to remove this guest? This cannot be undone')) this.props.archiveGuest(this.props.guest.id);
	}

	render() {
		const { guest, user, event, updateGuestName, updateGuestNotes } = this.props;

		return (
			<React.Fragment>
				<li className="guest">
					{checkScope(user.role, 'doorman') &&
						<div className="check-in">
							{guest.status === 'archived'
								? <span className="no-entry">&#x26D4; No entry</span>
								: <span
									className={guest.checkedIn ? 'checked' : ''}
									onClick={this.toggleCheckIn}
									title={guest.checkedIn ? moment.tz(guest.checkedIn, 'America/Los_Angeles').format('MMM Do, h:mma') : 'Check In'}
								>
									{guest.checkedIn ? '' : 'Check In'}
								</span>
							}
						</div>
					}
					<div className="name">
						<p>{guest.firstName} {guest.lastName}</p>
						{guest.notes && <p className="guest-notes">Notes: {guest.notes}</p>}
					</div>
					<div className="date">
						<p>{moment.tz(guest.created, 'America/Los_Angeles').format('MMM Do, h:mma')}</p>
					</div>
					<div className="event">
						<p>{event.name}</p>
					</div>
					<div className="confirmation">
						<p>{guest.confirmationId}</p>
					</div>
					{checkScope(user.role, 'admin') &&
						<div className="edit-guest">
							<p><a href="#" onClick={this.showEditModal}>&#9998;</a></p>
						</div>
					}
					{checkScope(user.role, 'root') &&
						<div className="edit-guest">
							<p>{guest.status !== 'archived' && <a href="#" onClick={this.archiveGuest}>&#x274C;</a>}</p>
						</div>
					}
				</li>
				{this.state.showEditModal &&
					<Modal closeModal={this.closeEditModal}>
						<GuestUpdateModal
							onCancel={this.closeEditModal}
							onSave={this.closeEditModal}
							updateGuestName={updateGuestName}
							updateGuestNotes={updateGuestNotes}
							notes={guest.notes}
							id={guest.id}/>
					</Modal>
				}
			</React.Fragment>
		);
	}
}

GuestsListItem.propTypes = {
	user: PropTypes.object.isRequired,
	event: PropTypes.object.isRequired,
	guest: PropTypes.object.isRequired,
	checkIn: PropTypes.func.isRequired,
	checkOut: PropTypes.func.isRequired,
	updateGuestName: PropTypes.func.isRequired,
	updateGuestNotes: PropTypes.func.isRequired,
	archiveGuest: PropTypes.func.isRequired
};
