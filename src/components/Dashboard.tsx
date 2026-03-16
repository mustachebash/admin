import styles from './Dashboard.module.css';

import { useState, useEffect, useContext } from 'react';
import FlexRow from './FlexRow';
import UserContext from '@/UserContext';
import EventContext from '@/EventContext';
import { EVENT_2022_ID, EVENT_2020_ID } from '@/config';
import { formatThousands, checkScope } from '@/utils';
import apiClient from '@/utils/apiClient';
import EventsChart from '@/components/EventsChart';
import Loader from '@/components/Loader';
import EventSelector from '@/components/EventSelector';
import Toggle from '@/components/Toggle';

interface EventSummary {
	eventId: string;
	name: string;
	totalGuests: number;
	totalPaidGuests: number;
	guestsToday: number;
	totalCompedGuests: number;
	totalVipGuests: number;
	checkedIn: number;
	totalRevenue?: number;
	totalPromoRevenue?: number;
}

interface SalesTier {
	name: string;
	price: number;
	quantity: number;
}

interface ExtendedStats {
	eventId: string;
	eventBudget?: number;
	eventMaxCapacity?: number;
	alcoholRevenue?: number;
	foodRevenue?: number;
	totalRevenue: number;
	totalPromoRevenue: number;
	salesTiers: SalesTier[];
	revenueToday?: number;
}

const Dashboard = () => {
	const [eventSummary, setEventSummary] = useState<EventSummary | null>(null),
		[extendedStats, setExtendedStats] = useState<ExtendedStats | null>(null),
		[event2020Summary, setEvent2020Summary] = useState<EventSummary | null>(null),
		[combine2020Stats, setCombine2020Stats] = useState(true);

	const { event } = useContext(EventContext),
		{ user } = useContext(UserContext);

	useEffect(() => {
		if (event) {
			apiClient
				.get<EventSummary>(`/events/${event.id}/summary`)
				.then(setEventSummary)
				.catch(e => console.error('Summary API Error', e));
		}
	}, [event]);

	useEffect(() => {
		if (event) {
			apiClient
				.get<ExtendedStats>(`/events/${event.id}/extended-stats`)
				.then(setExtendedStats)
				.catch(e => console.error('Extended Stats API Error', e));
		}
	}, [event]);

	useEffect(() => {
		if (event?.id === EVENT_2022_ID && !event2020Summary) {
			apiClient
				.get<EventSummary>(`/events/${EVENT_2020_ID}/summary`)
				.then(setEvent2020Summary)
				.catch(e => console.error('Summary API Error', e));
		}
	}, [event, event2020Summary]);

	if (!eventSummary || !event || !user || (event.id === EVENT_2022_ID && !event2020Summary) || event?.id !== eventSummary?.eventId) return <Loader />;

	const { name, totalGuests, totalPaidGuests, guestsToday, totalCompedGuests, totalVipGuests, checkedIn } = eventSummary;

	const { eventBudget, totalRevenue = 0, totalPromoRevenue = 0, salesTiers = [], revenueToday } = extendedStats ?? ({} as ExtendedStats);

	const {
		totalGuests: totalGuests2020 = 0,
		totalPaidGuests: totalPaidGuests2020 = 0,
		totalRevenue: totalRevenue2020 = 0,
		totalPromoRevenue: totalPromoRevenue2020 = 0,
		totalCompedGuests: totalCompedGuests2020 = 0,
		totalVipGuests: totalVipGuests2020 = 0,
		checkedIn: checkedIn2020 = 0
	} = event2020Summary || {};

	// Switch on the set event id for 2022
	const add2020Stats = combine2020Stats && event.id === EVENT_2022_ID;

	return (
		<div className={styles.dashboard}>
			<EventsChart />

			<FlexRow className={styles.filters}>
				<EventSelector />
				{event.id === EVENT_2022_ID && (
					<div className={styles.eventSalesToggle}>
						<label>Aggregate 2020 Data with 2022</label>
						<Toggle toggleState={combine2020Stats} handleToggle={() => setCombine2020Stats(!combine2020Stats)} />
					</div>
				)}
			</FlexRow>

			<div className="summary">
				<h2>
					{name}
					{add2020Stats && <span>&nbsp; (2020 data included)</span>}
				</h2>
				<FlexRow className={styles.stats}>
					<div className="attendance">
						<h5 data-tooltip="Total guests on the list for this event">Total Attendance</h5>
						<p>{formatThousands(totalGuests + (add2020Stats ? totalGuests2020 : 0))}</p>
					</div>
					{event.status === 'active' && checkScope(user.role, 'write') && (
						<div className="guests-today">
							<h5 data-tooltip="Paying tickets sold today">Tickets Sold Today</h5>
							<p>{guestsToday}</p>
						</div>
					)}

					<div className="vip">
						<h5>VIP Guests</h5>
						<p>{formatThousands(totalVipGuests + (add2020Stats ? totalVipGuests2020 : 0))}</p>
					</div>

					<div className="checked-in">
						<h5>Checked In</h5>
						<p>{formatThousands(checkedIn + (add2020Stats ? checkedIn2020 : 0))}</p>
					</div>
				</FlexRow>
			</div>
			{checkScope(user.role, 'write') && (
				<div className="extended-stats">
					{!!extendedStats && extendedStats.eventId === event.id ? (
						<>
							<FlexRow className={styles.stats}>
								<div className="revenue">
									<h5 data-tooltip="Ticket revenue based on all ticket sales volume (price X quantity)">Revenue</h5>
									<p>${formatThousands(totalRevenue + totalPromoRevenue + (add2020Stats ? totalRevenue2020 + totalPromoRevenue2020 : 0))}</p>
								</div>
								<div className="promo-revenue">
									<h5 data-tooltip="Ticket revenue based on promo ticket sales volume only (price X quantity)">Promo Revenue</h5>
									<p>${formatThousands(totalPromoRevenue + (add2020Stats ? totalPromoRevenue2020 : 0))}</p>
								</div>
								{event.status === 'active' && (
									<div className="revenue-today">
										<h5 data-tooltip="Ticket revenue today based on all ticket sales volume (price X quantity)">Revenue Today</h5>
										<p>${formatThousands(revenueToday ?? 0)}</p>
									</div>
								)}
								<div className="avg-revenue">
									<h5 data-tooltip="Average price paid per ticket (excludes comps, includes promos)">Avg. Ticket Revenue</h5>
									<p>
										$
										{(
											(totalRevenue + totalPromoRevenue + (add2020Stats ? totalRevenue2020 + totalPromoRevenue2020 : 0)) /
											(totalGuests + (add2020Stats ? totalGuests2020 : 0) - (totalCompedGuests + (add2020Stats ? totalCompedGuests2020 : 0)))
										).toFixed(2)}
									</p>
								</div>
							</FlexRow>
							<FlexRow className={styles.stats}>
								{salesTiers?.map(t => (
									<div className="tier-sales" key={t.name}>
										<h5>
											{t.name} - ${t.price}
										</h5>
										<p>{formatThousands(t.quantity)}</p>
									</div>
								))}
							</FlexRow>
						</>
					) : (
						<Loader />
					)}
				</div>
			)}
		</div>
	);
};

export default Dashboard;
