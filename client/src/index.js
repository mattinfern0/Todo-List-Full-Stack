import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import ApiMessenger from './controllers/ApiMessenger';

// Setup defaults
ApiMessenger.getUserInbox('testUser');
ApiMessenger.getProjectList();
// ApiMessenger.getProjectTasks('5d74c6f92a73857006c0dadd');


ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
