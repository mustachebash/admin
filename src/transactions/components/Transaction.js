import './Transaction.less';

import React, { useState, useEffect, useCallback, memo } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import classnames from 'classnames';
import apiClient from 'utils/apiClient';
import TicketsList from 'components/TicketsList';

const Transaction = ({ id }) => {
	const [transaction, setTransaction] = useState(),
		[processorDetails, setProcessorDetails] = useState(),
		[transactionToken, setTransactionToken] = useState(''),
		[events, setEvents] = useState([]),
		[products, setProducts] = useState([]),
		[tickets, setTickets] = useState([]),
		[refunding, setRefunding] = useState(false);

	useEffect(() => {
		apiClient.get(`/transactions/${id}`)
			.then(setTransaction)
			.catch(e => console.error('Transaction API Error', e));

		apiClient.get(`/transactions/${id}/processor-details`)
			.then(setProcessorDetails)
			.catch(e => console.error('Transaction API Error', e));

		apiClient.get(`/transactions/${id}/tickets`)
			.then(setTickets)
			.catch(e => console.error('Transaction API Error', e));

		apiClient.get(`/transactions/${id}/token`)
			.then(setTransactionToken)
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

	const refund = useCallback(() => {
		setRefunding(true);

		apiClient.delete(`/transactions/${id}`)
			.then(() => Promise.all([
				apiClient.get(`/transactions/${id}`)
					.then(setTransaction),
				apiClient.get(`/transactions/${id}/processor-details`)
					.then(setProcessorDetails)
			]))
			.catch(e => console.error('Transaction API Error', e))
			.finally(() => setRefunding(false));
	}, [id]);

	if(!transaction || !processorDetails || !products.length || !events.length) return;

	const {
			firstName,
			lastName,
			email,
			amount,
			braintreeTransactionId,
			created,
			order,
			status: transactionStatus
		} = transaction,
		{
			status: processorStatus
		} = processorDetails;

	return (
		<div className="transaction">
			<h1>Transaction - {braintreeTransactionId} <span className={classnames('transaction-status', transactionStatus)}>{transactionStatus}</span></h1>
			<div className="flex-row">
				<div className="flex-item">
					<h2><span>{firstName} {lastName}</span></h2>
					<h3><span>Amount:</span> ${amount}</h3>
					<h3><span>Purchased:</span> {format(new Date(created), 'M/dd/yy - HH:mm')}</h3>
					<h3><span>Email:</span> {email}</h3>
					<h3 className={classnames('processor-status', processorStatus)}><span>Processor Status:</span> {processorStatus}</h3>

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
					{/* eslint-disable react/jsx-no-target-blank */}
					{transactionToken && <p><a href={`https://mustachebash.com/mytickets?t=${transactionToken}`} target="_blank">Ticket Link</a></p>}
					{!!tickets.length && <TicketsList tickets={tickets} />}

					<h4>Actions</h4>
					<div>
						<button className="red" onClick={refund} disabled={transactionStatus === 'refunded' || refunding}>
							{transactionStatus !== 'refunded'
								? refunding
									? 'Refunding...'
									: 'Refund'
								: 'Already Refunded'
							}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

Transaction.propTypes = {
	id: PropTypes.string.isRequired
};

export default memo(Transaction);
