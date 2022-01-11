import './Dashboard.less';

import React, { useState, useEffect, useContext } from 'react';
import UserContext from 'UserContext';
import EventContext from 'EventContext';
import { formatThousands, checkScope } from 'utils';
import apiClient from 'utils/apiClient';
import EventsChart from 'components/EventsChart';
import Loader from 'components/Loader';
import EventSelector from 'components/EventSelector';
import Toggle from 'components/Toggle';

const Dashboard = () => {
	const [ eventSummary, setEventSummary ] = useState(null),
		[ event2020Summary, setEvent2020Summary ] = useState(null),
		[ combine2020Stats, setCombine2020Stats ] = useState(true),
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

	useEffect(() => {
		apiClient.get('/events/34a99b2a-f826-406a-8227-921efd03ebff/summary')
			.then(setEvent2020Summary)
			.catch(e => console.error('Summary API Error', e));
	}, []);

	if(!eventSummary || !event || !event2020Summary) return <Loader />;

	const {
		name,
		eventBudget,
		alcoholRevenue,
		foodRevenue,
		totalGuests,
		totalRevenue,
		totalPromoRevenue,
		guestsToday,
		revenueToday,
		totalCompedGuests,
		checkedIn
	} = eventSummary;

	const {
		totalGuests: totalGuests2020,
		totalRevenue: totalRevenue2020,
		totalPromoRevenue: totalPromoRevenue2020,
		totalCompedGuests: totalCompedGuests2020,
		checkedIn: checkedIn2020
	} = event2020Summary;

	// Switch on the set event id for 2022
	const add2020Stats = combine2020Stats && event.id === 'a0ae862c-1755-497c-b843-8457b5696a2a';

	return (
		<div className="dashboard">
			{eventChart
				? <EventsChart chartData={eventChart} />
				: <Loader />
			}

			<div className="filters flex-row">
				<EventSelector />
				{event.id === 'a0ae862c-1755-497c-b843-8457b5696a2a' &&
					<div className="event-sales-toggle">
						<label>Aggregate 2020 Data with 2022</label>
						<Toggle toggleState={combine2020Stats} handleToggle={() => setCombine2020Stats(!combine2020Stats)} />
					</div>
				}
			</div>

			<div className="summary">
				<h2>{name}{add2020Stats && <span>&nbsp; (2020 data included)</span>}</h2>
				<div className="stats flex-row">
					<div className="attendance">
						<h5 data-tooltip="Total guests on the list for this event">Total Attendance</h5>
						<p>{formatThousands(totalGuests + (add2020Stats ? totalGuests2020 : 0))}</p>
					</div>
					{event.status === 'active' &&
						<div className="guests-today">
							<h5 data-tooltip="Paying guests added today">Guests Today</h5>
							<p>{guestsToday}</p>
						</div>
					}
					{checkScope(user.role, 'admin') &&
						<div className="comped">
							<h5>Comped Guests</h5>
							<p>{formatThousands(totalCompedGuests + (add2020Stats ? totalCompedGuests2020 : 0))}</p>
						</div>
					}
					<div className="revenue">
						<h5 data-tooltip="Ticket revenue based on all ticket sales volume (price X quantity)">Revenue</h5>
						<p>${formatThousands(totalRevenue + totalPromoRevenue + (add2020Stats ? (totalRevenue2020 + totalPromoRevenue2020) : 0))}</p>
					</div>
					{event.status === 'active' &&
						<div className="revenue-today">
							<h5 data-tooltip="Ticket revenue today based on all ticket sales volume (price X quantity)">Revenue Today</h5>
							<p>${formatThousands(revenueToday)}</p>
						</div>
					}
					{checkScope(user.role, 'root') &&
						<div className="checked-in">
							<h5>Checked In</h5>
							<p>{formatThousands(checkedIn + (add2020Stats ? checkedIn2020 : 0))}</p>
						</div>
					}
				</div>
				{checkScope(user.role, 'admin') &&
					<div className="stats flex-row">
						<div className="promo-revenue">
							<h5 data-tooltip="Ticket revenue based on promo ticket sales volume only (price X quantity)">Promo Revenue</h5>
							<p>${formatThousands(totalPromoRevenue + (add2020Stats ? totalPromoRevenue2020 : 0))}</p>
						</div>
						<div className="avg-revenue">
							<h5 data-tooltip="Average price paid per ticket (excludes comps, includes promos)">Avg. Ticket Revenue</h5>
							<p>
								${
									(
										(totalRevenue + totalPromoRevenue + (add2020Stats ? (totalRevenue2020 + totalPromoRevenue2020) : 0)) /
										((totalGuests + (add2020Stats ? totalGuests2020 : 0)) - (totalCompedGuests + (add2020Stats ? totalCompedGuests2020 : 0)))
									).toFixed(2)
								}
							</p>
						</div>
						{((add2020Stats || event.id !== 'a0ae862c-1755-497c-b843-8457b5696a2a') && !!eventBudget) &&
							<div className="avg-cost">
								<h5 data-tooltip="Event cost per paid guest (based on budget numbers, excludes comps)">Cost per Guest</h5>
								<p>${(eventBudget / ((totalGuests + (add2020Stats ? totalGuests2020 : 0)) - (totalCompedGuests + (add2020Stats ? totalCompedGuests2020 : 0)))).toFixed(2)}</p>
							</div>
						}
						{/*{((add2020Stats || event.id !== 'a0ae862c-1755-497c-b843-8457b5696a2a') && !!eventBudget) &&
							<div className="avg-alcohol">
								<h5 data-tooltip="Alcohol revenue per paid guest (based on budget numbers, excludes comps)">Alcohol Revenue per Guest</h5>
								<p>${(alcoholRevenue / ((totalGuests + (add2020Stats ? totalGuests2020 : 0)) - (totalCompedGuests + (add2020Stats ? totalCompedGuests2020 : 0)))).toFixed(2)}</p>
							</div>
						}
						{((add2020Stats || event.id !== 'a0ae862c-1755-497c-b843-8457b5696a2a') && !!eventBudget) &&
							<div className="avg-food">
								<h5 data-tooltip="Food revenue per paid guest (based on budget numbers, excludes comps)">Food Revenue per Guest</h5>
								<p>${(foodRevenue / ((totalGuests + (add2020Stats ? totalGuests2020 : 0)) - (totalCompedGuests + (add2020Stats ? totalCompedGuests2020 : 0)))).toFixed(2)}</p>
							</div>
						}*/}
					</div>
				}
			</div>
		</div>
	);
};

export default Dashboard;
