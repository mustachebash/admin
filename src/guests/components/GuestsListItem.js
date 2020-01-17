import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { checkScope } from 'utils';
// import Modal from 'components/Modal';
// import GuestUpdateModal from './GuestUpdateModal';

function toggleCheckIn() {
	// eslint-disable-next-line
	if(this.props.guest.checkedIn && confirm('Are you sure you want to mark this guest as not checked in?')) {
		return this.props.checkOut(this.props.guest.id);
	}

	if(!this.props.guest.checkedIn) {
		return this.props.checkIn(this.props.guest.id);
	}
}

function showEditModal() {
	this.setState({showEditModal: true});
}

// function closeEditModal() {
// 	this.setState({showEditModal: false});
// }

function archiveGuest() {
	// eslint-disable-next-line no-alert
	if(confirm('Are you sure you want to remove this guest? This cannot be undone')) this.props.archiveGuest(this.props.guest.id);
}

const event = {
		id: '34a99b2a-f826-406a-8227-921efd03ebff',
		name: 'Mustache Bash 2020'
	},
	user = {
		role: 'admin'
	};

const GuestsListItem = ({ guest }) => (
	<>
		<li className="guest">
			{checkScope(user.role, 'doorman') &&
				<div className="check-in">
					{guest.status === 'archived'
						? <span className="no-entry">&#x26D4; No entry</span>
						: <span
							className={guest.checkedIn ? 'checked' : ''}
							onClick={toggleCheckIn}
							title={guest.checkedIn ? format(new Date(guest.checkedIn), 'MMM Do, h:mma', {timeZone: 'America/Los_Angeles'}) : 'Check In'}
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
				<p>{format(new Date(guest.created), 'MMM Do, h:mma', {timeZone: 'America/Los_Angeles'})}</p>
			</div>
			<div className="event">
				<p>{event.name}</p>
			</div>
			<div className="confirmation">
				<p>{guest.confirmationId}</p>
			</div>
			{checkScope(user.role, 'admin') &&
				<div className="edit-guest">
					<p><a href="#" onClick={showEditModal}>&#9998;</a></p>
				</div>
			}
			{checkScope(user.role, 'root') &&
				<div className="edit-guest">
					<p>{guest.status !== 'archived' && <a href="#" onClick={archiveGuest}>&#x274C;</a>}</p>
				</div>
			}
		</li>
		{/* {this.state.showEditModal &&
			<Modal closeModal={closeEditModal}>
				<GuestUpdateModal
					onCancel={closeEditModal}
					onSave={closeEditModal}
					updateGuestName={updateGuestName}
					updateGuestNotes={updateGuestNotes}
					notes={guest.notes}
					id={guest.id}/>
			</Modal>
		} */}
	</>
);

GuestsListItem.propTypes = {
	guest: PropTypes.object.isRequired
};

export default GuestsListItem;
