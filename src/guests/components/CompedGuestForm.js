import './CompedGuestForm.less';

import React, { Component } from 'react';
import apiClient from 'utils/apiClient';

export default class CompedGuestForm extends Component {
	state = {
		firstName: '',
		lastName: '',
		events: [],
		eventId: ''
	};

	handleChange = this.handleChange.bind(this);
	addGuest = this.addGuest.bind(this);

	submitting = false;

	componentDidMount() {
		apiClient.get('/events')
			.then(events => this.setState({events}))
			.catch(e => console.error('Event API Error', e));
	}

	handleChange(e) {
		this.setState({
			[e.currentTarget.name]: e.currentTarget.value
		});
	}

	addGuest(e) {
		e.preventDefault();

		const { firstName, lastName, eventId } = this.state;

		if(this.submitting || !firstName || !lastName || !eventId) return;

		this.submitting = true;

		apiClient.post('/guests', {
			firstName,
			lastName,
			eventId
		}).catch(err => console.error('Event API Error', err));

		this.setState({
			firstName: '',
			lastName: ''
		}, () => {
			this.firstInput.focus();
			this.submitting = false;
		});
	}

	render() {
		const { firstName, lastName, eventId, events } = this.state;

		return (
			<form className="comped-guest-form flex-row" onSubmit={this.addGuest}>
				<h4>Comp a Guest</h4>
				<input type="text" name="firstName" placeholder="First Name" value={firstName} onChange={this.handleChange} ref={el => this.firstInput = el} />
				<input type="text" name="lastName" placeholder="Last Name" value={lastName} onChange={this.handleChange} />
				<div className="select-wrap">
					<select name="eventId" value={eventId} onChange={this.handleChange}>
						<option disabled value="">Select an Event...</option>
						{events.filter(e => e.status === 'active').map(e => (
							<option key={e.id} value={e.id}>{e.name}</option>
						))}
					</select>
				</div>

				<button className="white" type="submit">Add Guest</button>
			</form>
		);
	}
}
