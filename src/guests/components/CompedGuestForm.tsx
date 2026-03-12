import styles from './CompedGuestForm.module.css';

import React, { PureComponent } from 'react';
import apiClient from '@/utils/apiClient';
import type { Event } from '@/types';
import FlexRow from '@/components/FlexRow';

interface CompedGuestFormProps {
	onAdd?: (guest: unknown) => void;
}

interface CompedGuestFormState {
	firstName: string;
	lastName: string;
	comment: string;
	events: Event[];
	eventId: string;
}

export default class CompedGuestForm extends PureComponent<CompedGuestFormProps, CompedGuestFormState> {
	static defaultProps = {
		onAdd: () => {}
	};

	state: CompedGuestFormState = {
		firstName: '',
		lastName: '',
		comment: '',
		events: [],
		eventId: ''
	};

	firstInput: HTMLInputElement | null = null;
	submitting = false;

	constructor(props: CompedGuestFormProps) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.addGuest = this.addGuest.bind(this);
	}

	componentDidMount() {
		apiClient
			.get<Event[]>('/events')
			.then(events => this.setState({ events }))
			.catch(e => console.error('Event API Error', e));
	}

	handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
		this.setState({
			[e.currentTarget.name]: e.currentTarget.value
		} as unknown as Pick<CompedGuestFormState, keyof CompedGuestFormState>);
	}

	addGuest(e: React.FormEvent) {
		e.preventDefault();

		const { firstName, lastName, comment, eventId } = this.state;

		if (this.submitting || !firstName || !lastName || !eventId) return;

		this.submitting = true;

		apiClient
			.post('/guests', {
				// TODO: have tier dropdown between stachepass and sponsor
				admissionTier: 'stachepass',
				firstName,
				lastName,
				...(comment && { meta: { comment } }),
				eventId
			})
			.then(guest => {
				this.props.onAdd?.(guest);

				this.setState(
					{
						firstName: '',
						lastName: '',
						comment: ''
					},
					() => {
						this.firstInput?.focus();
						this.submitting = false;
					}
				);
			})
			.catch(err => {
				this.submitting = false;
				console.error('Event API Error', err);
			});
	}

	render() {
		const { firstName, lastName, comment, eventId, events } = this.state;

		return (
			<div className={styles.compedGuestForm}>
				<h4>Comp a Guest</h4>
				<FlexRow as="form" onSubmit={this.addGuest}>
					<input
						type="text"
						name="firstName"
						placeholder="First Name"
						value={firstName}
						onChange={this.handleChange}
						ref={el => {
							this.firstInput = el;
						}}
					/>
					<input type="text" name="lastName" placeholder="Last Name" value={lastName} onChange={this.handleChange} />
					<input type="text" name="comment" placeholder="comment" value={comment} onChange={this.handleChange} />
					<div className={styles.selectWrap}>
						<select name="eventId" value={eventId} onChange={this.handleChange}>
							<option disabled value="">
								Select an Event...
							</option>
							{events
								.filter(e => e.status === 'active')
								.map(e => (
									<option key={e.id} value={e.id}>
										{e.name}
									</option>
								))}
						</select>
					</div>

					<button className="white" type="submit">
						Add Guest
					</button>
				</FlexRow>
			</div>
		);
	}
}
