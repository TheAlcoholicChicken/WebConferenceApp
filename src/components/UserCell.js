import React from 'react';
import { render } from 'react-dom';

export default class extends React.Component {
    render() {
        return (
            <div className="userListRow">
                <div className="userInfo">{this.props.userName}</div>
                <button
                    className="btn btn--stripe"
                    onClick={() => {
                        this.props.onUserCall(this.props.userId);
                    }}
                >
                    Call
                </button>
            </div>
        );
    }
}
