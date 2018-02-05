import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { formatThousands } from 'utils';
import { fetchEventSummary } from 'events/eventsDuck';

export class Dashboard extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.props.selectedEvents.forEach(e => this.props.fetchEventSummary(e));
	}

	componentWillUpdate(nextProps) {
		if(nextProps.selectedEvents !== this.props.selectedEvents && nextProps.selectedEvents.length) nextProps.selectedEvents.forEach(e => this.props.fetchEventSummary(e));
	}

	render() {
		const eventSummaries = this.props.eventSummaries.filter(e => this.props.selectedEvents.includes(e.eventId)).sort((a, b) => a.date > b.date ? 1 : -1);

		return eventSummaries.map(e => (
			<div key={e.eventId}>
				<h3>{e.name}</h3>
				<div className="stats">
					<div className="row">
						<div className="attendance">
							<h5>Attendance</h5>
							<p>{formatThousands(e.totalGuests)}</p>
						</div>
						<div className="revenue">
							<h5>Revenue</h5>
							<p>${formatThousands(e.totalRevenue)}</p>
						</div>
						{e.status === 'active' &&
							<div className="guests-today">
								<h5>Guests Today</h5>
								<p>{e.guestsToday}</p>
							</div>
						}
						{e.status === 'active' &&
							<div className="revenue-today">
								<h5>Revenue Today</h5>
								<p>${formatThousands(e.revenueToday)}</p>
							</div>
						}
						{Date.parse(e.date) < Date.now() &&
							<div className="checked-in">
								<h5>Checked In</h5>
								<p>{formatThousands(e.checkedIn)}</p>
							</div>
						}
					</div>
				</div>
			</div>
		));
	}
}

Dashboard.propTypes = {
	eventSummaries: PropTypes.array.isRequired,
	selectedEvents: PropTypes.array.isRequired
};

const mapStateToProps = (state, ownProps) => ({
	eventSummaries: state.data.eventSummaries,
	selectedEvents: state.control.selectedEvents
});

export default connect(mapStateToProps, {
	fetchEventSummary
})(Dashboard);
