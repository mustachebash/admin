import './Order.less';

import React, { useState, useEffect, useCallback, memo } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import classnames from 'classnames';
import apiClient from 'utils/apiClient';
import TicketsList from 'components/TicketsList';

const Order = ({ id }) => {
	const [order, setOrder] = useState(),
		[customer, setCustomer] = useState(),
		[transactions, setTransactions] = useState(),
		[processorDetails, setProcessorDetails] = useState(),
		[orderToken, setOrderToken] = useState(''),
		[events, setEvents] = useState([]),
		[products, setProducts] = useState([]),
		[tickets, setTickets] = useState([]),
		[refunding, setRefunding] = useState(false),
		[transfereeFirstName, setTransfereeFirstName] = useState(''),
		[transfereeLastName, setTransfereeLastName] = useState(''),
		[transfereeEmail, setTransfereeEmail] = useState(''),
		[transferring, setTransferring] = useState(false);

	useEffect(() => {
		apiClient.get(`/orders/${id}`)
			.then(setOrder)
			.catch(e => console.error('Order API Error', e));

		apiClient.get(`/orders/${id}/transactions`)
			.then(setTransactions)
			.catch(e => console.error('Order API Error', e));

		apiClient.get(`/orders/${id}/tickets`)
			.then(setTickets)
			.catch(e => console.error('Order API Error', e));

		apiClient.get(`/orders/${id}/token`)
			.then(({ token }) => setOrderToken(token))
			.catch(e => console.error('Order API Error', e));
	}, [id]);

	useEffect(() => {
		if(order?.customerId) {
			apiClient.get(`/customers/${order.customerId}`)
				.then(setCustomer)
				.catch(e => console.error('Customer API Error', e));
		}
	}, [order?.customerId]);

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

		apiClient.delete(`/orders/${id}`)
			.then(() => Promise.all([
				apiClient.get(`/orders/${id}`)
					.then(setOrder),
				apiClient.get(`/orders/${id}/processor-details`)
					.then(setProcessorDetails)
			]))
			.catch(e => console.error('Order API Error', e))
			.finally(() => setRefunding(false));
	}, [id]);

	const transfer = useCallback(() => {
		if(!(transfereeFirstName && transfereeLastName && transfereeEmail && /.+@.+\..+/.test(transfereeEmail))) return;

		setTransferring(true);

		apiClient.post(`/orders/${id}/transfers`, {
			firstName: transfereeFirstName,
			lastName: transfereeLastName,
			email: transfereeEmail
		})
			.then(() => Promise.all([
				apiClient.get(`/orders/${id}`)
					.then(setOrder)
			]))
			.catch(e => console.error('Order API Error', e))
			.finally(() => setTransferring(false));
	}, [id, transfereeFirstName, transfereeLastName, transfereeEmail]);

	if(!order || !products.length || !events.length || !customer) return null;

	const {
			amount,
			parentOrderId,
			created,
			items,
			status: orderStatus
		} = order,
		{
			firstName,
			lastName,
			email
		} = customer || {},
		{
			status: processorStatus,
			createdAt,
			refundId,
			creditCard,
			applePay,
			paymentInstrumentType,
			// TEMP
			merchantId
		} = processorDetails || {};

	const orderDate = new Date(createdAt),
		refundCutoff = Date.now() - (90 * 24 * 60 * 60 * 1000), // 90 days
		refundAllowed = orderDate > refundCutoff;

	return (
		<div className="order">
			{orderStatus !== 'transferred'
				? <h1>
					{/* eslint-disable-next-line react/jsx-no-target-blank,max-len */}
					Order - {orderStatus && <span className={classnames('order-status', orderStatus)}>{orderStatus}</span>}
				</h1>

				: <h1>
					{/* eslint-disable-next-line react/jsx-no-target-blank,max-len */}
					Transferred from Order - <Link to={`/orders/${parentOrderId}`} target="_blank" title="Open Original Order">{parentOrderId.substring(0, 8)} </Link>
					{orderStatus && <span className={classnames('order-status', orderStatus)}>{orderStatus}</span>}
				</h1>
			}
			<div className="flex-row">
				<div className="flex-item">
					<h2><span>{firstName} {lastName}</span></h2>
					<h3><span>Amount:</span> ${amount}</h3>
					{paymentInstrumentType === 'credit_card' && <h3><span>Card Used:</span> {creditCard.cardType} (...{creditCard.last4}) - exp. {creditCard.expirationDate}</h3>}
					{paymentInstrumentType === 'apple_pay_card' && <h3><span>Apple Pay Used:</span> {applePay.paymentInstrumentName}</h3>}
					{orderStatus !== 'transferred' && <h3><span>Purchased:</span> {format(new Date(created), 'M/dd/yy - HH:mm')}</h3>}
					{orderStatus === 'transferred' && <h3><span>Transferred:</span> {format(new Date(created), 'M/dd/yy - HH:mm')}</h3>}
					<h3><span>Email:</span> {email}</h3>
					{/*{orderStatus !== 'transferred' && <h3 className={classnames('processor-status', processorStatus)}><span>Processor Status:</span> {processorStatus}</h3>}*/}
					{/* eslint-disable-next-line react/jsx-no-target-blank,max-len */}
					{refundId && <h3><span>Refund Confirmation:</span> <a href={`${BRAINTREE_HOST}/merchants/${merchantId}/transactions/${refundId}`} target="_blank" title="Open in Braintree">{refundId}</a></h3>}

					{orderStatus !== 'transferred' &&
						<>
							<h5><span>Transactions</span></h5>
							<ul className="order-details">
								{transactions.map(({ id: transactionId, processor, processorTransactionId, type }) => {
									{/* empty comment */}
									return (
										<li key={transactionId}>
											<p>{type}</p>
											{processor === 'braintree' &&
												<span>Braintree ID:{' '}
													<a
														href={`${BRAINTREE_HOST}/merchants/${merchantId}/transactions/${processorTransactionId}`}
														target="_blank"
														rel="noreferrer"
														title="Open in Braintree"
													>
														{processorTransactionId}
													</a>
												</span>
											}
										</li>
									);
								})}
							</ul>

							<h5><span>Order Details</span></h5>
							<ul className="order-details">
								{items.map(({ productId, quantity }) => {
									const { name, price, eventId } = products.find(p => p.id === productId) || {};

									return (
										<li key={productId}>
											<p><span>{name} (${price}):</span> {quantity}</p>
											{eventId && <p className="event">{events.find(e => e.id === eventId).name}</p>}
										</li>
									);
								})}
							</ul>
						</>
					}
				</div>
				<div className="flex-item">
					<h4>Tickets</h4>
					{/* eslint-disable-next-line react/jsx-no-target-blank */}
					{orderToken && <p><a href={`${TICKET_LINK_HOST}/mytickets?t=${orderToken}`} target="_blank">Ticket Link</a></p>}
					{!!tickets.length && <TicketsList tickets={tickets} />}

					<h4>Actions</h4>
					<div>
						{orderStatus !== 'transferred' &&
							<button className="red" onClick={refund} disabled={['refunded', 'voided'].includes(orderStatus) || refunding || !refundAllowed}>
								{/* Ternaries for daaaaaayyyyysss */}
								{!['refunded', 'voided'].includes(orderStatus)
									? refunding
										? 'Refunding...'
										: refundAllowed
											? ['settled', 'settling'].includes(processorStatus)
												? 'Refund'
												: 'Void'
											: 'Refund Disallowed'
									: orderStatus === 'voided'
										? 'Already Voided'
										: 'Already Refunded'
								}
							</button>
						}
						{!['refunded', 'voided', 'transferred'].includes(orderStatus) &&
							<>
								<h5>Transfer</h5>
								<input type="text" name="transferee-first-name" placeholder="First Name" value={transfereeFirstName} onChange={e => setTransfereeFirstName(e.currentTarget.value)} />
								<input type="text" name="transferee-last-name" placeholder="Last Name" value={transfereeLastName} onChange={e => setTransfereeLastName(e.currentTarget.value)} />
								<input type="text" name="transferee-email" placeholder="Email" value={transfereeEmail} onChange={e => setTransfereeEmail(e.currentTarget.value)} />
								<button className="red" onClick={transfer} disabled={transferring || !(transfereeFirstName && transfereeLastName && transfereeEmail && /.+@.+\..+/.test(transfereeEmail))}>
									{transferring
										? 'Transferring...'
										: 'Transfer'
									}
								</button>
							</>
						}
						{orderStatus === 'transferred' &&
							{/*<h5><Link to={`/orders/${transfereeId}`} target="_blank" title="Open Original Order">View Transfer - {transfereeId.substring(0, 8)} </Link></h5>*/}
						}
					</div>
				</div>
			</div>
		</div>
	);
};

Order.propTypes = {
	id: PropTypes.string.isRequired
};

export default memo(Order);
