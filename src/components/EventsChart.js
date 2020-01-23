import './EventsChart.less';

import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Chart } from 'react-charts';

const availableTypes = [
	{
		id: 'revenue',
		name: 'Revenue'
	},
	{
		id: 'tickets',
		name: 'Daily Ticket Sales'
	},
	{
		id: 'ticketsTotal',
		name: 'Acc. Ticket Sales'
	},
	{
		id: 'checkIns',
		name: 'Check Ins'
	}
];

const EventsChart = ({ chartData }) => {
	// Random fun colors!
	const colors = ['#6e25b7', '#57bf93', '#4886d2', '#b8e986', '#129376', '#1a3aa0', '#c146e5', '#dee74c'];

	for (let i = colors.length; i; i--) {
		const j = Math.floor(Math.random() * i);
		[colors[i - 1], colors[j]] = [colors[j], colors[i - 1]];
	}

	const [ graphType, setGraphType ] = useState('tickets');

	const generateRevenueSeries = () => ({
		data: chartData.transactions.map(day => ([(new Date(day[0])).setUTCFullYear(1972), day[1].amount])),
		pointStart: Date.parse(chartData.transactions[0][0]),
		pointInterval: 1000 * 60 * 60,
		yAxis: 0,
		label: `${chartData.name}: Revenue`,
		visible: (new Date(chartData.date)) > Date.now() - (1.5 * 365 * 24 * 60 * 60 * 1000),
		tooltip: {
			valuePrefix: '$'
		}
	});

	const generateTicketsSeries = () => ({
		data: chartData.transactions.map(([day, { quantity }]) => ([Date.parse(day), quantity])),
		label: `${chartData.name}: Tickets Sold`,
		curve: 0
	});

	const generateTotalTicketsArea = () => ({
		data: chartData.transactions.reduce((acc, day) => {
			acc.total += day[1].quantity;
			acc.set.push([(new Date(day[0])).setUTCFullYear(1972), acc.total]);

			return acc;
		}, {set: [], total: 0}).set,
		pointStart: Date.parse(chartData.transactions[0][0]),
		pointInterval: 1000 * 60 * 60,
		yAxis: 1,
		visible: (new Date(chartData.date)) > Date.now() - (1.5 * 365 * 24 * 60 * 60 * 1000),
		label: `${chartData.name}: Tickets Sold`
	});

	const generateCheckInsSeries = () => ({
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

	// const series = [];
	// let chartType = 'line';
	// switch(graphType) {
	// 	case 'revenue':
	// 		series.push(...this.generateRevenueSeries());
	// 		break;
	//
	// 	case 'tickets':
	// 		series.push(...this.generateTicketsSeries());
	// 		break;
	//
	// 	case 'checkIns':
	// 		series.push(...this.generateCheckInsSeries());
	// 		break;
	//
	// 	case 'ticketsTotal':
	// 		series.push(...this.generateTotalTicketsArea());
	// 		chartType = 'area';
	// 		break;
	// }
	const data = useMemo(() => [generateTicketsSeries()], [chartData]),
		axes = useMemo(() => [
			{primary: true, type: 'time', position: 'bottom'},
			{type: 'linear', position: 'left'}
		], []);

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
				<Chart data={data} axes={axes} />
			</div>
		</div>
	);
};

EventsChart.propTypes = {
	chartData: PropTypes.object.isRequired
};

export default EventsChart;
