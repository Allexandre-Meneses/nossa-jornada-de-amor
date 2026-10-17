import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import {AdminPage} from './components/AdminPage.tsx';
import './index.css';

const path = window.location.pathname.replace(/\/+$/, '') || '/';

createRoot(document.getElementById('root')!).render(
  path === '/admin' ? <AdminPage /> : <App />
);
