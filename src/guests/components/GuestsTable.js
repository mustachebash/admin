import React, { PureComponent } from 'react';
import { checkScope } from 'utils';
import apiClient from 'utils/apiClient';
// import CompedGuestForm from '../components/CompedGuestForm';
import GuestsList from '../components/GuestsList';
import Search from 'components/Search';

export default class GuestsTable extends PureComponent {
	state = {
		guests: [],
		user: {
			role: 'admin'
		},
		event: {
			id: '34a99b2a-f826-406a-8227-921efd03ebff',
			name: 'Mustache Bash 2020'
		},
		filter: '',
		sortBy: 'name',
		sortOrder: 1 // asc
	};

	sortGuests = this.sortGuests.bind(this);
	switchGuestsOrder = this.switchGuestsOrder.bind(this);
	handleFilterChange = this.handleFilterChange.bind(this);

	componentDidMount() {
		apiClient.get('/guests', {eventId: this.state.event.id})
			.then(guests => this.setState({guests}))
			.catch(e => console.error('Guest API Error', e));
	}

	getGuestComparator() {
		return (a, b) => {
			let sort = 0;

			switch(this.state.sortBy) {
				case 'date':
					// This will (should) never be the same
					sort = a.created > b.created ? 1 : -1;
					break;

				default:
				case 'name':
					sort = a.lastName > b.lastName
						? 1
						: a.lastName === b.lastName
							? 0
							: -1;
					break;
			}

			return sort * this.state.sortOrder;
		};
	}

	sortGuests(sortBy) {
		this.setState({
			sortOrder: 1,
			sortBy
		});
	}

	switchGuestsOrder() {
		this.setState({
			sortOrder: this.state.sortOrder * (-1)
		});
	}

	handleFilterChange(q) {
		this.setState({
			filter: q
		});
	}

	render() {
		const filter = new RegExp(this.state.filter, 'i'),
			{ guests, user } = this.state;

		let filteredGuests = guests.filter(g => {
			if(!this.state.filter) return true;

			return (
				filter.test(g.firstName + ' ' + g.lastName) ||
				filter.test(g.confirmationId)
			);
		});

		filteredGuests = filteredGuests.sort(this.getGuestComparator());

		// No one needs to see more than 100 guests at a time
		filteredGuests = filteredGuests.slice(0, 100);

		return (
			<>
				{checkScope(user.role, 'admin') &&
					<>
						<h4>Comp a Guest</h4>
						{/* <CompedGuestForm /> */}
					</>
				}

				<Search handleQueryChange={this.handleFilterChange} />

				<p>Showing {filteredGuests.length} of {guests.length} total</p>

				<GuestsList
					guests={filteredGuests}
					sortGuests={this.sortGuests}
					switchGuestsOrder={this.switchGuestsOrder}
					sortBy={this.state.sortBy}
					sortOrder={this.state.sortOrder}
				/>
			</>
		);
	}
}
