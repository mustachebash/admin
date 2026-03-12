import { useParams } from 'react-router-dom';
import Transaction from '../components/Transaction';
import Container from '@/components/Container';

const TransactionView = () => {
	const { id } = useParams();

	return (
		<Container className="transaction-view">
			<Transaction id={id!} />
		</Container>
	);
};

export default TransactionView;
