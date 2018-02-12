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
		name: 'Ticket Sales'
	},
	{
		id: 'guests',
		name: 'Guests'
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
		return this.props.chartData.map(event => ({
			data: event.transactions.map(day => ([(new Date(day[0])).setUTCFullYear(1972), day[1].amount])),
			pointStart: Date.parse(event.transactions[0][0]),
			pointInterval: 1000 * 60 * 60,
			yAxis: 0,
			name: `${event.name}: Revenue`,
			tooltip: {
				valuePrefix: '$'
			}
		}));
	}

	generateTicketsSeries(){
		return this.props.chartData.map(event => ({
			data: event.transactions.map(day => ([(new Date(day[0])).setUTCFullYear(1972), day[1].quantity])),
			pointStart: Date.parse(event.transactions[0][0]),
			pointInterval: 1000 * 60 * 60,
			yAxis: 1,
			name: `${event.name}: Tickets Sold`
		}));
	}

	generateGuestsSeries(){
		return this.props.chartData.map(event => ({
			data: event.guests.map(day => ([(new Date(day[0])).setUTCFullYear(1972), day[1]])),
			yAxis: 1,
			name: `${event.name}: Guests Added`
		}));
	}

	render() {
		const series = [];
		switch(this.state.graphType) {
			case 'revenue':
				series.push(...this.generateRevenueSeries());
				break;

			case 'tickets':
				series.push(...this.generateTicketsSeries());
				break;

			case 'guests':
				series.push(...this.generateGuestsSeries());
				break;
		}

		//config object passed into HighCharts instance
		const config = {
			title: {
				text: null
			},
			chart: {
				zoomType: 'x',
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
