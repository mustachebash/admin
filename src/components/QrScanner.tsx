import { useCallback, useEffect, useId, useMemo, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

type QrScannerProps = {
	active: boolean;
	onScan: (decodedText: string) => void;
	onError?: (message: string) => void;
	className?: string;
	id?: string;
};

const QrScanner = ({ active, onScan, onError, className, id }: QrScannerProps) => {
	const generatedId = useId(),
		containerId = useMemo(() => id ?? `qr-scanner-${generatedId.replace(/:/g, '')}`, [generatedId, id]),
		scannerRef = useRef<Html5Qrcode | null>(null),
		scanHandledRef = useRef(false);

	const stopScanner = useCallback(async () => {
		const scanner = scannerRef.current;
		scannerRef.current = null;

		if (!scanner) return;

		try {
			if (scanner.isScanning) {
				await scanner.stop();
			}
		} catch (error) {
			console.error('QR camera stop error', error);
		}

		try {
			await scanner.clear();
		} catch (error) {
			console.error('QR camera clear error', error);
		}
	}, []);

	useEffect(() => {
		let isMounted = true;

		if (!active) {
			void stopScanner();
			return;
		}

		const scanner = new Html5Qrcode(containerId);
		scannerRef.current = scanner;
		scanHandledRef.current = false;

		const startScanner = async () => {
			try {
				await scanner.start(
					{ facingMode: 'environment' },
					{ fps: 10, qrbox: { width: 250, height: 250 } },
					decodedText => {
						if (scanHandledRef.current) return;

						scanHandledRef.current = true;
						onScan(decodedText);
						void stopScanner();
					},
					_decodeError => undefined
				);
			} catch (error) {
				if (!isMounted) return;

				const message = error instanceof Error ? error.message : 'Unable to start QR scanner';
				onError?.(message);
				console.error('QR camera start error', error);
				void stopScanner();
			}
		};

		void startScanner();

		return () => {
			isMounted = false;
			void stopScanner();
		};
	}, [active, containerId, onError, onScan, stopScanner]);

	return <div id={containerId} className={className} style={{ height: '100%', width: '100%' }} />;
};

export default QrScanner;
