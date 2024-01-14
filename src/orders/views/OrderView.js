import React from 'react';
import { useParams } from 'react-router-dom';
import Order from '../components/Order';

const OrderView = () => {
	const { id } = useParams();

	return (
		<div className="order-view container-1230">
			<Order id={id} />
		</div>
	);
};

export default OrderView;
