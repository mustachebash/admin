import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class CompedPromoForm extends Component {
	constructor(props) {
		super(props);

		this.state = {
			recipient: '',
			price: 0,
			eventId: '',
			productId: ''
		};

		this.handleChange = this.handleChange.bind(this);
		this.addPromo = this.addPromo.bind(this);

		this.submitting = false;
	}

	handleChange(e) {
		this.setState({
			[e.currentTarget.name]: e.currentTarget.value
		});
	}

	addPromo(e) {
		e.preventDefault();

		if(this.submitting || !this.state.recipient || !this.state.price || !this.state.productId) return;

		this.submitting = true;

		this.props.addPromo({
			recipient: this.state.recipient,
			price: this.state.price,
			productId: this.state.productId
		});

		this.setState({
			recipient: '',
			price: 0
		}, () => {
			this.firstInput.focus();
			this.submitting = false;
		});
	}

	render() {
		return (
			<form className="create-promo-form flex-row" onSubmit={this.addPromo}>
				<input type="text" name="recipient" placeholder="Recipient" value={this.state.recipient} onChange={this.handleChange} ref={el => this.firstInput = el} />
				<input type="text" name="price" placeholder="0" value={this.state.price} onChange={this.handleChange} />
				<div className="select-wrap">
					<select name="eventId" value={this.state.eventId} onChange={this.handleChange}>
						<option disabled value="">Select an Event...</option>
						{this.props.events.filter(e => e.status === 'active').map(e => (
							<option key={e.id} value={e.id}>{e.name}</option>
						))}
					</select>
				</div>
				<div className="select-wrap">
					<select name="productId" value={this.state.productId} onChange={this.handleChange}>
						<option disabled value="">Select a Product...</option>
						{this.props.products.filter(p => p.status === 'active' && p.eventId === this.state.eventId).map(p => (
							<option key={p.id} value={p.id}>{p.name}</option>
						))}
					</select>
				</div>

				<button className="white" type="submit">Add Promo</button>
			</form>
		);
	}
}

CompedPromoForm.propTypes = {
	addPromo: PropTypes.func.isRequired,
	events: PropTypes.array.isRequired,
	products: PropTypes.array.isRequired
};
