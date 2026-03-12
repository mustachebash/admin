import { useParams } from 'react-router-dom';
import Order from '../components/Order';
import Container from '@/components/Container';

const OrderView = () => {
	const { id } = useParams();

	return (
		<Container className="order-view">
			<Order id={id!} />
		</Container>
	);
};

export default OrderView;
