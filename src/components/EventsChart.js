import './EventsChart.less';

import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { format, set } from 'date-fns';
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
		lineTension: 0.3,
		fill: false,
		borderColor: 'rgb(73, 134, 210)',
		pointBorderColor: 'rgba(73, 134, 210, 0.5)',
		pointBackgroundColor: 'rgba(73, 134, 210, 0.5)'
	}]
});

const generateOpeningDayTicketsSeries = chartData => ({
	labels: chartData.openingDaySales.map(({ time }) => format(new Date(time), 'HH:mm')),
	datasets: [{
		data: chartData.openingDaySales.map(({ tickets }) => tickets),
		label: `${chartData.name}: Tickets Sold ${format(new Date(chartData.openingDaySales[0].time), 'MMM do, yyyy')}`,
		lineTension: 0.3,
		fill: false,
		borderColor: 'rgb(73, 134, 210)',
		pointBorderColor: 'rgba(73, 134, 210, 0.5)',
		pointBackgroundColor: 'rgba(73, 134, 210, 0.5)'
	}]
});

const generateAvgTicketsPerTransactionSeries = chartData => ({
	labels: chartData.dailySales.map(({ date }) => format(new Date(date), 'M/dd')),
	datasets: [{
		data: chartData.dailySales.map(({ tickets, transactions }) => Math.round((tickets/transactions)*100)/100), // two significant digits
		label: `${chartData.name}: Avg. Tickets Per Transaction`,
		lineTension: 0.3,
		fill: false,
		borderColor: 'rgb(184, 233, 134)',
		pointBorderColor: 'rgba(184, 233, 134, 0.5)',
		pointBackgroundColor: 'rgba(184, 233, 134, 0.5)'
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
		lineTension: 0.3,
		backgroundColor: 'rgba(73, 134, 210, 0.3)',
		borderColor: 'rgb(73, 134, 210)',
		pointBorderColor: 'rgba(73, 134, 210, 0.5)',
		pointBackgroundColor: 'rgba(73, 134, 210, 0.5)'
	}]
});

const generateCheckInsSeries = chartData => ({
	labels: chartData.checkIns.map(({ hour, minutes }) => format(set(new Date(0), {hours: hour, minutes}), 'HH:mm')),
	datasets: [{
		data: chartData.checkIns.map(({ checkedIn }) => checkedIn),
		label: `${chartData.name}: Check Ins`,
		lineTension: 0.3,
		fill: false,
		borderColor: 'rgb(73, 134, 210)',
		pointBorderColor: 'rgba(73, 134, 210, 0.5)',
		pointBackgroundColor: 'rgba(73, 134, 210, 0.5)'
	}]
});

const EventsChart = ({ chartData }) => {
	const [ graphType, setGraphType ] = useState('tickets');

	const data = useMemo(() => {
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
