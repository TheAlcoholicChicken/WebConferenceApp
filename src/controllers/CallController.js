import { log } from 'util';

import Peer from 'simple-peer';
import Pusher from 'pusher-js';

export default class CallController {
    constructor(recievingCallCallback, streamReadyCallback, endCallCallback) {
        navigator.getUserMedia =
            navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia;

        this.recievingCallCallback = recievingCallCallback;
        this.streamReady = streamReadyCallback;
        this.endCallCallback = endCallCallback;
        this.usersInCall = [];
        this.stream = null;
    }

    setup() {
        this.peer = undefined;

        this.channel.bind(
            'client-receiving-call-' + this.currentUser.id,
            signal => {
                this.recievingCallCallback(() => {
                    this.channel.trigger(
                        'client-accepted-call-' + signal.userId,
                        {
                            userId: this.currentUser.id
                        }
                    );

                    this.usersInCall.push(signal.userId);
                    console.log(this.usersInCall);
                }, signal.name);
            }
        );

        this.channel.bind(
            'client-accepted-call-' + this.currentUser.id,
            signal => {
                navigator.getUserMedia(
                    { video: true, audio: true },
                    stream => {
                        this.peer = new Peer({
                            initiator: true,
                            stream: stream
                        });
                        this.setupPeerEvents(this.peer, signal.userId, stream);
                    },
                    () => {}
                );
            }
        );
        // when someone tries to comunicate
        this.channel.bind('client-signal-' + this.currentUser.id, signal => {
            navigator.getUserMedia(
                { video: true, audio: true },
                stream => {
                    // if not initiator
                    if (this.peer === undefined) {
                        this.peer = new Peer({
                            stream: stream
                        });

                        console.log('reciveing call for', signal.userId);
                        this.setupPeerEvents(this.peer, signal.userId, stream);
                    }

                    this.peer.signal(signal.data);
                },
                () => {}
            );
        });
    }
    call(peerUserId) {
        console.log('calling', peerUserId);
        this.channel.trigger('client-receiving-call-' + peerUserId, {
            userId: this.currentUser.id,
            name: this.currentUser.displayName
        });
        this.usersInCall.push(peerUserId);
    }
    endCall() {
        this.peer.destroy();

        for (let i in this.stream.getTracks()) {
            this.stream.getTracks()[i].stop();
        }

        document.querySelector('#peerView').src = '';
        document.querySelector('#selfView').src = '';

        this.endCallCallback();
    }
    setupPeerEvents(peer, remoteUserId, stream) {
        peer.on('signal', data => {
            this.channel.trigger('client-signal-' + remoteUserId, {
                userId: this.currentUser.id,
                data: data
            });
        });

        // when recieving remote stream
        peer.on('stream', stream => {
            console.log('reciveing stream for', remoteUserId);
            var video = document.querySelector('video#peerView');
            video.src = window.URL.createObjectURL(stream);
            video.play();
            this.streamReady();
        });

        var video = document.querySelector('#selfView');
        video.src = window.URL.createObjectURL(stream);
        video.play();
        this.stream = stream;
    }
}
