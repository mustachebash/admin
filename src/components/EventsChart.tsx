// TODO: this file desparately needs consolidation
// - changes here were only to get the minimal charts working with disparate chart types returned
import styles from './EventsChart.module.css';

import { useState, useMemo, memo, useContext, useEffect } from 'react';
import EventContext from '@/EventContext';
import { format } from 'date-fns';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LineElement, PointElement, LinearScale, Title, Tooltip } from 'chart.js';
import apiClient from '@/utils/apiClient';
import Loader from '@/components/Loader';

ChartJS.register(CategoryScale, LineElement, PointElement, LinearScale, Title, Tooltip);

interface DailyTicket {
	date: string;
	tickets: number;
}

interface OpeningSalesTick {
	minuteCreated: string;
	tickets: number;
}

interface CheckInTick {
	minuteCheckedIn: string;
	checkins: number;
}

const availableTypes = [
	{
		id: 'openingSales',
		name: 'Opening Day Tickets'
	},
	{
		id: 'tickets',
		name: 'Daily Tickets'
	},
	{
		id: 'ticketsAcc',
		name: 'Acc. Tickets'
	},
	{
		id: 'checkIns',
		name: 'Check Ins'
	}
];

const generateDailyTicketsSeries = (chartData: DailyTicket[], openingSales: string | undefined) => {
	// Skip the opening day of sales (which blows the scale off)
	let dailyChartData;
	if (openingSales) {
		const openingIndex = chartData.findIndex(({ date }) => new Date(date).setUTCHours(0) === new Date(openingSales).setUTCHours(0));
		dailyChartData = chartData.slice(openingIndex + 1);
	} else {
		dailyChartData = chartData.slice(1);
	}

	return {
		// Set this 8 hours in the future since the ISO strings come back at 00:00 UTC
		// This avoids using a timezone package since we can assume most dashboard viewing is in PT
		labels: dailyChartData.map(({ date }) => format(new Date(date).setUTCHours(8), 'M/dd')),
		datasets: [
			{
				data: dailyChartData.map(({ tickets }) => tickets),
				label: 'Daily Tickets Sold',
				lineTension: 0.3,
				fill: false,
				borderColor: 'rgb(73, 134, 210)',
				pointBorderColor: 'rgba(73, 134, 210, 0.5)',
				pointBackgroundColor: 'rgba(73, 134, 210, 0.5)'
			}
		]
	};
};

const generateTotalTicketsArea = (chartData: DailyTicket[]) => ({
	// Set this 8 hours in the future since the ISO strings come back at 00:00 UTC
	// This avoids using a timezone package since we can assume most dashboard viewing is in PT
	labels: chartData.map(({ date }) => format(new Date(date).setUTCHours(8), 'M/dd')),
	datasets: [
		{
			data: chartData.reduce(
				(acc: { set: number[]; total: number }, day) => {
					acc.total += day.tickets;
					acc.set.push(acc.total);

					return acc;
				},
				{ set: [], total: 0 }
			).set,
			label: 'Acc. Tickets Sold',
			lineTension: 0.3,
			backgroundColor: 'rgba(73, 134, 210, 0.3)',
			borderColor: 'rgb(73, 134, 210)',
			pointBorderColor: 'rgba(73, 134, 210, 0.5)',
			pointBackgroundColor: 'rgba(73, 134, 210, 0.5)'
		}
	]
});

const generateOpeningDayTicketsSeries = (chartData: OpeningSalesTick[]) => ({
	labels: chartData.map(({ minuteCreated }) => format(new Date(minuteCreated), 'HH:mm')),
	datasets: [
		{
			data: chartData.map(({ tickets }) => tickets),
			label: 'Tickets Sold',
			lineTension: 0.3,
			fill: false,
			borderColor: 'rgb(73, 134, 210)',
			pointBorderColor: 'rgba(73, 134, 210, 0.5)',
			pointBackgroundColor: 'rgba(73, 134, 210, 0.5)'
		}
	]
});

const generateCheckInsSeries = (chartData: CheckInTick[]) => ({
	labels: chartData.map(({ minuteCheckedIn }) => format(new Date(minuteCheckedIn), 'HH:mm')),
	datasets: [
		{
			data: chartData.map(({ checkins }) => checkins),
			label: 'Check Ins',
			lineTension: 0.3,
			fill: false,
			borderColor: 'rgb(73, 134, 210)',
			pointBorderColor: 'rgba(73, 134, 210, 0.5)',
			pointBackgroundColor: 'rgba(73, 134, 210, 0.5)'
		}
	]
});

const EventsChart = () => {
	const [graphType, setGraphType] = useState('tickets'),
		[ticketsChartData, setTicketsChartData] = useState<DailyTicket[] | null>(null),
		[openingSalesChartData, setOpeningSalesChartData] = useState<OpeningSalesTick[] | null>(null),
		[checkInsChartData, setCheckInsChartData] = useState<CheckInTick[] | null>(null),
		{ event } = useContext(EventContext);

	useEffect(() => {
		if (event?.id) {
			const type = graphType === 'ticketsAcc' ? 'tickets' : graphType;
			apiClient
				.get<DailyTicket[] | OpeningSalesTick[] | CheckInTick[]>(`/events/${event.id}/chart`, { type })
				.then(data => {
					switch (type) {
						case 'openingSales':
							return setOpeningSalesChartData(data as OpeningSalesTick[]);

						case 'tickets':
							return setTicketsChartData(data as DailyTicket[]);

						case 'checkIns':
							return setCheckInsChartData(data as CheckInTick[]);
					}
				})
				.catch(e => console.error('Chart Data API Error', e));
		}
	}, [event?.id, graphType]);

	const data = useMemo(() => {
		switch (graphType) {
			case 'openingSales':
				return openingSalesChartData && generateOpeningDayTicketsSeries(openingSalesChartData);

			case 'tickets':
				return ticketsChartData && generateDailyTicketsSeries(ticketsChartData, event?.openingSales as string | undefined);

			case 'ticketsAcc':
				return ticketsChartData && generateTotalTicketsArea(ticketsChartData);

			case 'checkIns':
				return checkInsChartData && generateCheckInsSeries(checkInsChartData);
		}
	}, [ticketsChartData, openingSalesChartData, checkInsChartData, graphType, event]);

	if (
		(graphType === 'openingSales' && !openingSalesChartData) ||
		(graphType === 'tickets' && !ticketsChartData) ||
		(graphType === 'checkIns' && !checkInsChartData) ||
		(graphType === 'ticketsAcc' && !ticketsChartData)
	)
		return <Loader />;

	// Find the opening day of sales
	let openingIndex = 0;
	if (event?.openingSales) {
		openingIndex = ticketsChartData?.findIndex(({ date }) => new Date(date).setUTCHours(0) === new Date(event?.openingSales as string).setUTCHours(0)) ?? 0;
	}

	return (
		<div className={styles.eventsChart}>
			<div className="select-wrap chart-type-selector">
				<select defaultValue={graphType} onChange={e => setGraphType(e.target.value)}>
					{availableTypes.map(type => (
						<option key={type.id} value={type.id}>
							{type.name}
						</option>
					))}
				</select>
			</div>
			{graphType === 'tickets' && <small>(excludes {ticketsChartData?.[openingIndex]?.tickets} from opening day)</small>}
			<div className={styles.chartWrapper}>
				<Line data={data!} options={{ maintainAspectRatio: false }} />
			</div>
		</div>
	);
};

export default memo(EventsChart);
