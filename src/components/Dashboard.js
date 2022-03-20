import './Dashboard.less';

import React, { useState, useEffect, useContext } from 'react';
import UserContext from 'UserContext';
import EventContext from 'EventContext';
import { formatThousands, checkScope } from 'utils';
import apiClient from 'utils/apiClient';
import EventsChart from 'components/EventsChart';
import ProjectionChart from 'components/ProjectionChart';
import Loader from 'components/Loader';
import EventSelector from 'components/EventSelector';
import Toggle from 'components/Toggle';

const Dashboard = () => {
	const [ eventSummary, setEventSummary ] = useState(null),
		[ event2020Summary, setEvent2020Summary ] = useState(null),
		[ combine2020Stats, setCombine2020Stats ] = useState(true),
		[ eventChart, setEventChart ] = useState(null),
		[ currentTicket, setCurrentTicket ] = useState(null);

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

			if(event.salesOn && event.currentTicket) {
				apiClient.get(`/products/${event.currentTicket}`)
					.then(setCurrentTicket)
					.catch(e => console.error('Product API Error', e));
			} else {
				setCurrentTicket(null);
			}
		}
	}, [event]);

	useEffect(() => {
		apiClient.get('/events/34a99b2a-f826-406a-8227-921efd03ebff/summary')
			.then(setEvent2020Summary)
			.catch(e => console.error('Summary API Error', e));
	}, []);

	if(!eventSummary || !event || !event2020Summary || event?.id !== eventSummary?.eventId) return <Loader />;

	const {
		name,
		eventBudget,
		eventMaxCapacity,
		alcoholRevenue,
		foodRevenue,
		totalGuests,
		totalRevenue,
		totalPromoRevenue,
		salesTiers,
		averageQuantity,
		guestsToday,
		revenueToday,
		totalCompedGuests,
		totalVIPGuests,
		checkedIn
	} = eventSummary;

	const {
		totalGuests: totalGuests2020,
		totalRevenue: totalRevenue2020,
		totalPromoRevenue: totalPromoRevenue2020,
		totalCompedGuests: totalCompedGuests2020,
		totalVIPGuests: totalVIPGuests2020,
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
					{checkScope(user.role, 'admin') &&
						<div className="vip">
							<h5>VIP Guests</h5>
							<p>{formatThousands(totalVIPGuests + (add2020Stats ? totalVIPGuests2020 : 0))}</p>
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
					<>
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
							{((add2020Stats || event.id !== 'a0ae862c-1755-497c-b843-8457b5696a2a') && !!eventBudget) &&
								<div className="avg-alcohol">
									<h5 data-tooltip="Alcohol revenue per attendee (based on budget numbers, assumes sell out)">Expected Alcohol RPA</h5>
									<p>${(alcoholRevenue / eventMaxCapacity).toFixed(2)}</p>
								</div>
							}
							{((add2020Stats || event.id !== 'a0ae862c-1755-497c-b843-8457b5696a2a') && !!eventBudget) &&
								<div className="avg-food">
									<h5 data-tooltip="Food revenue per attendee (based on budget numbers, assumes sell out)">Expected Food RPA</h5>
									<p>${(foodRevenue / eventMaxCapacity).toFixed(2)}</p>
								</div>
							}
						</div>
						<div className="stats flex-row">
							{salesTiers.map(t => (
								<div className="tier-sales" key={t.name}>
									<h5>{t.name} - ${t.price || `${(totalPromoRevenue / t.quantity).toFixed(2)} avg.`}</h5>
									<p>{formatThousands(t.quantity)}</p>
								</div>
							))}
							<div className="tier-sales" data-tooltip="Avg. tickets sold per transaction">
								<h5>Avg. Qty Per Transaction</h5>
								<p>{averageQuantity.toFixed(2)}</p>
							</div>
						</div>
						{event.salesOn && currentTicket && (add2020Stats || event.id !== 'a0ae862c-1755-497c-b843-8457b5696a2a') &&
							<>
								<div className="stats flex-row">
									<div className="break-even-sales">
										<h5 data-tooltip="Ticket sales required at current tier to break even">Break Even Sales</h5>
										{currentTicket &&
											<p>{formatThousands(Math.ceil((eventBudget - (totalRevenue + totalPromoRevenue + (add2020Stats ? (totalRevenue2020 + totalPromoRevenue2020) : 0)))/currentTicket.price))}</p>
										}
									</div>
									<div className="comped">
										<h5>Tickets Left</h5>
										<p>{formatThousands(eventMaxCapacity - (totalGuests + (add2020Stats ? totalGuests2020 : 0)))}</p>
									</div>
									<div className="avg-revenue-allowed">
										<h5 data-tooltip="Average price paid per ticket allowed for remaining capacity to break even">Avg. Ticket Revenue Allowable</h5>
										<p>
											${
												(
													(eventBudget - (totalRevenue + totalPromoRevenue + (add2020Stats ? (totalRevenue2020 + totalPromoRevenue2020) : 0)))/
													(eventMaxCapacity - (totalGuests + (add2020Stats ? totalGuests2020 : 0)))
												).toFixed(2)
											}
										</p>
									</div>
									{((add2020Stats || event.id !== 'a0ae862c-1755-497c-b843-8457b5696a2a') && !!eventBudget) &&
										<div className="blended-cpa">
											{/* eslint-disable max-len */}
											<h5
												data-tooltip="Blended CPA target for sellout (based on avg. revenue allowed and current ticket price) - this works because the fixed marketing budget is included in the total budget"
											>
												Target Blended CPA
											</h5>
											{/* eslint-enable */}
											<p>${(
												currentTicket.price - (
													(eventBudget - (totalRevenue + totalPromoRevenue + (add2020Stats ? (totalRevenue2020 + totalPromoRevenue2020) : 0)))/
														(eventMaxCapacity - (totalGuests + (add2020Stats ? totalGuests2020 : 0)))
												)).toFixed(2)}</p>
										</div>
									}
								</div>
								<ProjectionChart
									budget={eventBudget}
									maxCapacity={eventMaxCapacity}
									currentAttendance={totalGuests + (add2020Stats ? totalGuests2020 : 0)}
									currentTicketPrice={currentTicket.price}
									currentRevenue={totalRevenue + totalPromoRevenue + (add2020Stats ? (totalRevenue2020 + totalPromoRevenue2020) : 0)}
								/>
							</>
						}
					</>
				}
			</div>
		</div>
	);
};

export default Dashboard;
