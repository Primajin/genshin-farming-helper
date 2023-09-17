/* global document */
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client'; // eslint-disable-line n/file-extension-in-import

import '@fontsource-variable/material-symbols-outlined/fill.css';
import Main from './components/main.jsx';

const rootElement = document.querySelector('#root');
const root = createRoot(rootElement);
root.render(<StrictMode><Main/></StrictMode>);
