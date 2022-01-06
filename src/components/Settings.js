import './Settings.less';

import React, { useState, useEffect } from 'react';
import apiClient from 'utils/apiClient';
import Toggle from 'components/Toggle';
import Loader from 'components/Loader';

const Settings = () => {
	const [ selectedEventId, setSelectedEventId ] = useState(''),
		[ siteSettings, setSiteSettings ] = useState(null),
		[ products, setProducts ] = useState([]),
		[ events, setEvents ] = useState([]);

	useEffect(() => {
		apiClient.get('/sites/mustachebash.com/privileged-settings')
			.then(({ events: siteEvents, products: siteProducts, settings: privilegedSettings }) => {
				// This is not ideal, but works for this year
				setSelectedEventId(siteEvents[1].id);
				setSiteSettings(privilegedSettings);
				setEvents(siteEvents);
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

	function updateEvent(id, updates) {
		apiClient.patch(`/events/${id}`, updates)
			.then(updatedEvent => setEvents([...events.filter(ev => ev.id !== id), updatedEvent]))
			.catch(e => console.error('Events API Error', e));
	}

	function updateSiteSettings(updates) {
		apiClient.patch('/sites/mustachebash.com/settings', updates)
			.then(updatedSite => setSiteSettings(updatedSite.settings))
			.catch(e => console.error('Settings API Error', e));
	}

	const selectedEvent = events.find(ev => ev.id === selectedEventId);

	if(!products.length || !events.length) return <Loader />;

	return (
		<div className="settings">
			<div className="event-selector">
				<div className="select-wrap">
					<select name="guests-events" value={selectedEvent?.id} disabled={!selectedEvent} onChange={e => setSelectedEventId(e.currentTarget.value)}>
						{events.length
							? events.map(ev => <option value={ev.id} key={ev.id}>{ev.name}</option>)
							: <option disabled value="">Loading...</option>
						}
					</select>
				</div>
			</div>
			<div className="flex-row">
				<section className="settings-group tickets">
					<h1>Tickets</h1>
					{products.filter(p => p.eventId === selectedEventId).map(p => (
						<div className="settings-item" key={p.id}>
							<h5>{p.name}</h5>
							<ul>
								<li><strong>Event:</strong> {selectedEvent.name}</li>
								<li><strong>Price:</strong> ${p.price.toFixed(2)}</li>
							</ul>
							<div className="event-ticket">
								<label>Status</label>
								<div className="select-wrap">
									<select name={`ticketStatus-${p.id}`} defaultValue={p.status} onChange={ev => updateProductStatus(p.id, ev.target.value)}>
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
					<h1>Site</h1>
					<div className="settings-item">
						<h5>mustachebash.com</h5>
						<div className="event-sales-toggle">
							<label>Apple Pay Enabled</label>
							<Toggle toggleState={siteSettings.enableApplePay} handleToggle={() => updateSiteSettings({enableApplePay: !siteSettings.enableApplePay})} />
						</div>
					</div>

					<h1>Event</h1>
					<div className="settings-item">
						<h5>{selectedEvent.name}</h5>
						<div className="flex-row">
							<div className="event-ticket">
								<label>Current Ticket</label>
								<div className="select-wrap" key={`ticket-select-${selectedEvent.id}`}>
									<select name={`currentTicket-${selectedEvent.id}`} defaultValue={selectedEvent.currentTicket} onChange={ev => updateEvent(selectedEventId, {currentTicket: ev.target.value})}>
										<option key="option-none" value="">None</option>
										{products.filter(p => p.eventId === selectedEventId).map(p => {
											if(p.promo) return false;

											return <option key={`option-${p.id}`} disabled={p.status !== 'active'} value={p.id}>{p.name} - ${p.price.toFixed(2)}</option>;
										})}
									</select>
								</div>
							</div>
							<div className="event-sales-toggle">
								<label>Sales</label>
								<Toggle toggleState={selectedEvent.salesOn} handleToggle={() => updateEvent(selectedEventId, {salesOn: !selectedEvent.salesOn})} />
							</div>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
};

export default Settings;
