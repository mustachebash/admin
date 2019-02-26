import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchProducts } from 'products/productsDuck';
import { updateEvent } from 'events/eventsDuck';
import Toggle from 'components/Toggle';
import Loader from 'components/Loader';

const mapStateToProps = (state, ownProps) => ({
	events: state.data.events,
	products: state.data.products,
	selectedEvents: state.control.selectedEvents
});

export default
@connect(mapStateToProps, {fetchProducts, updateEvent})
class Settings extends Component {
	static propTypes = {
		events: PropTypes.array.isRequired,
		products: PropTypes.array.isRequired,
		selectedEvents: PropTypes.array.isRequired
	};

	componentDidMount() {
		this.props.fetchProducts();
	}

	render() {
		const { products, events, selectedEvents } = this.props,
			activeProducts = products.filter(p => selectedEvents.some(e => e === p.eventId)).sort((a, b) => a.price > b.price ? -1 : 1),
			activeEvents = events.filter(e => selectedEvents.some(s => s === e.id)).sort((a, b) => a.date > b.date ? 1 : -1);

		if(!products.length || !events.length) return <Loader />;

		return (
			<React.Fragment>
				<div className="flex-row">
					<section className="settings-group">
						<h1>Tickets</h1>
						{activeProducts.map(p => (
							<div className="settings-item" key={p.id}>
								<h5>{p.name}</h5>
								<ul>
									<li><strong>Event:</strong> {events.find(e => e.id === p.eventId).name}</li>
									<li><strong>Price:</strong> ${p.price.toFixed(2)}</li>
									{/* <li><strong>Status:</strong> {p.status}</li> */}
								</ul>
							</div>
						))}
					</section>

					<section className="settings-group">
						<h1>Events</h1>
						{activeEvents.map(e => (
							<div className="settings-item" key={e.id}>
								<h5>{e.name}</h5>
								<div className="flex-row">
									<div className="event-ticket">
										<label>Current Ticket</label>
										<div className="select-wrap">
											<select name={`currentTicket-${e.id}`} defaultValue={e.currentTicket} onChange={ev => this.props.updateEvent(e.id, {currentTicket: ev.target.value})}>
												{products.map(p => {
													if(p.eventId !== e.id) return false;

													return <option key={`option-${p.id}`} value={p.id}>{p.name} - ${p.price.toFixed(2)}</option>;
												})}
											</select>
										</div>
									</div>
									<div className="event-sales-toggle">
										<label>Sales</label>
										<Toggle toggleState={e.salesOn} handleToggle={() => this.props.updateEvent(e.id, {salesOn: !e.salesOn})} />
									</div>
								</div>
							</div>
						))}
					</section>
				</div>
			</React.Fragment>
		);
	}
}
