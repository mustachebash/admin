import './GuestsTable.less';

import React, { useState, useEffect, useContext, memo } from 'react';
import EventContext from 'EventContext';
import apiClient from 'utils/apiClient';
import GuestsList from './GuestsList';
import Search from 'components/Search';
import EventSelector from 'components/EventSelector';

function getGuestComparator({sortBy, sortOrder}) {
	return (a, b) => {
		let sort = 0;

		switch(sortBy) {
			case 'name':
				sort = a.lastName > b.lastName
					? 1
					: a.lastName === b.lastName
						? 0
						: -1;
				break;

			default:
			case 'date':
				// This will (should) never be the same
				sort = a.created > b.created ? 1 : -1;
				break;
		}

		return sort * sortOrder;
	};
}

const GuestsTable = () => {
	const [guests, setGuests] = useState([]),
		[filter, setFilter] = useState(''),
		[sort, setSort] = useState({sortBy: 'date', sortOrder: -1}); // asc

	const { event } = useContext(EventContext);

	useEffect(() => {
		if(event) {
			apiClient.get('/guests', {eventId: event.id})
				.then(setGuests)
				.catch(e => console.error('Guest API Error', e));
		}
	}, [event]);

	function sortGuests(sortBy) {
		setSort({
			sortOrder: 1,
			sortBy
		});
	}

	function switchGuestsOrder() {
		setSort({
			sortOrder: sort.sortOrder * (-1),
			sortBy: sort.sortBy
		});
	}

	const filterRegEx = new RegExp(filter, 'i');

	let filteredGuests = guests.filter(g => {
		if(!filter) return true;

		return (
			filterRegEx.test(g.firstName + ' ' + g.lastName) ||
			filterRegEx.test(g.confirmationId)
		);
	});

	filteredGuests.sort(getGuestComparator(sort));

	// No one needs to see more than 100 guests at a time
	filteredGuests = filteredGuests.slice(0, 100);

	return (
		<div className="guests-table">
			<div className="filters flex-row">
				<div><Search handleQueryChange={setFilter} /></div>
				<div><EventSelector /></div>
			</div>

			<p>Showing {filteredGuests.length} of {guests.length} total</p>

			{event && <GuestsList
				guests={filteredGuests}
				sortGuests={sortGuests}
				switchGuestsOrder={switchGuestsOrder}
				sortBy={sort.sortBy}
				sortOrder={sort.sortOrder}
				event={event}
			/>}
		</div>
	);
};

export default memo(GuestsTable);
