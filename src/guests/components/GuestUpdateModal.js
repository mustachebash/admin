import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class GuestUpdateModal extends Component {
	constructor(props) {
		super(props);

		this.state = {
			firstName: '',
			lastName: ''
		};

		this.handleChange = this.handleChange.bind(this);
		this.updateGuestName = this.updateGuestName.bind(this);

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

	render() {
		return (
			<div>
				<h4>Enter New Name</h4>
				<input type="text" name="firstName" placeholder="First Name" value={this.state.firstName} onChange={this.handleChange} ref={el => this.firstInput = el} />
				<input type="text" name="lastName" placeholder="Last Name" value={this.state.lastName} onChange={this.handleChange} />
				<button className="white" onClick={this.updateGuestName}>Save</button>
				<button className="white" onClick={this.props.onCancel}>Cancel</button>
			</div>
		);
	}
}

GuestUpdateModal.propTypes = {
	id: PropTypes.string.isRequired,
	updateGuestName: PropTypes.func.isRequired,
	onSave: PropTypes.func.isRequired,
	onCancel: PropTypes.func.isRequired
};
