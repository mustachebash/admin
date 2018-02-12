import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class CompedGuestForm extends Component {
	constructor(props) {
		super(props);

		this.state = {
			firstName: '',
			lastName: '',
			eventId: ''
		};

		this.handleChange = this.handleChange.bind(this);
		this.addGuest = this.addGuest.bind(this);

		this.submitting = false;
	}

	handleChange(e) {
		this.setState({
			[e.currentTarget.name]: e.currentTarget.value
		});
	}

	addGuest(e) {
		e.preventDefault();

		if(this.submitting || !this.state.firstName || !this.state.lastName || !this.state.eventId) return;

		this.submitting = true;

		this.props.addGuest({
			firstName: this.state.firstName,
			lastName: this.state.lastName,
			eventId: this.state.eventId
		});

		this.setState({
			firstName: '',
			lastName: ''
		}, () => {
			this.firstInput.focus();
			this.submitting = false;
		});
	}

	render() {
		return (
			<form className="comped-guest-form flex-row" onSubmit={this.addGuest}>
				<input type="text" name="firstName" placeholder="First Name" value={this.state.firstName} onChange={this.handleChange} ref={el => this.firstInput = el} />
				<input type="text" name="lastName" placeholder="Last Name" value={this.state.lastName} onChange={this.handleChange} />
				<div className="select-wrap">
					<select name="eventId" value={this.state.eventId} onChange={this.handleChange}>
						<option disabled value="">Select an Event...</option>
						{this.props.events.filter(e => e.status === 'active').map(e => (
							<option key={e.id} value={e.id}>{e.name}</option>
						))}
					</select>
				</div>

				<button className="white" type="submit">Add Guest</button>
			</form>
		);
	}
}

CompedGuestForm.propTypes = {
	addGuest: PropTypes.func.isRequired,
	events: PropTypes.array.isRequired
};
