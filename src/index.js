import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import './index.css';
import App from './App';
import UrlEntry from './UrlEntry';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
    <BrowserRouter>
        <Switch>
        <Route exact path="/" component={UrlEntry} />
        <Route path="/view" component={App} />
        </Switch>
    </BrowserRouter>
  , document.getElementById('root'));
registerServiceWorker();
