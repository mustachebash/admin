// Sockets
import PaulRevere from 'paul-revere';
import schemas from '../schemas';
import { socketConnected, socketDisconnected, SOCKET_CONNECT, SOCKET_DISCONNECT } from '../appDuck';
import { receiveGuest } from 'guests/guestsDuck';

let paul = null;

export const socketMiddleware = store => next => action => {
	switch(action.type) {
		case SOCKET_CONNECT:
			//Start a new connection to the server
			if(paul) {
				paul.onClose(() => {});
				paul.close();
			}
			try {
				paul = new PaulRevere(schemas, {
					url: API_HOST.replace(/^http/, 'ws'), // http > ws, https > wss ;-)
					queryParams: {
						accessToken: window.localStorage.getItem('accessToken')
					}
				});
				paul.onClose(() => {
					store.dispatch(socketDisconnected());
				});
				store.dispatch(socketConnected());
				paul.guest.onMessage(m => store.dispatch(receiveGuest(m.payload)));
			} catch(e) { console.error(e); }
			return next(action);

		case SOCKET_DISCONNECT:
			try {
				paul.close();
			} catch(e) { /* do nothing */}
			return next(action);

		default:
			return next(action);
	}
};
