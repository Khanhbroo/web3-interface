import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { StateContextProvider } from './context/index.jsx';

createRoot(document.getElementById('root')).render(
    <StateContextProvider>
        <App />
    </StateContextProvider>,
);
