import React from 'react';
import { render } from 'react-dom';
import ConnectionsHandler from './components/ConnectionsHandler';
import UserList from './components/UserList';
import CallController from './controllers/CallController';
import logo from './images/logo.png';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import WebCamPage from './WebCamPage';
import StartPage from './StartPage';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faMicrophoneAltSlash,
    faMicrophoneAlt,
    faPhoneSlash
} from '@fortawesome/free-solid-svg-icons';

library.add(faMicrophoneAltSlash);
library.add(faMicrophoneAlt);
library.add(faPhoneSlash);

class App extends React.Component {
    constructor() {
        super();
        this.state = { inputedName: '' };
    }
    updateinputedName(evt) {
        this.setState({
            inputedName: evt.target.value
        });
    }

    render() {
        return (
            <Router>
                <div>
                    <Route
                        path="/"
                        exact
                        render={props => (
                            <StartPage
                                {...props}
                                inputedName={this.state.inputedName}
                                updateinputedName={this.updateinputedName.bind(
                                    this
                                )}
                            />
                        )}
                    />
                    <Route
                        path="/main/"
                        render={props => (
                            <WebCamPage
                                {...props}
                                inputedName={this.state.inputedName}
                            />
                        )}
                    />
                </div>
            </Router>
        );
    }
}

render(<App />, document.getElementById('app'));
