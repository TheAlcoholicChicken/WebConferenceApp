import React from 'react';
import UserCell from './UserCell';
import strings from '../strings/strings';

export default class extends React.Component {
    render() {
        let list = this.props.users.map(user => (
            <UserCell
                key={user.id}
                userId={user.id}
                userName={user.displayName}
                onUserCall={this.props.onUserCall}
            />
        ));

        if (list.length === 0) {
            list = <p>{strings.noOtherUsersAreOnline}</p>;
        }

        return <div className="userList">{list}</div>;
    }
}
