import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { fetchGuests, checkIn, checkOut } from '../guestsDuck';
import { connectToSocket } from 'appDuck';
import GuestsList from '../components/GuestsList';
import Search from 'components/Search';

export class GuestsTable extends Component {
	constructor(props) {
		super(props);

		this.state = {
			filter: '',
			sortBy: 'name',
			sortOrder: -1 // DESC
		};

		this.sortGuests = this.sortGuests.bind(this);
		this.switchGuestsOrder = this.switchGuestsOrder.bind(this);
		this.handleFilterChange = this.handleFilterChange.bind(this);
	}

	componentDidMount() {
		this.props.fetchGuests({eventId: this.props.selectedEvents});
		this.props.connectToSocket();
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
					sort = a.lastName > b.lastName ? -1 : a.lastName === b.lastName ? 0 : 1;
					break;
			}

			return sort * this.state.sortOrder;
		};
	}

	sortGuests(sortBy) {
		this.setState({
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
		const guests = this.props.guests.filter(g => {
			if(!this.state.filter) return true;

			const filter = this.state.filter.toLowerCase();

			return (
				(g.firstName + ' ' + g.lastName).toLowerCase().includes(filter) ||
				g.transactionId.toLowerCase().includes(filter)
			);
		}).sort(this.getGuestComparator());

		return (
			<div>
				<Search handleQueryChange={this.handleFilterChange} />

				<GuestsList
					guests={guests}
					sortGuests={this.sortGuests}
					switchGuestsOrder={this.switchGuestsOrder}
					sortBy={this.state.sortBy}
					sortOrder={this.state.sortOrder}
					checkIn={this.props.checkIn}
					checkOut={this.props.checkOut}
				/>
			</div>
		);
	}
}

GuestsTable.propTypes = {
	guests: PropTypes.array.isRequired,
	fetchGuests: PropTypes.func.isRequired,
	checkIn: PropTypes.func.isRequired,
	checkOut: PropTypes.func.isRequired,
	connectToSocket: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => ({
	guests: state.data.guests,
	selectedEvents: state.control.selectedEvents
});

export default connect(mapStateToProps, {
	fetchGuests,
	checkIn,
	checkOut,
	connectToSocket
})(GuestsTable);
