import { useParams } from 'react-router-dom';
import Guest from '../components/Guest';
import Container from '@/components/Container';

const GuestsView = () => {
	const { id } = useParams();

	return (
		<Container className="guest-view">
			<Guest id={id!} />
		</Container>
	);
};

export default GuestsView;
