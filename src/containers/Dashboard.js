import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { formatThousands, checkScope } from 'utils';
import { fetchEventSummary, fetchEventChart } from 'events/eventsDuck';
import EventsChart from 'components/EventsChart';
import Loader from 'components/Loader';

const mapStateToProps = (state, ownProps) => ({
	user: state.session.user,
	events: state.data.events,
	eventSummaries: state.data.eventSummaries,
	eventCharts: state.data.eventCharts,
	selectedEvents: state.control.selectedEvents
});

export default
@connect(mapStateToProps, {fetchEventSummary, fetchEventChart})
class Dashboard extends Component {
	static propTypes = {
		user: PropTypes.object.isRequired,
		events: PropTypes.array.isRequired,
		eventSummaries: PropTypes.array.isRequired,
		eventCharts: PropTypes.array.isRequired,
		selectedEvents: PropTypes.array.isRequired
	};

	state = {
		showChart: false
	};

	componentDidMount() {
		const { events, selectedEvents, fetchEventChart, fetchEventSummary } = this.props;

		selectedEvents.forEach(fetchEventSummary);
		events.length && Promise.all(events.map(e => fetchEventChart(e.id).then())).then(() => this.setState({showChart: true}));
	}

	componentDidUpdate(prevProps) {
		const { events, selectedEvents, fetchEventChart, fetchEventSummary } = this.props;

		if(prevProps.selectedEvents !== selectedEvents && prevProps.selectedEvents.length) selectedEvents.forEach(fetchEventSummary);
		if(prevProps.events !== events) Promise.all(events.map(e => fetchEventChart(e.id).then())).then(() => this.setState({showChart: true}));
	}

	render() {
		const eventSummaries = this.props.eventSummaries.filter(e => this.props.selectedEvents.includes(e.eventId)).sort((a, b) => a.date > b.date ? 1 : -1);

		return (
			<div>
				{this.state.showChart
					? <EventsChart chartData={this.props.eventCharts} />
					: <Loader />
				}
				<div className="summaries">
					{eventSummaries.map(e => (
						<div key={e.eventId}>
							<h2>{e.name}</h2>
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
								{checkScope(this.props.user.role, 'root') &&
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
