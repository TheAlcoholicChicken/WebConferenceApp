import React from 'react';
import { render } from 'react-dom';
import ConnectionsHandler from './components/ConnectionsHandler';
import UserList from './components/UserList';
import CallController from './controllers/CallController';
import logo from './images/logo.png';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import strings from './strings/strings';
var CC = new CallController();

export default class StartPage extends React.Component {
    render() {
        return (
            <div>
                <div className="header">
                    <img
                        id="logo"
                        src={logo}
                        style={{ width: '420px', height: '350px' }}
                    />
                </div>
                <div className="startPageDivs" style={{ marginTop: 10 }}>
                    <p>{strings.pleaseEnterName}</p>
                </div>
                <div className="startPageDivs" style={{ marginTop: 5 }}>
                    <input
                        id="nameInput"
                        value={this.props.inputedName}
                        onChange={this.props.updateinputedName}
                    />
                </div>
                <div className="startPageDivs" style={{ marginTop: 30 }}>
                    <Link className="btn btn--stripe" to="/main/">
                        {strings.startChatting}
                    </Link>
                </div>
            </div>
        );
    }
}
