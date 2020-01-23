import './Settings.less';

import React, { useState, useEffect } from 'react';
import apiClient from 'utils/apiClient';
import Toggle from 'components/Toggle';
import Loader from 'components/Loader';

const Settings = () => {
	const [ products, setProducts ] = useState([]),
		[ event, setEvent ] = useState(null);

	useEffect(() => {
		apiClient.get('/sites/mustachebash.com/settings')
			.then(({ events: siteEvents, products: siteProducts }) => {
				// This is not ideal, but works for this year
				setEvent(siteEvents[0]);
				setProducts(siteProducts.sort((a, b) => a.price > b.price ? -1 : 1));
			})
			.catch(e => console.error('Settings API Error', e));
	}, []);

	function updateProductStatus(id, status) {
		apiClient.patch(`/products/${id}`, {status})
			.then(product => setProducts([
				...products.filter(p => p.id !== product.id),
				product
			].sort((a, b) => a.price > b.price ? -1 : 1)))
			.catch(e => console.error('Products API Error', e));
	}

	function updateEvent(updates) {
		apiClient.patch(`/events/${event.id}`, updates)
			.then(setEvent)
			.catch(e => console.error('Events API Error', e));
	}

	if(!products.length || !event) return <Loader />;

	return (
		<div className="settings">
			<div className="flex-row">
				<section className="settings-group tickets">
					<h1>Tickets</h1>
					{products.map(p => (
						<div className="settings-item" key={p.id}>
							<h5>{p.name}</h5>
							<ul>
								<li><strong>Event:</strong> {event.name}</li>
								<li><strong>Price:</strong> ${p.price.toFixed(2)}</li>
							</ul>
							<div className="event-ticket">
								<label>Status</label>
								<div className="select-wrap">
									<select name={`ticketStatus-${p.id}`} defaultValue={p.status}  onChange={ev => updateProductStatus(p.id, ev.target.value)}>
										<option key={`option-${p.id}-active`} value="active">Active</option>
										<option key={`option-${p.id}-inactive`} value="inactive">Inactive</option>
										<option key={`option-${p.id}-archived`} value="archived">Archived</option>
									</select>
								</div>
							</div>
						</div>
					))}
				</section>

				<section className="settings-group">
					<h1>Event</h1>
					<div className="settings-item">
						<h5>{event.name}</h5>
						<div className="flex-row">
							<div className="event-ticket">
								<label>Current Ticket</label>
								<div className="select-wrap">
									<select name={`currentTicket-${event.id}`} defaultValue={event.currentTicket} onChange={ev => updateEvent({currentTicket: ev.target.value})}>
										<option key="option-none" value="">None</option>
										{products.map(p => {
											if(p.promo) return false;

											return <option key={`option-${p.id}`} disabled={p.status !== 'active'} value={p.id}>{p.name} - ${p.price.toFixed(2)}</option>;
										})}
									</select>
								</div>
							</div>
							<div className="event-sales-toggle">
								<label>Sales</label>
								<Toggle toggleState={event.salesOn} handleToggle={() => updateEvent({salesOn: !event.salesOn})} />
							</div>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
};

export default Settings;
