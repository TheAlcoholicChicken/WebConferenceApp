import React from 'react';
import UserCell from './UserCell';
import strings from '../strings/strings';

export default class extends React.Component {
    render() {
        return (
            <div className="incomingCallContainer ">
                <p>
                    <span className="cursive" style={{ fontSize: '48px' }}>
                        {this.props.name}
                        {"'s "}
                    </span>
                    {strings.incomingCall}
                </p>
                <div>
                    <button
                        className="btn btn--stripe"
                        onClick={this.props.accpetedHandler}
                    >
                        {strings.accept}
                    </button>
                </div>
                <div>
                    <button
                        className="btn btn--stripe"
                        onClick={this.props.declineHandler}
                    >
                        {strings.decline}
                    </button>
                </div>
            </div>
        );
    }
}
