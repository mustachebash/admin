import './EventsChart.less';

import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { Line } from 'react-chartjs-2';

const availableTypes = [
	{
		id: 'opening',
		name: 'Opening Day Ticket Sales'
	},
	{
		id: 'tickets',
		name: 'Daily Ticket Sales'
	},
	{
		id: 'ticketsAvg',
		name: 'Daily Avg. Tickets/Transaction'
	},
	{
		id: 'ticketsAcc',
		name: 'Acc. Ticket Sales'
	},
	{
		id: 'checkIns',
		name: 'Check Ins'
	}
];

const generateDailyTicketsSeries = chartData => ({
	labels: chartData.dailySales.map(({ date }) => format(new Date(date), 'M/dd')),
	datasets: [{
		data: chartData.dailySales.map(({ tickets }) => tickets),
		label: `${chartData.name}: Daily Tickets Sold`,
		lineTension: 0.3
	}]
});

const generateOpeningDayTicketsSeries = chartData => ({
	labels: chartData.openingDaySales.map(({ time }) => format(new Date(time), 'HH:mm')),
	datasets: [{
		data: chartData.openingDaySales.map(({ tickets }) => tickets),
		label: `${chartData.name}: Tickets Sold ${format(new Date(chartData.openingDaySales[0].time), 'MMM do, yyyy')}`,
		lineTension: 0.3
	}]
});

const generateAvgTicketsPerTransactionSeries = chartData => ({
	labels: chartData.dailySales.map(({ date }) => format(new Date(date), 'M/dd')),
	datasets: [{
		data: chartData.dailySales.map(({ tickets, transactions }) => Math.round((tickets/transactions)*100)/100), // two significant digits
		label: `${chartData.name}: Avg. Tickets Per Transaction`,
		lineTension: 0.3
	}]
});

const generateTotalTicketsArea = chartData => ({
	labels: chartData.dailySales.map(({ date }) => format(new Date(date), 'M/dd')),
	datasets: [{
		data: chartData.dailySales.reduce((acc, day) => {
			acc.total += day.tickets;
			acc.set.push(acc.total);

			return acc;
		}, {set: [], total: 0}).set,
		label: `${chartData.name}: Acc. Tickets Sold`,
		lineTension: 0.3
	}]
});

const generateCheckInsSeries = chartData => ({
	data: chartData.checkIns.map(half => ([Date.UTC(1972, 2, 24, half.hour + 7, half.minutes), half.checkedIn])),
	pointStart: Date.UTC(1972, 2, 24, chartData.checkIns[0].hour + 7, 0),
	pointInterval: 1000 * 60 * 30,
	yAxis: 1,
	visible: (new Date(chartData.date)) > Date.now() - (1.5 * 365 * 24 * 60 * 60 * 1000),
	label: `${chartData.name}: Check Ins`,
	tooltip: {
		xDateFormat: '%H:%M',
		split: true
	}
});

const EventsChart = ({ chartData }) => {
	// Random fun colors!
	const colors = ['#6e25b7', '#57bf93', '#4886d2', '#b8e986', '#129376', '#1a3aa0', '#c146e5', '#dee74c'];

	for (let i = colors.length; i; i--) {
		const j = Math.floor(Math.random() * i);
		[colors[i - 1], colors[j]] = [colors[j], colors[i - 1]];
	}

	const [ graphType, setGraphType ] = useState('tickets');

	let seriesFn = () => {};
	switch(graphType) {
		case 'opening':
			seriesFn = generateOpeningDayTicketsSeries;
			break;

		case 'tickets':
			seriesFn = generateDailyTicketsSeries;
			break;

		case 'ticketsAvg':
			seriesFn = generateAvgTicketsPerTransactionSeries;
			break;

		case 'checkIns':
			seriesFn = generateCheckInsSeries;
			break;

		case 'ticketsAcc':
			seriesFn = generateTotalTicketsArea;
			break;
	}

	const data = useMemo(() => {
		console.log('MEMO RUN', Date.now());
		switch(graphType) {
			case 'opening':
				return generateOpeningDayTicketsSeries(chartData);

			case 'tickets':
				return generateDailyTicketsSeries(chartData);

			case 'ticketsAvg':
				return generateAvgTicketsPerTransactionSeries(chartData);

			case 'checkIns':
				return generateCheckInsSeries(chartData);

			case 'ticketsAcc':
				return generateTotalTicketsArea(chartData);
		}
	}, [chartData, graphType]);

	return (
		<div className="events-chart">
			<div className="select-wrap chart-type-selector">
				<select defaultValue={graphType} onChange={e => setGraphType(e.target.value)}>
					{availableTypes.map(type => (
						<option key={type.id} value={type.id}>{type.name}</option>
					))}
				</select>
			</div>
			<div className="chart-wrapper">
				<Line
					data={data}
					options={{maintainAspectRatio: false}}
				/>
			</div>
		</div>
	);
};

EventsChart.propTypes = {
	chartData: PropTypes.object.isRequired
};

export default EventsChart;
