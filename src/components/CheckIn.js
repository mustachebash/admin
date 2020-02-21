import React, { useState, useCallback, useEffect, useRef } from 'react';
import jwtDecode from 'jwt-decode';
import apiClient from 'utils/apiClient';

let submitStart = false;

const CheckIn = () => {
	const [ data, setData ] = useState(''),
		[ lastTicket, setLastTicket ] = useState(),
		[ checkInResponse, setCheckInResponse ] = useState({}),
		tokenInputEl = useRef(null);

	const onSubmit = useCallback(e => {
		e.preventDefault();

		console.timeEnd('submit');
		// console.timeEnd('input ref entry');

		let token;
		if(tokenInputEl) {
			token = tokenInputEl.value;
		} else {
			token = data;
		}

		apiClient.post('/check-ins', {ticketToken: token})
			.then(response => {
				setLastTicket(jwtDecode(token));
				setCheckInResponse(response);
				setData('');
			})
			.catch(console.error);
	}, [data, tokenInputEl]);

	const onChange = useCallback(({target: { value }}) => {
		if(!submitStart) {
			console.log('submit start');
			console.time('submit');
			submitStart = true;
		}
		setData(value);
	}, []);

	useEffect(() => {
		function handleEntry(e) {
			if(!this.started) {
				console.time('entry');
				// console.time('input ref entry');
				this.started = true;
			}

			if(e.code === 'Enter') {
				console.timeEnd('entry');

				if(tokenInputEl) {
					console.log(tokenInputEl.current);
					window.tokenInputEl = tokenInputEl.current;
				}
			}
		}

		document.addEventListener('keyup', handleEntry);

		return () => document.removeEventListener('keyup', handleEntry);
	}, [tokenInputEl]);

	return (
		<div>
			{/* <form onSubmit={onSubmit}>
				<input type="text" value={data} autoFocus style={{display: 'none'}} onChange={onChange} />
			</form> */}
			<input type="text" ref={tokenInputEl} autoFocus style={{opacity: 0}} />
			<button onClick={() => setData('')}>Clear</button>
			<pre>{JSON.stringify(lastTicket, null, 2)}</pre>
			<pre>{JSON.stringify(checkInResponse, null, 2)}</pre>
		</div>
	);
};

export default CheckIn;
