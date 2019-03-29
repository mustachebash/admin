import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactHighcharts from 'react-highcharts';

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

export default class EventsChart extends Component {
	constructor(props) {
		super(props);

		// Random fun colors!
		const colors = ['#6e25b7', '#57bf93', '#4886d2', '#b8e986', '#129376', '#1a3aa0', '#c146e5', '#dee74c'];

		for (let i = colors.length; i; i--) {
			const j = Math.floor(Math.random() * i);
			[colors[i - 1], colors[j]] = [colors[j], colors[i - 1]];
		}

		ReactHighcharts.Highcharts.setOptions({
			lang: {
				thousandsSep: ','
			},
			time: {
				timezoneOffset: 6 * 60
			}
		});

		this.state = {
			graphType: 'tickets',
			colors
		};

		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(e){
		this.setState({graphType: e.target.value});
	}

	shouldComponentUpdate(nextProps, nextState){
		if(nextState.graphType !== this.state.graphType) {
			return true;
		} else {
			return nextProps.chartData !== this.props.chartData;
		}
	}

	generateRevenueSeries(){
		return this.props.chartData.filter(e => e.transactions.length).map(event => ({
			data: event.transactions.map(day => ([(new Date(day[0])).setUTCFullYear(1972), day[1].amount])),
			pointStart: Date.parse(event.transactions[0][0]),
			pointInterval: 1000 * 60 * 60,
			yAxis: 0,
			name: `${event.name}: Revenue`,
			visible: (new Date(event.date)) > Date.now() - (1.5 * 365 * 24 * 60 * 60 * 1000),
			tooltip: {
				valuePrefix: '$'
			}
		}));
	}

	generateTicketsSeries(){
		return this.props.chartData.filter(e => e.transactions.length).map(event => ({
			data: event.transactions.map(day => ([(new Date(day[0])).setUTCFullYear(1972), day[1].quantity])),
			pointStart: Date.parse(event.transactions[0][0]),
			pointInterval: 1000 * 60 * 60,
			yAxis: 1,
			visible: (new Date(event.date)) > Date.now() - (1.5 * 365 * 24 * 60 * 60 * 1000),
			name: `${event.name}: Tickets Sold`
		}));
	}

	generateTotalTicketsArea(){
		return this.props.chartData.filter(e => e.transactions.length).map(event => ({
			data: event.transactions.reduce((acc, day) => {
				acc.total += day[1].quantity;
				acc.set.push([(new Date(day[0])).setUTCFullYear(1972), acc.total]);

				return acc;
			}, {set: [], total: 0}).set,
			pointStart: Date.parse(event.transactions[0][0]),
			pointInterval: 1000 * 60 * 60,
			yAxis: 1,
			visible: (new Date(event.date)) > Date.now() - (1.5 * 365 * 24 * 60 * 60 * 1000),
			name: `${event.name}: Tickets Sold`
		}));
	}

	generateCheckInsSeries(){
		return this.props.chartData.filter(e => e.checkIns.length).map(event => ({
			data: event.checkIns.map(half => ([Date.UTC(1972, 2, 24, half.hour + 7, half.minutes), half.checkedIn])),
			pointStart: Date.UTC(1972, 2, 24, event.checkIns[0].hour + 7, 0),
			pointInterval: 1000 * 60 * 30,
			yAxis: 1,
			visible: (new Date(event.date)) > Date.now() - (1.5 * 365 * 24 * 60 * 60 * 1000),
			name: `${event.name}: Check Ins`,
			tooltip: {
				xDateFormat: '%H:%M',
				split: true
			}
		}));
	}

	render() {
		const series = [];
		let chartType = 'line';
		switch(this.state.graphType) {
			case 'revenue':
				series.push(...this.generateRevenueSeries());
				break;

			case 'tickets':
				series.push(...this.generateTicketsSeries());
				break;

			case 'checkIns':
				series.push(...this.generateCheckInsSeries());
				break;

			case 'ticketsTotal':
				series.push(...this.generateTotalTicketsArea());
				chartType = 'area';
				break;
		}

		//config object passed into HighCharts instance
		const config = {
			title: {
				text: null
			},
			chart: {
				zoomType: 'x',
				type: chartType,
				resetZoomButton: {
					theme: {
						r: 3
					}
				}
			},
			legend: {
				align: 'left'
			},
			colors: this.state.colors,
			xAxis: {
				type: 'datetime',
				labels: {
					rotation: -45
				}
			},
			credits: {
				enabled: false
			},
			tooltip: {
				xDateFormat: '%b %e',
				split: true
			},
			yAxis: [
				{
					labels: {
						format: '${value}',
						style: {
							color: this.state.colors[0]
						}
					},
					title: {
						text: null
					},
					opposite: true
				},
				{
					labels: {
						format: '{value}',
						style: {
							color: this.state.colors[2]
						}
					},
					title: {
						text: null
					}
				}
			],
			plotOptions: {
				series: {
					lineWidth: 3,
					marker: {
						enabled: false
					}
				}
			},
			series
		};


		return (
			<div className="events-chart">
				<div className="select-wrap chart-type-selector">
					<select defaultValue={this.state.graphType} onChange={this.handleChange}>
						{availableTypes.map(type => (
							<option key={type.id} value={type.id}>{type.name}</option>
						))}
					</select>
				</div>
				<ReactHighcharts config={config} />
			</div>
		);
	}
}

EventsChart.propTypes = {
	chartData: PropTypes.array.isRequired
};
