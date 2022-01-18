import './Transaction.less';

import React, { useState, useEffect, useCallback, memo } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
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
		[refunding, setRefunding] = useState(false),
		[transfereeFirstName, setTransfereeFirstName] = useState(''),
		[transfereeLastName, setTransfereeLastName] = useState(''),
		[transfereeEmail, setTransfereeEmail] = useState(''),
		[transferring, setTransferring] = useState(false);

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
			.then(({ token }) => setTransactionToken(token))
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

	const transfer = useCallback(() => {
		if(!(transfereeFirstName && transfereeLastName && transfereeEmail && /.+@.+\..+/.test(transfereeEmail))) return;

		setTransferring(true);

		apiClient.post(`/transactions/${id}/transfers`, {
			firstName: transfereeFirstName,
			lastName: transfereeLastName,
			email: transfereeEmail
		})
			.then(() => Promise.all([
				apiClient.get(`/transactions/${id}`)
					.then(setTransaction)
			]))
			.catch(e => console.error('Transaction API Error', e))
			.finally(() => setTransferring(false));
	}, [id, transfereeFirstName, transfereeLastName, transfereeEmail]);

	if(!transaction || (!processorDetails && transaction.type !== 'transfer') || !products.length || !events.length) return null;

	const {
			firstName,
			lastName,
			email,
			amount,
			braintreeTransactionId,
			originalTransactionId,
			type: transactionType,
			transfereeId,
			created,
			order,
			status: transactionStatus
		} = transaction,
		{
			status: processorStatus,
			createdAt,
			refundId,
			creditCard,
			applePay,
			paymentInstrumentType,
			merchantId
		} = processorDetails || {};

	const transactionDate = new Date(createdAt),
		refundCutoff = Date.now() - (90 * 24 * 60 * 60 * 1000), // 90 days
		refundAllowed = transactionDate > refundCutoff;

	return (
		<div className="transaction">
			{transactionType !== 'transfer'
				? <h1>
					{/* eslint-disable-next-line react/jsx-no-target-blank,max-len */}
					Transaction - <a href={`https://www.braintreegateway.com/merchants/${merchantId}/transactions/${braintreeTransactionId}`} target="_blank" title="Open in Braintree">{braintreeTransactionId} </a>
					{transactionStatus && <span className={classnames('transaction-status', transactionStatus)}>{transactionStatus}</span>}
				</h1>

				: <h1>
					{/* eslint-disable-next-line react/jsx-no-target-blank,max-len */}
					Transferred from Transaction - <Link to={`/transactions/${originalTransactionId}`} target="_blank" title="Open Original Transaction">{originalTransactionId.substring(0, 8)} </Link>
					{transactionStatus && <span className={classnames('transaction-status', transactionStatus)}>{transactionStatus}</span>}
				</h1>
			}
			<div className="flex-row">
				<div className="flex-item">
					<h2><span>{firstName} {lastName}</span></h2>
					<h3><span>Amount:</span> ${amount}</h3>
					{paymentInstrumentType === 'credit_card' && <h3><span>Card Used:</span> {creditCard.cardType} (...{creditCard.last4}) - exp. {creditCard.expirationDate}</h3>}
					{paymentInstrumentType === 'apple_pay_card' && <h3><span>Apple Pay Used:</span> {applePay.paymentInstrumentName}</h3>}
					{transactionType !== 'transfer' && <h3><span>Purchased:</span> {format(new Date(created), 'M/dd/yy - HH:mm')}</h3>}
					{transactionType === 'transfer' && <h3><span>Transferred:</span> {format(new Date(created), 'M/dd/yy - HH:mm')}</h3>}
					<h3><span>Email:</span> {email}</h3>
					{transactionType !== 'transfer' && <h3 className={classnames('processor-status', processorStatus)}><span>Processor Status:</span> {processorStatus}</h3>}
					{/* eslint-disable-next-line react/jsx-no-target-blank,max-len */}
					{refundId && <h3><span>Refund Confirmation:</span> <a href={`https://www.braintreegateway.com/merchants/${merchantId}/transactions/${refundId}`} target="_blank" title="Open in Braintree">{refundId}</a></h3>}

					{transactionType !== 'transfer' &&
						<>
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
						</>
					}
				</div>
				<div className="flex-item">
					<h4>Tickets</h4>
					{/* eslint-disable-next-line react/jsx-no-target-blank */}
					{transactionToken && <p><a href={`https://mustachebash.com/mytickets?t=${transactionToken}`} target="_blank">Ticket Link</a></p>}
					{!!tickets.length && <TicketsList tickets={tickets} />}

					<h4>Actions</h4>
					<div>
						{transactionType !== 'transfer' &&
							<button className="red" onClick={refund} disabled={['refunded', 'voided'].includes(transactionStatus) || refunding || !refundAllowed}>
								{/* Ternaries for daaaaaayyyyysss */}
								{!['refunded', 'voided'].includes(transactionStatus)
									? refunding
										? 'Refunding...'
										: refundAllowed
											? ['settled', 'settling'].includes(processorStatus)
												? 'Refund'
												: 'Void'
											: 'Refund Disallowed'
									: transactionStatus === 'voided'
										? 'Already Voided'
										: 'Already Refunded'
								}
							</button>
						}
						{!['refunded', 'voided', 'transferred'].includes(transactionStatus) &&
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
						{transactionStatus === 'transferred' &&
							<h5><Link to={`/transactions/${transfereeId}`} target="_blank" title="Open Original Transaction">View Transfer - {transfereeId.substring(0, 8)} </Link></h5>
						}
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
