import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { formatThousands, checkScope } from 'utils';
import { fetchEventSummary, fetchEventChart } from 'events/eventsDuck';
import { fetchTransactions } from 'transactions/transactionsDuck';
import { fetchProduct } from 'products/productsDuck';
import EventsChart from 'components/EventsChart';
import Loader from 'components/Loader';

const DONATION_PRODUCT_ID = '11c2f51e-407d-45be-b8a0-8247ac2f9cd3';

const mapStateToProps = (state, ownProps) => ({
	user: state.session.user,
	events: state.data.events,
	donationCount: state.data.transactions.filter(t => t.order.some(o => o.productId === DONATION_PRODUCT_ID))
		.reduce((acc, cur) => acc + cur.order.find(o => o.productId === DONATION_PRODUCT_ID).quantity, 0),
	donationProduct: state.data.products.find(p => p.id === DONATION_PRODUCT_ID),
	eventSummaries: state.data.eventSummaries,
	eventCharts: state.data.eventCharts,
	selectedEvents: state.control.selectedEvents
});

export default
@connect(mapStateToProps, {fetchEventSummary, fetchEventChart, fetchTransactions, fetchProduct})
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
		const { events, selectedEvents, fetchEventChart, fetchEventSummary, fetchTransactions, fetchProduct } = this.props;

		selectedEvents.forEach(fetchEventSummary);
		events.length && Promise.all(events.map(e => fetchEventChart(e.id).then())).then(() => this.setState({showChart: true}));
		fetchTransactions({productId: DONATION_PRODUCT_ID});
		fetchProduct(DONATION_PRODUCT_ID);
	}

	componentDidUpdate(prevProps) {
		const { events, selectedEvents, fetchEventChart, fetchEventSummary } = this.props;

		if(prevProps.selectedEvents !== selectedEvents && prevProps.selectedEvents.length) selectedEvents.forEach(fetchEventSummary);
		if(prevProps.events !== events) Promise.all(events.map(e => fetchEventChart(e.id).then())).then(() => this.setState({showChart: true}));
	}

	render() {
		const { donationProduct, donationCount } = this.props,
			eventSummaries = this.props.eventSummaries.filter(e => this.props.selectedEvents.includes(e.eventId)).sort((a, b) => a.date > b.date ? 1 : -1);

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
									<h5 data-tooltip="Total guests on the list for this event">Attendance</h5>
									<p>{formatThousands(e.totalGuests)}</p>
								</div>
								<div className="revenue">
									<h5 data-tooltip="Ticket revenue based on all ticket sales volume (price X quantity)">Revenue</h5>
									<p>${formatThousands(e.totalRevenue + e.totalPromoRevenue)}</p>
								</div>
								{e.status === 'active' &&
									<div className="guests-today">
										<h5 data-tooltip="Paying guests added today">Guests Today</h5>
										<p>{e.guestsToday}</p>
									</div>
								}
								{e.status === 'active' &&
									<div className="revenue-today">
										<h5 data-tooltip="Ticket revenue today based on all ticket sales volume (price X quantity)">Revenue Today</h5>
										<p>${formatThousands(e.revenueToday)}</p>
									</div>
								}
								{checkScope(this.props.user.role, 'admin') &&
									<Fragment>
										<div className="comped">
											<h5>Comped Guests</h5>
											<p>{formatThousands(e.totalCompedGuests)}</p>
										</div>
										<div className="promo-revenue">
											<h5 data-tooltip="Ticket revenue based on promo ticket sales volume only (price X quantity)">Promo Revenue</h5>
											<p>${formatThousands(e.totalPromoRevenue)}</p>
										</div>
										<div className="avg-revenue">
											<h5 data-tooltip="Average price paid per ticket (excludes comps, includes promos)">Avg. Ticket Revenue</h5>
											<p>${((e.totalRevenue + e.totalPromoRevenue) / (e.totalGuests - e.totalCompedGuests)).toFixed(2)}</p>
										</div>
									</Fragment>
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
					<div className="donations-summary">
						<h2>Donations</h2>
						<div className="stats flex-row">
							<div className="product">
								<h5>Product</h5>
								<p>{donationProduct && donationProduct.name}</p>
							</div>
							<div className="quantity">
								<h5>Quantity</h5>
								<p>{donationCount}</p>
							</div>
							<div className="revenue">
								<h5>Revenue</h5>
								<p>${donationProduct && formatThousands(donationProduct.price * donationCount)}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
