import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment-timezone';
import { fetchTransactions } from 'transactions/transactionsDuck';
import { fetchGuests } from 'guests/guestsDuck';
import { fetchSettings, turnOffSales, turnOnSales } from 'settings/settingsDuck';
import { formatThousands } from 'utils';

export class Dashboard extends Component {
	constructor(props) {
		super(props);

		this.userCanView = this.userCanView.bind(this);
	}

	componentDidMount() {
		this.props.fetchGuests();
		this.props.fetchSettings();
		this.userCanView() && this.props.fetchTransactions();
	}

	userCanView() {
		return ['admin', 'planner'].includes(this.props.user.role);
	}

	render() {
		const { transactions, guests, settings } = this.props,
			startOfToday = moment().tz('America/Los_Angeles').startOf('day'),
			startOfLast7 = moment().tz('America/Los_Angeles').subtract(7, 'days').startOf('day'),
			totalRevenue = transactions.map(p => Number(p.transaction_amount)).reduce((total, cur) => total + cur, 0),
			totalGuests = guests.length,
			guestsToday = guests.filter(g => moment(g.timestamp).tz('America/Los_Angeles').isAfter(startOfToday)).length,
			guestsLast7 = guests.filter(g => moment(g.timestamp).tz('America/Los_Angeles').isAfter(startOfLast7)).length,
			revenueToday = transactions.filter(p => moment(p.timestamp).tz('America/Los_Angeles').isAfter(startOfToday)).map(p => Number(p.transaction_amount)).reduce((total, cur) => total + cur, 0),
			checkedInGuests = guests.filter(g => g.checked_in).length,
			totalTransactions = transactions.length,
			averageTicketPrice = (totalRevenue / totalGuests).toFixed(2),
			averageSale = (totalRevenue / totalTransactions).toFixed(2),
			salesStart = moment({year: 2017, month: 0, day: 25}).tz('America/Los_Angeles'),
			salesEnd = moment({year: 2017, month: 2, day: 25}).tz('America/Los_Angeles'),
			salesDays = moment().tz('America/Los_Angeles').diff(salesStart, 'days'),
			daysLeft = salesEnd.diff(moment().tz('America/Los_Angeles'), 'days'),
			transactionsUpToLast7 = transactions.filter(p => moment(p.timestamp).tz('America/Los_Angeles').isBefore(startOfLast7)).map(p => Number(p.transaction_amount)),
			revenueUpToLast7 = transactionsUpToLast7.reduce((total, cur) => total + cur, 0),
			revenueSinceLastWeek = totalRevenue - revenueUpToLast7,
			revenueDailyAverage = (totalRevenue/salesDays).toFixed(2),
			transactionDailyAverage = (totalTransactions/salesDays).toFixed(2);

		// Projected revenue based on 7 day velocity
		const projectedRevenue = totalRevenue + Math.round((revenueSinceLastWeek/7)*(daysLeft + 1)),
			projectedAttendance = totalGuests + Math.round((guestsLast7/7)*(daysLeft + 1));

		// Get the salesOn value
		const salesOnSetting = settings.find(s => s.key === 'salesOn');

		let salesOn = false;
		if(salesOnSetting) {
			salesOn = salesOnSetting.value;
		}

		return (
			<div>
				{this.userCanView() &&
					<div>
						<h3>Goals</h3>
						<div className="goals">
							<div className="attendance">
								<h5>Attendance</h5>
								<p>{formatThousands(totalGuests)}</p>
							</div>
							<div className="revenue">
								<h5>Revenue</h5>
								<p>${formatThousands(totalRevenue)}</p>
							</div>
						</div>

						<h3>Stats</h3>
						<div className="stats">
							<div className="row">
								<div className="average-ticket-price">
									<h5>Average Ticket Price</h5>
									<p>${averageTicketPrice}</p>
								</div>
								<div className="average-sale">
									<h5>Average Sale</h5>
									<p>${averageSale}</p>
								</div>
								<div className="guests-today">
									<h5>Guests Today</h5>
									<p>{guestsToday}</p>
								</div>
								<div className="revenue-today">
									<h5>Revenue Today</h5>
									<p>${formatThousands(revenueToday)}</p>
								</div>
							</div>
							<div className="row">
								<div className="revenue-velocity">
									<h5>Revenue Daily Average</h5>
									<p>${revenueDailyAverage}/day</p>
								</div>
								<div className="transaction-velocity">
									<h5>Transaction Daily Average</h5>
									<p>{transactionDailyAverage} sales/day</p>
								</div>
								<div className="projected-revenue">
									<h5 title="Based on trailing 7 day average">Projected Revenue</h5>
									<p>${formatThousands(projectedRevenue)}</p>
								</div>
								<div className="projected-attendance">
									<h5 title="Based on trailing 7 day average">Projected Attendance</h5>
									<p>{formatThousands(projectedAttendance)}</p>
								</div>
							</div>
						</div>
					</div>
				}

				<h3>Day Of</h3>
				<div className="day-of">
					<div className="checked-in">
						<h5>Checked In</h5>
						<p>{formatThousands(checkedInGuests)}</p>
					</div>
					{this.props.user.role === 'admin' &&
						<div className="sales-on">
							<h5>Sales</h5>
							<p>
								{salesOn
									? <button onClick={this.props.turnOffSales} className="white">Sales are ON</button>
									: <button onClick={this.props.turnOnSales}>Sales are OFF</button>
								}

							</p>
						</div>
					}
				</div>

			</div>
		);
	}
}

Dashboard.propTypes = {
	transactions: PropTypes.array.isRequired,
	guests: PropTypes.array.isRequired,
	user: PropTypes.object.isRequired,
	settings: PropTypes.array.isRequired,
	fetchTransactions: PropTypes.func.isRequired,
	fetchGuests: PropTypes.func.isRequired,
	fetchSettings: PropTypes.func.isRequired,
	turnOffSales: PropTypes.func.isRequired,
	turnOnSales: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => ({
	transactions: state.data.transactions,
	guests: state.data.guests,
	settings: state.data.settings,
	user: state.session.user
});

export default connect(mapStateToProps, {
	fetchTransactions,
	fetchGuests,
	fetchSettings,
	turnOffSales,
	turnOnSales
})(Dashboard);
