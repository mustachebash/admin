/**
 * Entry point
 * Global project logic, style, and setup
 */
import 'normalize.css';
import './base.css';

import { createRoot } from 'react-dom/client';
import App from './App';

createRoot(document.getElementById('app-root')!).render(<App />);
