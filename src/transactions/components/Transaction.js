import './Transaction.less';

import React, { useState, useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import apiClient from 'utils/apiClient';
import TicketsList from 'components/TicketsList';

const Transaction = ({ id }) => {
	const [transaction, setTransaction] = useState(),
		[events, setEvents] = useState([]),
		[products, setProducts] = useState([]),
		[tickets, setTickets] = useState([]);

	useEffect(() => {
		apiClient.get(`/transactions/${id}`)
			.then(setTransaction)
			.catch(e => console.error('Transaction API Error', e));

		apiClient.get(`/transactions/${id}/tickets`)
			.then(setTickets)
			.catch(e => console.error('Transaction API Error', e));
	}, [id]);

	useEffect(() => {
		apiClient.get('/products')
			.then(setProducts)
			.catch(e => console.error('Products API Error', e));

		apiClient.get('/events')
			.then(setEvents)
			.catch(e => console.error('Events API Error', e));
	}, []);

	if(!transaction || !products.length || !events.length) return;

	const {
		firstName,
		lastName,
		email,
		amount,
		braintreeTransactionId,
		created,
		order
	} = transaction;

	return (
		<div className="transaction">
			<h1>Transaction - {braintreeTransactionId}</h1>
			<div className="flex-row">
				<div className="flex-item">
					<h2><span>{firstName} {lastName}</span></h2>
					<h3><span>Amount:</span> ${amount}</h3>
					<h3><span>Purchased:</span> {format(new Date(created), 'M/dd/yy - HH:mm')}</h3>
					<h3><span>Email:</span> {email}</h3>

					<h5><span>Order Details</span></h5>
					<ul className="order-details">
						{order.map(({ productId, quantity }) => {
							const { name, price, eventId } = products.find(p => p.id === productId) || {};

							return (
								<li key={productId}>
									<p><span>{name} (${price}):</span> {quantity}</p>
									{eventId && <p className="event">{events.find(e => e.id === eventId).name}</p>}
								</li>
							);
						})}
					</ul>
				</div>
				<div className="flex-item">
					<h4>Tickets</h4>
					{!!tickets.length && <TicketsList tickets={tickets} />}
				</div>
			</div>
		</div>
	);
};

Transaction.propTypes = {
	id: PropTypes.string.isRequired
};

export default memo(Transaction);
