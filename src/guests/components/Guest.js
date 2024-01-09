import './Guest.less';

import React, { useState, useEffect, useCallback, useContext, memo } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { checkScope } from 'utils';
import UserContext from 'UserContext';
import apiClient from 'utils/apiClient';
import TicketsList from 'components/TicketsList';

const Guest = ({ id }) => {
	const [guest, setGuest] = useState(),
		[event, setEvent] = useState(),
		[editingComment, setEditingComment] = useState(''),
		[commentInput, setCommentInput] = useState('');

	const { user } = useContext(UserContext);

	useEffect(() => {
		apiClient.get(`/guests/${id}`)
			.then(setGuest)
			.catch(e => console.error('Guest API Error', e));
	}, [id]);

	useEffect(() => {
		if(!guest) return;

		if(guest.meta.comment) setCommentInput(guest.meta.comment);

		const { eventId } = guest;
		apiClient.get(`/events/${eventId}`)
			.then(setEvent)
			.catch(e => console.error('Event API Error', e));
	}, [guest]);

	const saveComment = useCallback(() => {
		apiClient.patch(`/guests/${id}`, {meta: {comment: commentInput}})
			.then(setGuest)
			.then(() => setEditingComment(false))
			.catch(e => console.error('Guest API Error', e));
	}, [commentInput, id]);

	if(!guest || !event) return <p>Loading...</p>;

	const {
			firstName,
			lastName,
			created,
			createdBy,
			createdReason,
			status,
			orderId,
			admissionTier,
			checkInTime,
			updatedBy,
			meta
		} = guest,
		{ name: eventName } = event,
		{ role } = user;

	return (
		<div className="guest">
			<h1>Guest - {eventName}</h1>
			<div className="flex-row">
				<div className="flex-item">
					<h2><span>{firstName} {lastName}</span>{admissionTier === 'vip' && <span title={updatedBy || createdReason} className="vip">&nbsp;- VIP</span>}</h2>
					<h3><span>Created:</span> {format(new Date(created), 'M/dd/yy - HH:mm')}</h3>
					<h3>
						<span>Status:</span> {
							status === 'checked_in'
								? <>Checked In {format(new Date(checkInTime), 'M/dd/yy - HH:mm')}</>
								: status
						}
					</h3>
					<h3>
						<span>Comment:</span> {
							editingComment
								? <fieldset>
									<input type="text" name="comment" placeholder="Comment" value={commentInput} onChange={e => setCommentInput(e.currentTarget.value)} />
									<button className="white" onClick={saveComment}>Save</button><button onClick={() => (setEditingComment(false), setCommentInput(guest.meta.comment))}>Cancel</button>
								</fieldset>
								: <>{meta.comment || ' n/a '} <a href="#" onClick={e => (e.preventDefault(), setEditingComment(true))}>edit</a></>
						}
					</h3>

					<h3>
						{checkScope(role, 'admin')
							? createdReason === 'purchase'
								? <><span>Confirmation Id:</span> <Link to={`/orders/${orderId}`}>{orderId}</Link></>
								: createdReason === 'comp'
									? <><span>Comped by:</span> {createdBy}</>
									: <><span>Created by:</span> {createdBy}/{orderId}</>
							: <><span>Confirmation Id:</span> {orderId}</>
						}
					</h3>

					{checkScope(role, 'admin') && updatedBy && <h3><span>Updated by:</span> {updatedBy}</h3>}
				</div>
			</div>
		</div>
	);
};

Guest.propTypes = {
	id: PropTypes.string.isRequired
};

export default memo(Guest);
