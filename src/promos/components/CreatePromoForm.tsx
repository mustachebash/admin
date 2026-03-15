import styles from './CreatePromoForm.module.css';

import { useState, useEffect, useContext, useRef } from 'react';
import apiClient from '@/utils/apiClient';
import FlexRow from '@/components/FlexRow';
import EventContext from '@/EventContext';

interface CreatePromoFormProps {
	onAdd?: (promo: unknown) => void;
}

export default function CreatePromoForm({ onAdd = () => {} }: CreatePromoFormProps) {
	const { event } = useContext(EventContext);

	const [products, setProducts] = useState<any[]>([]);
	const [recipientName, setRecipientName] = useState('');
	const [email, setEmail] = useState('');
	const [quantity, setQuantity] = useState('1');
	const [price, setPrice] = useState('80');
	const [productId, setProductId] = useState('');
	const [emailError, setEmailError] = useState(false);

	const submitting = useRef(false);
	const firstInput = useRef<HTMLInputElement>(null);

	useEffect(() => {
		apiClient
			.get('/products')
			.then(setProducts)
			.catch(e => console.error('Products API Error', e));
	}, []);

	// Reset product selection when event changes
	useEffect(() => {
		setProductId('');
	}, [event?.id]);

	const availableProducts = products.filter(p => p.promo && p.status === 'active' && p.eventId === event?.id);

	function addPromo(e: React.FormEvent) {
		e.preventDefault();

		const qtyInt = Number(quantity);
		const priceNum = Number(price);

		if (submitting.current || !recipientName || !quantity || !productId || !price) return;
		if (priceNum === 0 && !email) {
			setEmailError(true);
			return;
		}
		setEmailError(false);
		if (Number.isNaN(qtyInt) || qtyInt > 4) return;
		if (Number.isNaN(priceNum) || priceNum < 0) return;

		submitting.current = true;

		apiClient
			.post('/promos', {
				type: 'single-use',
				price: priceNum,
				productQuantity: qtyInt,
				recipientName,
				recipientEmail: email || undefined,
				productId
			})
			.then(promo => {
				onAdd(promo);
				setRecipientName('');
				setEmail('');
				setQuantity('1');
				setPrice('80');
				setProductId('');
				submitting.current = false;
				firstInput.current?.focus();
			})
			.catch(err => {
				console.error('Promos API Error', err);
				submitting.current = false;
			});
	}

	return (
		<div className={styles.createPromoForm}>
			<h4>Create a Promo</h4>

			<FlexRow as="form" onSubmit={addPromo}>
				<div className={styles.field}>
					<label>Name</label>
					<input
						type="text"
						name="recipientName"
						placeholder="Name"
						value={recipientName}
						onChange={e => setRecipientName(e.target.value)}
						ref={firstInput}
					/>
				</div>
				<div className={styles.field}>
					<label>Email</label>
					<input
						type="email"
						name="email"
						placeholder="Optional"
						value={email}
						onChange={e => { setEmail(e.target.value); setEmailError(false); }}
					/>
					<span className={styles.fieldError}>{emailError ? 'Email is required' : ''}</span>
				</div>
				<div className={styles.fieldRow}>
					<div className={`${styles.field} ${styles.fieldNarrow}`}>
						<label>Qty</label>
						<input
							type="text"
							inputMode="numeric"
							pattern="[0-9]*"
							name="quantity"
							placeholder="1"
							value={quantity}
							onChange={e => setQuantity(e.target.value.replace(/\D/g, ''))}
						/>
					</div>
					<div className={`${styles.field} ${styles.fieldNarrow}`}>
						<label>Price</label>
						<input
							type="text"
							inputMode="numeric"
							pattern="[0-9]*"
							name="price"
							placeholder="80"
							value={price}
							onChange={e => setPrice(e.target.value.replace(/\D/g, ''))}
						/>
					</div>
				</div>
				<div className={styles.field}>
					<label>Product</label>
					<div className="select-wrap">
						<select name="productId" value={productId} onChange={e => setProductId(e.target.value)} disabled={!event}>
							<option disabled value="">
								{event ? 'Select a Product...' : 'Select an event first'}
							</option>
							{availableProducts.map(p => (
								<option key={p.id} value={p.id}>
									{p.name}
								</option>
							))}
						</select>
					</div>
				</div>

				<button className="white" type="submit">
					Add Promo
				</button>
			</FlexRow>
		</div>
	);
}
