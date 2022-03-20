import './GuestsTable.less';

import React, { useState, useEffect, useCallback, useContext, memo } from 'react';
import UserContext from 'UserContext';
import EventContext from 'EventContext';
import { checkScope } from 'utils';
import apiClient from 'utils/apiClient';
import GuestsList from './GuestsList';
import CompedGuestForm from '../components/CompedGuestForm';
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

	const { event } = useContext(EventContext),
		{ user } = useContext(UserContext);

	useEffect(() => {
		if(event) {
			// If we're getting the 2022 guests,also get the 2020 guests
			// Write the query string manually since it needs duplicate keys for 2022
			apiClient.get(`/guests?eventId=${event.id}${event.id === 'a0ae862c-1755-497c-b843-8457b5696a2a' ? '&eventId=34a99b2a-f826-406a-8227-921efd03ebff' : ''}`)
				.then(setGuests)
				.catch(e => console.error('Guest API Error', e));
		}
	}, [event]);

	const updateGuest = useCallback((id, updates) => {
		apiClient.patch(`/guests/${id}`, updates)
			.then(guest => {
				const oldGuestIndex = guests.findIndex(g => g.id === id);

				if(~oldGuestIndex) {
					const guestsCopy = [...guests];
					guestsCopy.splice(oldGuestIndex, 1, guest);

					setGuests(guestsCopy);
				}
			})
			.catch(e => console.error('Guest API Error', e));
	}, [guests]);

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

			{checkScope(user.role, 'admin') && <CompedGuestForm onAdd={guest => setGuests([guest, ...guests])} />}

			<div className="filters flex-row">
				<div><Search handleQueryChange={setFilter} /></div>
				<div><EventSelector /></div>
			</div>

			<p>Showing {filteredGuests.length} of {guests.length} total</p>

			{event && <GuestsList
				guests={filteredGuests}
				updateGuest={updateGuest}
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
