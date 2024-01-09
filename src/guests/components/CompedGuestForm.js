import './CompedGuestForm.less';

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import apiClient from 'utils/apiClient';

export default class CompedGuestForm extends PureComponent {
	static propTypes = {
		onAdd: PropTypes.func
	};

	static defaultProps = {
		onAdd: () => {}
	};

	state = {
		firstName: '',
		lastName: '',
		notes: '',
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

		const { firstName, lastName, notes, eventId } = this.state;

		if(this.submitting || !firstName || !lastName || !eventId) return;

		this.submitting = true;

		apiClient.post('/guests', {
			// TODO: have tier dropdown between stachepass and sponsor
			admissionTier: 'stachepass',
			firstName,
			lastName,
			...notes && {meta: {notes}},
			eventId
		}).then(guest => {
			this.props.onAdd(guest);

			this.setState({
				firstName: '',
				lastName: '',
				notes: ''
			}, () => {
				this.firstInput.focus();
				this.submitting = false;
			});
		}).catch(err => {
			this.submitting = false;
			console.error('Event API Error', err);
		});
	}

	render() {
		const { firstName, lastName, notes, eventId, events } = this.state;

		return (
			<div className="comped-guest-form">
				<h4>Comp a Guest</h4>
				<form className="flex-row" onSubmit={this.addGuest}>
					<input type="text" name="firstName" placeholder="First Name" value={firstName} onChange={this.handleChange} ref={el => this.firstInput = el} />
					<input type="text" name="lastName" placeholder="Last Name" value={lastName} onChange={this.handleChange} />
					<input type="text" name="notes" placeholder="Notes" value={notes} onChange={this.handleChange} />
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
			</div>
		);
	}
}
