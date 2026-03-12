import styles from './CreatePromoForm.module.css';

import React, { Component } from 'react';
import apiClient from '@/utils/apiClient';
import FlexRow from '@/components/FlexRow';

interface CreatePromoFormProps {
	onAdd?: (promo: unknown) => void;
}

interface CreatePromoFormState {
	recipientName: string;
	quantity: string;
	events: any[];
	products: any[];
	eventId: string;
	productId: string;
}

export default class CompedPromoForm extends Component<CreatePromoFormProps, CreatePromoFormState> {
	static defaultProps = {
		onAdd: () => {}
	};

	state: CreatePromoFormState = {
		recipientName: '',
		quantity: '',
		events: [],
		products: [],
		eventId: '',
		productId: ''
	};

	firstInput: HTMLInputElement | null = null;
	submitting = false;

	constructor(props: CreatePromoFormProps) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.addPromo = this.addPromo.bind(this);
	}

	componentDidMount() {
		apiClient
			.get('/events', { status: 'active' })
			.then(events => this.setState({ events }))
			.catch(e => console.error('Event API Error', e));

		apiClient
			.get('/products')
			.then(products => this.setState({ products }))
			.catch(e => console.error('Products API Error', e));
	}

	handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
		this.setState({
			[e.currentTarget.name]: e.currentTarget.value
		} as unknown as Pick<CreatePromoFormState, keyof CreatePromoFormState>);
	}

	addPromo(e: React.FormEvent) {
		e.preventDefault();

		const { recipientName, quantity, productId } = this.state;

		if (this.submitting || !recipientName || !quantity || !productId) return;

		const qtyInt = Number(quantity);
		if (Number.isNaN(qtyInt) || qtyInt > 4) return;

		this.submitting = true;

		apiClient
			.post('/promos', {
				type: 'single-use',
				price: 80,
				productQuantity: qtyInt,
				recipientName,
				productId
			})
			.then(promo => {
				this.props.onAdd?.(promo);

				this.setState(
					{
						recipientName: '',
						quantity: ''
					},
					() => {
						this.firstInput?.focus();
						this.submitting = false;
					}
				);
			})
			.catch(err => {
				console.error('Promos API Error', err);
				this.submitting = false;
			});
	}

	render() {
		const { events, products, eventId, productId, recipientName, quantity } = this.state;

		return (
			<div className={styles.createPromoForm}>
				<h4>Create a Promo</h4>

				<FlexRow as="form" onSubmit={this.addPromo}>
					<input
						type="text"
						name="recipientName"
						placeholder="Name"
						value={recipientName}
						onChange={this.handleChange}
						ref={el => {
							this.firstInput = el;
						}}
					/>
					<input type="text" name="quantity" placeholder="Qty #" value={quantity} onChange={this.handleChange} />
					<div className={styles.selectWrap}>
						<select name="eventId" value={eventId} onChange={this.handleChange}>
							<option disabled value="">
								Select an Event...
							</option>
							{events.map(e => (
								<option key={e.id} value={e.id}>
									{e.name}
								</option>
							))}
						</select>
					</div>
					<div className={styles.selectWrap}>
						<select name="productId" value={productId} onChange={this.handleChange}>
							<option disabled value="">
								Select a Product...
							</option>
							{products
								.filter(p => p.promo && p.status === 'active' && p.eventId === eventId)
								.map(p => (
									<option key={p.id} value={p.id}>
										{p.name}
									</option>
								))}
						</select>
					</div>

					<button className="white" type="submit">
						Add Promo
					</button>
				</FlexRow>
			</div>
		);
	}
}
