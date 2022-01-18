import './ProjectionChart.less';

import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LineElement, PointElement, LinearScale, Title, Tooltip } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import { formatThousands } from 'utils';

ChartJS.register(CategoryScale, LineElement, PointElement, LinearScale, Title, Tooltip, annotationPlugin);

const availableTypes = [
	{
		id: 'currentTier',
		name: 'Current Ticket Tier Potential Revenue'
	}
];

const generatePotentialRevenueSeries = ({ maxCapacity, currentAttendance, currentRevenue, currentTicketPrice }) => ({
	labels: [0, currentAttendance, maxCapacity],
	datasets: [{
		data: [0, currentRevenue, ((maxCapacity - currentAttendance) * currentTicketPrice) + currentRevenue],
		label: 'Revenue',
		segment: {
			borderDash: ctx => ctx.p0.parsed.x === currentAttendance ? [5, 3] : undefined
		},
		lineTension: 0,
		fill: false,
		borderColor: 'rgb(73, 234, 110)',
		pointBorderColor: 'rgba(184, 233, 134, 0.5)',
		pointBackgroundColor: 'rgba(184, 233, 134, 0.5)'
	}]
});

const ProjectionChart = ({ maxCapacity, currentAttendance, currentRevenue, budget, currentTicketPrice }) => {
	const [ graphType, setGraphType ] = useState('currentTier');

	const data = useMemo(() => {
		switch(graphType) {
			case 'currentTier':
				return generatePotentialRevenueSeries({maxCapacity, currentAttendance, currentRevenue, budget, currentTicketPrice});
		}
	}, [maxCapacity, currentAttendance, currentRevenue, budget, currentTicketPrice, graphType]);

	const breakEvenTotal = Math.ceil((budget - currentRevenue) / currentTicketPrice) + currentAttendance;

	return (
		<div className="projection-chart">
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
					options={{
						maintainAspectRatio: false,
						scales: {
							x: {
								type: 'linear'
							},
							y: {
								ticks: {
									callback: value => `$${Math.ceil(value/1000)}k`
								}
							}
						},
						plugins: {
							autocolors: false,
							annotation: {
								annotations: {
									budget: {
										label: {
											enabled: true,
											content: `Budget $${formatThousands(budget)}`,
											backgroundColor: 'rgba(73, 134, 210, 0)'
										},
										type: 'line',
										yMin: budget,
										yMax: budget,
										borderDash: [6, 3],
										borderColor: 'rgb(233, 134, 110)',
										borderWidth: 2
									},
									breakEven: {
										type: 'point',
										yValue: budget,
										xValue: breakEvenTotal,
										borderColor: 'rgb(73, 134, 210)',
										backgroundColor: 'rgb(73, 134, 210)',
										radius: 3
									},
									breakEvenLabel: {
										content: ['Break Even', `${formatThousands(breakEvenTotal)}`],
										color: 'white',
										type: 'label',
										position: 'start',
										yValue: budget,
										xValue: breakEvenTotal
									}
								}
							}
						}
					}}
				/>
			</div>
		</div>
	);
};

ProjectionChart.propTypes = {
	maxCapacity: PropTypes.number.isRequired,
	currentAttendance: PropTypes.number.isRequired,
	currentRevenue: PropTypes.number.isRequired,
	budget: PropTypes.number.isRequired,
	currentTicketPrice: PropTypes.number.isRequired
};

export default ProjectionChart;
