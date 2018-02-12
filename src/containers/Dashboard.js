import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { formatThousands } from 'utils';
import { fetchEventSummary, fetchEventChart } from 'events/eventsDuck';
import EventsChart from 'components/EventsChart';

export class Dashboard extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.props.events.forEach(e => this.props.fetchEventChart(e.id));
		this.props.selectedEvents.forEach(this.props.fetchEventSummary);
	}

	componentWillUpdate(nextProps) {
		if(nextProps.selectedEvents !== this.props.selectedEvents && nextProps.selectedEvents.length) nextProps.selectedEvents.forEach(this.props.fetchEventSummary);
		if(nextProps.events !== this.props.events) nextProps.events.forEach(e => this.props.fetchEventChart(e.id));
	}

	render() {
		const eventSummaries = this.props.eventSummaries.filter(e => this.props.selectedEvents.includes(e.eventId)).sort((a, b) => a.date > b.date ? 1 : -1);

		return (
			<div>
				<EventsChart chartData={this.props.eventCharts} />
				<div className="summaries">
					{eventSummaries.map(e => (
						<div key={e.eventId}>
							<h3>{e.name}</h3>
							<div className="stats flex-row">
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
					))}
				</div>
			</div>
		);
	}
}

Dashboard.propTypes = {
	events: PropTypes.array.isRequired,
	eventSummaries: PropTypes.array.isRequired,
	eventCharts: PropTypes.array.isRequired,
	selectedEvents: PropTypes.array.isRequired
};

const mapStateToProps = (state, ownProps) => ({
	events: state.data.events,
	eventSummaries: state.data.eventSummaries,
	eventCharts: state.data.eventCharts,
	selectedEvents: state.control.selectedEvents
});

export default connect(mapStateToProps, {
	fetchEventSummary,
	fetchEventChart
})(Dashboard);
