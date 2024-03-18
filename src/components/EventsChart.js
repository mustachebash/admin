// TODO: this file desparately needs consolidation
// - changes here were only to get the minimal charts working with disparate chart types returned
import './EventsChart.less';

import React, { useState, useMemo, memo, useContext, useEffect } from 'react';
import EventContext from 'EventContext';
import { format, set } from 'date-fns';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LineElement, PointElement, LinearScale, Title, Tooltip } from 'chart.js';
import apiClient from 'utils/apiClient';
import Loader from 'components/Loader';

ChartJS.register(CategoryScale, LineElement, PointElement, LinearScale, Title, Tooltip);

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

const generateDailyTicketsSeries = chartData => ({
	// Set this 8 hours in the future since the ISO strings come back at 00:00 UTC
	// This avoids using a timezone package since we can assume most dashboard viewing is in PT
	// Also, skip the opening day of sales (which blows the scale off)
	labels: chartData.slice(1).map(({ date }) => format((new Date(date)).setUTCHours(8), 'M/dd')),
	datasets: [{
		data: chartData.slice(1).map(({ tickets }) => tickets),
		label: 'Daily Tickets Sold',
		lineTension: 0.3,
		fill: false,
		borderColor: 'rgb(73, 134, 210)',
		pointBorderColor: 'rgba(73, 134, 210, 0.5)',
		pointBackgroundColor: 'rgba(73, 134, 210, 0.5)'
	}]
});

const generateTotalTicketsArea = chartData => ({
	// Set this 8 hours in the future since the ISO strings come back at 00:00 UTC
	// This avoids using a timezone package since we can assume most dashboard viewing is in PT
	labels: chartData.map(({ date }) => format((new Date(date)).setUTCHours(8), 'M/dd')),
	datasets: [{
		data: chartData.reduce((acc, day) => {
			acc.total += day.tickets;
			acc.set.push(acc.total);

			return acc;
		}, {set: [], total: 0}).set,
		label: 'Acc. Tickets Sold',
		lineTension: 0.3,
		backgroundColor: 'rgba(73, 134, 210, 0.3)',
		borderColor: 'rgb(73, 134, 210)',
		pointBorderColor: 'rgba(73, 134, 210, 0.5)',
		pointBackgroundColor: 'rgba(73, 134, 210, 0.5)'
	}]
});

const generateOpeningDayTicketsSeries = chartData => ({
	labels: chartData.map(({ minuteCreated }) => format(new Date(minuteCreated), 'HH:mm')),
	datasets: [{
		data: chartData.map(({ tickets }) => tickets),
		label: 'Tickets Sold',
		lineTension: 0.3,
		fill: false,
		borderColor: 'rgb(73, 134, 210)',
		pointBorderColor: 'rgba(73, 134, 210, 0.5)',
		pointBackgroundColor: 'rgba(73, 134, 210, 0.5)'
	}]
});

const generateCheckInsSeries = chartData => ({
	labels: chartData.map(({ minuteCheckedIn }) => format(new Date(minuteCheckedIn), 'HH:mm')),
	datasets: [{
		data: chartData.map(({ checkins }) => checkins),
		label: 'Check Ins',
		lineTension: 0.3,
		fill: false,
		borderColor: 'rgb(73, 134, 210)',
		pointBorderColor: 'rgba(73, 134, 210, 0.5)',
		pointBackgroundColor: 'rgba(73, 134, 210, 0.5)'
	}]
});

const EventsChart = () => {
	const [ graphType, setGraphType ] = useState('tickets'),
		[ ticketsChartData, setTicketsChartData ] = useState(null),
		[ openingSalesChartData, setOpeningSalesChartData ] = useState(null),
		[ checkInsChartData, setCheckInsChartData ] = useState(null),
		{ event } = useContext(EventContext);

	useEffect(() => {
		if(event?.id) {
			const type = graphType === 'ticketsAcc' ? 'tickets' : graphType;
			apiClient.get(`/events/${event.id}/chart`, {type})
				.then(data => {
					switch(type) {
						case 'openingSales':
							return setOpeningSalesChartData(data);

						case 'tickets':
							return setTicketsChartData(data);

						case 'checkIns':
							return setCheckInsChartData(data);
					}
				})
				.catch(e => console.error('Chart Data API Error', e));
		}
	}, [event.id, graphType]);

	const data = useMemo(() => {
		switch(graphType) {
			case 'openingSales':
				return openingSalesChartData && generateOpeningDayTicketsSeries(openingSalesChartData);

			case 'tickets':
				return ticketsChartData && generateDailyTicketsSeries(ticketsChartData);

			case 'ticketsAcc':
				return ticketsChartData && generateTotalTicketsArea(ticketsChartData);

			case 'checkIns':
				return checkInsChartData && generateCheckInsSeries(checkInsChartData);
		}
	}, [ticketsChartData, openingSalesChartData, checkInsChartData, graphType]);

	if(
		graphType === 'openingSales' && !openingSalesChartData ||
		graphType === 'tickets' && !ticketsChartData ||
		graphType === 'checkIns' && !checkInsChartData ||
		graphType === 'ticketsAcc' && !ticketsChartData
	) return <Loader />;

	return (
		<div className="events-chart">
			<div className="select-wrap chart-type-selector">
				<select defaultValue={graphType} onChange={e => setGraphType(e.target.value)}>
					{availableTypes.map(type => (
						<option key={type.id} value={type.id}>{type.name}</option>
					))}
				</select>
			</div>
			{graphType === 'tickets' && <small>(excludes {ticketsChartData[0].tickets} from opening day)</small>}
			<div className="chart-wrapper">
				<Line
					data={data}
					options={{maintainAspectRatio: false}}
				/>
			</div>
		</div>
	);
};

export default memo(EventsChart);
