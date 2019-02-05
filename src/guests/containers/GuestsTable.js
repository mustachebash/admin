import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { fetchGuests, addGuest, checkIn, checkOut, updateGuestName, archiveGuest } from '../guestsDuck';
import { connectToSocket } from 'appDuck';
import { checkScope } from 'utils';
import CompedGuestForm from '../components/CompedGuestForm';
import GuestsList from '../components/GuestsList';
import Search from 'components/Search';

export class GuestsTable extends Component {
	constructor(props) {
		super(props);

		this.state = {
			filter: '',
			sortBy: 'name',
			sortOrder: 1 // asc
		};

		this.sortGuests = this.sortGuests.bind(this);
		this.switchGuestsOrder = this.switchGuestsOrder.bind(this);
		this.handleFilterChange = this.handleFilterChange.bind(this);
	}

	componentDidMount() {
		this.props.selectedEvents.length && this.props.fetchGuests({eventId: this.props.selectedEvents});
		this.props.connectToSocket();
	}

	componentDidUpdate(prevProps) {
		if((prevProps.selectedEvents !== this.props.selectedEvents && this.props.selectedEvents.length) ||
			(!prevProps.socketConnected && this.props.socketConnected)
		) {
			this.props.fetchGuests({eventId: this.props.selectedEvents});
		}
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
		const events = this.props.events.filter(e => this.props.selectedEvents.includes(e.id)),
			filter = new RegExp(this.state.filter, 'i');

		let guests = this.props.guests.filter(g => {
			if(!this.props.selectedEvents.includes(g.eventId)) return false;
			if(!this.state.filter) return true;

			return (
				filter.test(g.firstName + ' ' + g.lastName) ||
				filter.test(g.confirmationId)
			);
		});

		guests = guests.sort(this.getGuestComparator());

		// No one needs to see more than 100 guests at a time
		guests = guests.slice(0, 100);

		return (
			<React.Fragment>
				{checkScope(this.props.user.role, 'admin') &&
					<React.Fragment>
						<h4>Comp a Guest</h4>
						<CompedGuestForm events={events} addGuest={this.props.addGuest}/>
					</React.Fragment>
				}

				<Search handleQueryChange={this.handleFilterChange} />

				<p>Showing {guests.length} of {this.props.guests.length} total</p>

				<GuestsList
					user={this.props.user}
					guests={guests}
					events={events}
					sortGuests={this.sortGuests}
					switchGuestsOrder={this.switchGuestsOrder}
					sortBy={this.state.sortBy}
					sortOrder={this.state.sortOrder}
					checkIn={this.props.checkIn}
					checkOut={this.props.checkOut}
					updateGuestName={this.props.updateGuestName}
					archiveGuest={this.props.archiveGuest}
				/>
			</React.Fragment>
		);
	}
}

GuestsTable.propTypes = {
	user: PropTypes.object.isRequired,
	guests: PropTypes.array.isRequired,
	events: PropTypes.array.isRequired,
	fetchGuests: PropTypes.func.isRequired,
	addGuest: PropTypes.func.isRequired,
	checkIn: PropTypes.func.isRequired,
	checkOut: PropTypes.func.isRequired,
	connectToSocket: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => ({
	user: state.session.user,
	socketConnected: state.session.socketConnected,
	guests: state.data.guests,
	events: state.data.events,
	selectedEvents: state.control.selectedEvents
});

export default connect(mapStateToProps, {
	fetchGuests,
	addGuest,
	checkIn,
	checkOut,
	updateGuestName,
	archiveGuest,
	connectToSocket
})(GuestsTable);
