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
		[ extendedStats, setExtendedStats ] = useState(null),
		[ event2020Summary, setEvent2020Summary ] = useState(null),
		[ combine2020Stats, setCombine2020Stats ] = useState(true);

	const { event } = useContext(EventContext),
		{ user } = useContext(UserContext);

	useEffect(() => {
		if(event) {
			apiClient.get(`/events/${event.id}/summary`)
				.then(setEventSummary)
				.catch(e => console.error('Summary API Error', e));
		}
	}, [event]);

	useEffect(() => {
		if(event) {
			apiClient.get(`/events/${event.id}/extended-stats`)
				.then(setExtendedStats)
				.catch(e => console.error('Extended Stats API Error', e));
		}
	}, [event]);

	useEffect(() => {
		if(event?.id === EVENT_2022_ID && !event2020Summary) {
			apiClient.get(`/events/${EVENT_2020_ID}/summary`)
				.then(setEvent2020Summary)
				.catch(e => console.error('Summary API Error', e));
		}
	}, [event, event2020Summary]);

	if(
		!eventSummary ||
		!event ||
		(event.id === EVENT_2022_ID && !event2020Summary) ||
		event?.id !== eventSummary?.eventId
	) return <Loader />;

	const {
		name,
		totalGuests,
		totalPaidGuests,
		guestsToday,
		totalCompedGuests,
		totalVipGuests,
		checkedIn
	} = eventSummary || {};

	const {
		eventBudget,
		eventMaxCapacity,
		alcoholRevenue,
		foodRevenue,
		totalRevenue,
		totalPromoRevenue,
		salesTiers,
		revenueToday
	} = extendedStats || {};

	const {
		totalGuests: totalGuests2020,
		totalPaidGuests: totalPaidGuests2020,
		totalRevenue: totalRevenue2020,
		totalPromoRevenue: totalPromoRevenue2020,
		totalCompedGuests: totalCompedGuests2020,
		totalVipGuests: totalVipGuests2020,
		checkedIn: checkedIn2020
	} = event2020Summary || {};

	// Switch on the set event id for 2022
	const add2020Stats = combine2020Stats && event.id === EVENT_2022_ID;

	return (
		<div className="dashboard">
			<EventsChart />

			<div className="filters flex-row">
				<EventSelector />
				{event.id === EVENT_2022_ID &&
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
					{event.status === 'active' && checkScope(user.role, 'write') &&
						<div className="guests-today">
							<h5 data-tooltip="Paying tickets sold today">Tickets Sold Today</h5>
							<p>{guestsToday}</p>
						</div>
					}

					{checkScope(user.role, 'write') &&
						<div className="comped">
							<h5>Comped Guests</h5>
							<p>{formatThousands(totalCompedGuests + (add2020Stats ? totalCompedGuests2020 : 0))}</p>
						</div>
					}

					<div className="vip">
						<h5>VIP Guests</h5>
						<p>{formatThousands(totalVipGuests + (add2020Stats ? totalVipGuests2020 : 0))}</p>
					</div>

					<div className="checked-in">
						<h5>Checked In</h5>
						<p>{formatThousands(checkedIn + (add2020Stats ? checkedIn2020 : 0))}</p>
					</div>
				</div>
			</div>
			{checkScope(user.role, 'write') &&
				<div className="extended-stats">
					{!!extendedStats && extendedStats.eventId === event.id
						? <>
							<div className="stats flex-row">
								<div className="revenue">
									<h5 data-tooltip="Ticket revenue based on all ticket sales volume (price X quantity)">Revenue</h5>
									<p>${formatThousands(totalRevenue + totalPromoRevenue + (add2020Stats ? (totalRevenue2020 + totalPromoRevenue2020) : 0))}</p>
								</div>
								<div className="promo-revenue">
									<h5 data-tooltip="Ticket revenue based on promo ticket sales volume only (price X quantity)">Promo Revenue</h5>
									<p>${formatThousands(totalPromoRevenue + (add2020Stats ? totalPromoRevenue2020 : 0))}</p>
								</div>
								{event.status === 'active' &&
									<div className="revenue-today">
										<h5 data-tooltip="Ticket revenue today based on all ticket sales volume (price X quantity)">Revenue Today</h5>
										<p>${formatThousands(revenueToday)}</p>
									</div>
								}
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
							</div>
							<div className="stats flex-row">
								<div className="total-ticket-sales">
									<h5 data-tooltip="All tickets purchased (includes promos)">Total Ticket Sales</h5>
									<p>{formatThousands(totalPaidGuests + (add2020Stats ? totalPaidGuests2020 : 0))}</p>
								</div>
								{((add2020Stats || event.id !== EVENT_2022_ID) && !!eventBudget) &&
									<div className="avg-cost">
										<h5 data-tooltip="Event cost per paid guest (based on budget numbers, excludes comps)">Cost per Paid Guest</h5>
										<p>${(eventBudget / ((totalGuests + (add2020Stats ? totalGuests2020 : 0)) - (totalCompedGuests + (add2020Stats ? totalCompedGuests2020 : 0)))).toFixed(2)}</p>
									</div>
								}
								{false && ((add2020Stats || event.id !== EVENT_2022_ID) && !!eventBudget) &&
									<div className="avg-alcohol">
										<h5 data-tooltip="Alcohol revenue per attendee (based on budget numbers, assumes sell out)">Expected Alcohol RPA</h5>
										<p>${(alcoholRevenue / eventMaxCapacity).toFixed(2)}</p>
									</div>
								}
								{false && ((add2020Stats || event.id !== EVENT_2022_ID) && !!eventBudget) &&
									<div className="avg-food">
										<h5 data-tooltip="Food revenue per attendee (based on budget numbers, assumes sell out)">Expected Food RPA</h5>
										<p>${(foodRevenue / eventMaxCapacity).toFixed(2)}</p>
									</div>
								}
							</div>
							<div className="stats flex-row">
								{salesTiers.map(t => (
									<div className="tier-sales" key={t.name}>
										<h5>{t.name} - ${t.price}</h5>
										<p>{formatThousands(t.quantity)}</p>
									</div>
								))}
							</div>
						</>
						: <Loader />
					}
				</div>
			}
		</div>
	);
};

export default Dashboard;
