import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import axios from 'axios';
import store from 'store';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import reducer from './store/reducer';
import config from './website.config';

// import './assets/fonts/IRANYekanRegular.ttf';
import './assets/fonts/Shabnam.ttf';

//hide console logs
console.log('rhythmitica <3 you!')
console.log = function () {};
console.warn = function () {};
console.error = function () {};

const reduxStore = createStore(reducer);

axios.defaults.baseURL = config.baseUrl;
// axios.defaults.baseURL = 'http://127.0.0.1:8000';
axios.defaults.dashboard = config.dashboardUrl;
// axios.defaults.dashboard = 'http://127.0.0.1:3000' + "/dashboard/";

// axios.defaults.dashboard = 'http://127.0.0.1:3000/dashboard/';

axios.defaults.headers.common['Authorization'] = store.get('token');
axios.defaults.headers.common['site'] = config.site;
window.dashboard_url = config.dashboard_url;
window.editor_api_key = config.editorApiKey;

axios.get('/api/site')
    .then(res => {
        document.querySelector('meta[name=description]').setAttribute('content', res.data.find(item => item.slug === 'desc').value);
        document.querySelector('meta[name=keywords]').setAttribute('content', res.data.find(item => item.slug === 'tags').value);
        document.querySelector('title').innerText = res.data.find(item => item.slug === 'title').value;
    })
    .catch(err => {

    });

ReactDOM.render(
    <React.StrictMode>
        <Provider store={reduxStore}>
            <App/>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
