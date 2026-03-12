import styles from './Settings.module.css';

import { useState, useEffect, useContext } from 'react';
import FlexRow from './FlexRow';
import apiClient from '@/utils/apiClient';
import EventContext from '@/EventContext';
import Toggle from '@/components/Toggle';
import Loader from '@/components/Loader';
import EventSelector from '@/components/EventSelector';

interface Product {
	id: string;
	name: string;
	price: number;
	status: string;
	maxQuantity: number | null;
	promo?: boolean;
	eventId?: string;
	[key: string]: unknown;
}

const Settings = () => {
	const [products, setProducts] = useState<Product[]>([]);

	const { event } = useContext(EventContext);

	useEffect(() => {
		if (event) {
			setProducts([]); // Clear stale products to show loader
			apiClient
				.get<Product[]>('/products', { eventId: event.id })
				.then(eventProducts => {
					setProducts(eventProducts.sort((a, b) => (a.price > b.price ? -1 : 1)));
				})
				.catch(e => console.error('Products API Error', e));
		}
	}, [event?.id]);

	function updateProductStatus(id: string, status: string) {
		apiClient
			.patch<Product>(`/products/${id}`, { status })
			.then(product => setProducts([...products.filter(p => p.id !== product.id), product].sort((a, b) => (a.price > b.price ? -1 : 1))))
			.catch(e => console.error('Products API Error', e));
	}

	function updateEvent(id: string, updates: Record<string, unknown>) {
		apiClient
			.patch(`/events/${id}`, updates)
			// TODO: refresh events from context
			// .then(updatedEvent => setEvents([...events.filter(ev => ev.id !== id), updatedEvent]))
			.catch(e => console.error('Events API Error', e));
	}

	if (!products.length || !event) return <Loader />;

	const eventMeta = event.meta as Record<string, unknown> | undefined;

	return (
		<div className="settings">
			<FlexRow>
				<section className={`${styles.settingsGroup} ${styles.tickets}`}>
					<h1>Tickets</h1>
					{products.map(p => (
						<div className={styles.settingsItem} key={p.id}>
							<h5>
								{p.name} {p.maxQuantity !== null ? `(max qty ${p.maxQuantity})` : ''}
							</h5>
							<ul>
								<li>
									<strong>Event:</strong> {event.name}
								</li>
								<li>
									<strong>Price:</strong> ${p.price.toFixed(2)}
								</li>
							</ul>
							<div className={styles.eventTicket}>
								<label>Status</label>
								<div className={styles.selectWrap}>
									<select name={`ticketStatus-${p.id}`} defaultValue={p.status} onChange={ev => updateProductStatus(p.id, ev.target.value)}>
										<option key={`option-${p.id}-active`} value="active">
											Active
										</option>
										<option key={`option-${p.id}-inactive`} value="inactive">
											Inactive
										</option>
										<option key={`option-${p.id}-archived`} value="archived">
											Archived
										</option>
									</select>
								</div>
							</div>
						</div>
					))}
				</section>

				<section className={styles.settingsGroup}>
					<h1>Event</h1>
					<div className={styles.settingsItem}>
						<EventSelector />
						<FlexRow>
							<div className={styles.eventTicket}>
								<label>Current Ticket</label>
								<div className={styles.selectWrap}>
									<select
										key={`ticket-select-${event.id}`}
										name={`currentTicket-${event.id}`}
										defaultValue={eventMeta?.currentTicket as string}
										onChange={ev => updateEvent(event.id, { meta: { ...eventMeta, currentTicket: ev.target.value } })}
									>
										<option key="option-none" value="">
											None
										</option>
										{products.map(p => {
											if (p.promo) return false;

											return (
												<option key={`option-${p.id}`} disabled={p.status !== 'active'} value={p.id}>
													{p.name} - ${p.price.toFixed(2)}
												</option>
											);
										})}
									</select>
								</div>
							</div>
							<div className={styles.eventSalesToggle}>
								<label>Sales</label>
								<Toggle toggleState={!!eventMeta?.salesEnabled} handleToggle={() => updateEvent(event.id, { salesEnabled: !eventMeta?.salesEnabled })} />
							</div>
						</FlexRow>
					</div>
				</section>
			</FlexRow>
		</div>
	);
};

export default Settings;
