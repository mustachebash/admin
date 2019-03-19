import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

export default class GuestUpdateModal extends Component {
	constructor(props) {
		super(props);

		this.state = {
			firstName: '',
			lastName: '',
			notes: props.notes || '',
			mode: 'name'
		};

		this.handleChange = this.handleChange.bind(this);
		this.updateGuestName = this.updateGuestName.bind(this);
		this.updateGuestNotes = this.updateGuestNotes.bind(this);

		this.submitting = false;
	}

	handleChange(e) {
		this.setState({
			[e.currentTarget.name]: e.currentTarget.value
		});
	}

	updateGuestName(e) {
		if(this.submitting || !this.state.firstName || !this.state.lastName) return;

		this.submitting = true;

		this.props.updateGuestName(this.props.id, {
			firstName: this.state.firstName,
			lastName: this.state.lastName
		});

		this.props.onSave();
	}

	updateGuestNotes(e) {
		if(this.submitting) return;

		this.submitting = true;

		this.props.updateGuestNotes(this.props.id, this.state.notes);

		this.props.onSave();
	}

	render() {
		const { firstName, lastName, notes, mode } = this.state;

		return (
			<div>
				<div className="flex-row edit-guest-toggle">
					<div className={mode === 'notes' ? 'active' : ''} onClick={() => this.setState({mode: 'notes'})}>Notes</div>
					<div className={mode === 'name' ? 'active' : ''} onClick={() => this.setState({mode: 'name'})}>Edit Name</div>
				</div>

				<h4>
					{mode === 'name'
						? 'Enter New Name'
						: 'Edit Guest Notes'
					}
				</h4>

				{mode === 'name'
					? <Fragment>
						<input type="text" name="firstName" placeholder="First Name" value={firstName} onChange={this.handleChange} ref={el => this.firstInput = el} />
						<input type="text" name="lastName" placeholder="Last Name" value={lastName} onChange={this.handleChange} />
					</Fragment>

					: <textarea name="notes" placeholder="Notes" value={notes} onChange={this.handleChange} />
				}

				<button className="white" onClick={mode === 'name' ? this.updateGuestName : this.updateGuestNotes}>Save</button>
				<button className="white" onClick={this.props.onCancel}>Cancel</button>
			</div>
		);
	}
}

GuestUpdateModal.propTypes = {
	id: PropTypes.string.isRequired,
	notes: PropTypes.string,
	updateGuestName: PropTypes.func.isRequired,
	updateGuestNotes: PropTypes.func.isRequired,
	onSave: PropTypes.func.isRequired,
	onCancel: PropTypes.func.isRequired
};
