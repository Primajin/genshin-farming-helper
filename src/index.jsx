/* global document */
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import '@fontsource-variable/material-symbols-outlined/fill.css';
import Main from 'components/pages/main.jsx';

const rootElement = document.querySelector('#root');
const root = createRoot(rootElement);
root.render(<StrictMode><Main/></StrictMode>);
