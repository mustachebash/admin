import './Dashboard.less';

import React, { useState, useEffect, useContext } from 'react';
import UserContext from 'UserContext';
import EventContext from 'EventContext';
import { formatThousands, checkScope } from 'utils';
import apiClient from 'utils/apiClient';
import EventsChart from 'components/EventsChart';
import Loader from 'components/Loader';
import EventSelector from 'components/EventSelector';

const Dashboard = () => {
	const [ eventSummary, setEventSummary ] = useState(null),
		[ eventChart, setEventChart ] = useState(null);

	const { event } = useContext(EventContext),
		{ user } = useContext(UserContext);

	useEffect(() => {
		if(event) {
			apiClient.get(`/events/${event.id}/summary`)
				.then(setEventSummary)
				.catch(e => console.error('Summary API Error', e));

			apiClient.get(`/events/${event.id}/chart`)
				.then(setEventChart)
				.catch(e => console.error('Chart API Error', e));
		}
	}, [event]);

	if(!eventSummary) return <Loader />;

	const {
		name,
		totalGuests,
		totalRevenue,
		totalPromoRevenue,
		guestsToday,
		revenueToday,
		totalCompedGuests,
		checkedIn
	} = eventSummary;

	return (
		<div className="dashboard">
			{eventChart
				? <EventsChart chartData={eventChart} />
				: <Loader />
			}

			<div className="filters">
				<EventSelector />
			</div>

			<div className="summary">
				<h2>{name}</h2>
				<div className="stats flex-row">
					<div className="attendance">
						<h5 data-tooltip="Total guests on the list for this event">Attendance</h5>
						<p>{formatThousands(totalGuests)}</p>
					</div>
					<div className="revenue">
						<h5 data-tooltip="Ticket revenue based on all ticket sales volume (price X quantity)">Revenue</h5>
						<p>${formatThousands(totalRevenue + totalPromoRevenue)}</p>
					</div>
					{status === 'active' &&
						<div className="guests-today">
							<h5 data-tooltip="Paying guests added today">Guests Today</h5>
							<p>{guestsToday}</p>
						</div>
					}
					{status === 'active' &&
						<div className="revenue-today">
							<h5 data-tooltip="Ticket revenue today based on all ticket sales volume (price X quantity)">Revenue Today</h5>
							<p>${formatThousands(revenueToday)}</p>
						</div>
					}
					{checkScope(user.role, 'admin') &&
						<>
							<div className="comped">
								<h5>Comped Guests</h5>
								<p>{formatThousands(totalCompedGuests)}</p>
							</div>
							<div className="promo-revenue">
								<h5 data-tooltip="Ticket revenue based on promo ticket sales volume only (price X quantity)">Promo Revenue</h5>
								<p>${formatThousands(totalPromoRevenue)}</p>
							</div>
							<div className="avg-revenue">
								<h5 data-tooltip="Average price paid per ticket (excludes comps, includes promos)">Avg. Ticket Revenue</h5>
								<p>${((totalRevenue + totalPromoRevenue) / (totalGuests - totalCompedGuests)).toFixed(2)}</p>
							</div>
						</>
					}
					{checkScope(user.role, 'root') &&
						<div className="checked-in">
							<h5>Checked In</h5>
							<p>{formatThousands(checkedIn)}</p>
						</div>
					}
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
