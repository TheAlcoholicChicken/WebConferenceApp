import React from 'react';
import Pusher from 'pusher-js';
import Peer from 'simple-peer';
import { User } from '../classes/User';

class ConnectionsHandler extends React.Component {
    constructor(props) {
        super(props);

        this.pusher = new Pusher('5867825821e2ee632821', {
            cluster: 'us2',
            encrypted: true,
            authEndpoint: '/pusher/auth',
            auth: {
                params: {
                    name: this.props.inputedName
                }
            }
        });

        this.setupEvents();
    }

    // setups events for connection with pusher
    setupEvents() {
        this.channel = this.pusher.subscribe('presence-videocall');

        this.users = [];
        this.usersOnline = 0;
        this.currentUser = new User(null, this.props.inputedName);

        let events = {
            'pusher:subscription_succeeded': this.subscriptionSucceeded.bind(
                this
            ),
            'pusher:member_added': this.memberAdded.bind(this),
            'pusher:member_removed': this.memberRemoved.bind(this)
        };

        for (let e in events) {
            this.channel.bind(e, events[e]);
        }
    }

    subscriptionSucceeded(members) {
        //set the member count
        this.usersOnline = members.count;
        this.currentUser.id = this.channel.members.me.id;
        this.currentUser.displayName = this.channel.members.me.info.name;
        //this.currentUser.displayName = this.channel.members.me.id;

        console.log('My caller id is :', this.currentUser.id);

        members.each(member => {
            if (member.id != this.channel.members.me.id) {
                this.users.push(new User(member.id, member.info.name));
            }
        });

        this.props.onConnectionUpdate(this.users, this.currentUser);
        this.props.channelConnected(this.channel);
    }

    memberAdded(member) {
        this.users.push(new User(member.id, member.info.name));
        this.props.onConnectionUpdate(this.users, this.currentUser);
    }

    memberRemoved(member) {
        // for remove member from list:
        let index = null;

        // gets index of the user to remove
        for (let i in this.users) {
            if (this.users[i].id === member.id) {
                index = i;
                break;
            }
        }

        if (index === null) return;

        this.users.splice(index, 1);

        this.props.onConnectionUpdate(this.users, this.currentUser);
    }

    render() {
        document.title = this.currentUser.id;
        return (
            <div className="welcome">
                Welcome{' '}
                <span className="cursive">{this.currentUser.displayName}</span>
            </div>
        );
    }
}

export default ConnectionsHandler;
