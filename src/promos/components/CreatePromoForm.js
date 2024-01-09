import './CreatePromoForm.less';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import apiClient from 'utils/apiClient';

export default class CompedPromoForm extends Component {
	static propTypes = {
		onAdd: PropTypes.func
	};

	static defaultProps = {
		onAdd: () => {}
	};

	state = {
		recipientName: '',
		price: '',
		events: [],
		products: [],
		eventId: '',
		productId: ''
	};

	handleChange = this.handleChange.bind(this);
	addPromo = this.addPromo.bind(this);

	submitting = false;

	componentDidMount() {
		apiClient.get('/events', {status: 'active'})
			.then(events => this.setState({events}))
			.catch(e => console.error('Event API Error', e));

		apiClient.get('/products')
			.then(products => this.setState({products}))
			.catch(e => console.error('Products API Error', e));
	}

	handleChange(e) {
		this.setState({
			[e.currentTarget.name]: e.currentTarget.value
		});
	}

	addPromo(e) {
		e.preventDefault();

		const { recipientName, price, productId } = this.state;

		if(this.submitting || !recipientName || !price || !productId) return;

		const priceInt = Number(price);
		if(Number.isNaN(priceInt)) return;

		this.submitting = true;

		apiClient.post('/promos', {
			type: 'single-use',
			price: priceInt,
			recipientName,
			productId
		})
			.then(promo => {
				this.props.onAdd(promo);

				this.setState({
					recipientName: ''
				}, () => {
					this.firstInput.focus();
					this.submitting = false;
				});
			})
			.catch(err => {
				console.error('Promos API Error', err)
				this.submitting = false;
			});
	}

	render() {
		const { events, products, eventId, productId, recipientName, price } = this.state;

		return (
			<div className="create-promo-form">
				<h4>Create a Promo</h4>

				<form className="flex-row" onSubmit={this.addPromo}>
					<input type="text" name="recipientName" placeholder="Name" value={recipientName} onChange={this.handleChange} ref={el => this.firstInput = el} />
					<input type="text" name="price" placeholder="$0" value={price} onChange={this.handleChange} />
					<div className="select-wrap">
						<select name="eventId" value={eventId} onChange={this.handleChange}>
							<option disabled value="">Select an Event...</option>
							{events.map(e => (
								<option key={e.id} value={e.id}>{e.name}</option>
							))}
						</select>
					</div>
					<div className="select-wrap">
						<select name="productId" value={productId} onChange={this.handleChange}>
							<option disabled value="">Select a Product...</option>
							{products.filter(p => p.promo && p.status === 'active' && p.eventId === eventId).map(p => (
								<option key={p.id} value={p.id}>{p.name}</option>
							))}
						</select>
					</div>

					<button className="white" type="submit">Add Promo</button>
				</form>
			</div>
		);
	}
}
