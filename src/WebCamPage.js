import React from 'react';
import { render } from 'react-dom';
import ConnectionsHandler from './components/ConnectionsHandler';
import UserList from './components/UserList';
import CallController from './controllers/CallController';
import IncomingCallPrompt from './components/IncomingCallPrompt';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import logo from './images/logo.png';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

var CC = new CallController();

export default class WebCamPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            currentUser: null,
            muteState: true,
            inCall: false,
            ringing: false
        };

        if (props.inputedName === '') {
            window.location.href = '/';
        }

        CC = new CallController(
            this.recievingCallHandler.bind(this),
            this.streamReadyHandler.bind(this),
            this.endCallHandler.bind(this)
        );
    }

    onConnectionUpdateHandler(users, currentUser) {
        this.setState({
            ...this.state,
            users,
            currentUser
        });
        CC.currentUser = currentUser;
    }

    endCallHandler() {
        this.setState({
            ...this.state,
            inCall: false
        });
    }
    recievingCallHandler(acceptedCall, whoIsCalling) {
        this.setState(
            {
                ...this.state,
                ringing: true,
                whoIsCalling: whoIsCalling
            },
            () => {
                this.acceptedCallHandler = () => {
                    acceptedCall();
                    this.setState({
                        ...this.state,
                        ringing: false,
                        whoIsCalling: ''
                    });
                };

                this.deniedCallHandler = () => {
                    this.setState({
                        ...this.state,
                        ringing: false,
                        whoIsCalling: ''
                    });
                };
            }
        );
    }

    streamReadyHandler() {
        this.setState({
            ...this.state,
            inCall: true
        });
        console.log(this.state.inCall);
    }
    channelConnectedHandler(channel) {
        CC.channel = channel;
        CC.setup();
    }

    onUserCallHandler(userId) {
        CC.call(userId, this.state.currentUser.id);
    }

    render() {
        console.log(this.state);

        return (
            <div>
                {this.state.ringing ? (
                    <IncomingCallPrompt
                        name={this.state.whoIsCalling}
                        accpetedHandler={() => {
                            this.acceptedCallHandler();
                        }}
                        declineHandler={() => {
                            this.deniedCallHandler();
                        }}
                    />
                ) : (
                    ''
                )}
                <div className="header">
                    <img
                        id="logo"
                        src={logo}
                        style={{ width: '150px', height: '125px' }}
                    />
                </div>
                <ConnectionsHandler
                    onConnectionUpdate={this.onConnectionUpdateHandler.bind(
                        this
                    )}
                    channelConnected={this.channelConnectedHandler.bind(this)}
                    inputedName={this.props.inputedName}
                />
                <div style={{ display: this.state.inCall ? 'block' : 'none' }}>
                    <div className="mainSection">
                        <video
                            muted={this.state.muteState}
                            id="peerView"
                            className="videoFrame"
                        />
                        <video muted id="selfView" className="videoFrame" />
                    </div>

                    <div className="buttons">
                        <div
                            className="button"
                            id="muteToggle"
                            onClick={() => {
                                this.setState({
                                    ...this.state,
                                    muteState: !this.state.muteState
                                });
                            }}
                        >
                            {this.state.muteState ? (
                                <FontAwesomeIcon icon="microphone-alt-slash" />
                            ) : (
                                <FontAwesomeIcon icon="microphone-alt" />
                            )}
                        </div>
                        {this.state.inCall ? (
                            <div
                                className="button"
                                id="endCallButton"
                                onClick={() => {
                                    CC.endCall();
                                }}
                            >
                                <FontAwesomeIcon icon="phone-slash" />
                            </div>
                        ) : (
                            ''
                        )}
                    </div>
                </div>
                <UserList
                    users={this.state.users}
                    onUserCall={this.onUserCallHandler.bind(this)}
                />
            </div>
        );
    }
}
