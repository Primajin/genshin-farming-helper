/* global document */
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client'; // eslint-disable-line n/file-extension-in-import

import '@fontsource/material-icons'; // eslint-disable-line import/no-unassigned-import
import Main from './components/main.jsx';

const rootElement = document.querySelector('#root');
const root = createRoot(rootElement);
root.render(<StrictMode><Main/></StrictMode>);
