const express = require('express');
const bodyParser = require('body-parser');
const Pusher = require('pusher');
const app = express();
const path = require('path');
const port = process.env.PORT || 3000;
// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Session middleware

// Create an instance of Pusher
const pusher = new Pusher({
    appId: '626486',
    key: '5867825821e2ee632821',
    secret: '99f6ab14f5497c9dfb6d',
    cluster: 'us2',
    encrypted: true
});

app.get(['/', '/main/'], (req, res) => {
    return res.sendFile(__dirname + '/public/index.html');
});

app.use('/', express.static(path.join(__dirname, 'dist')));
app.use('/main/', express.static(path.join(__dirname, 'dist')));
app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/main/', express.static(path.join(__dirname, 'public')));
app.use('/', express.static(path.join(__dirname, 'node_modules')));
app.use('/main/', express.static(path.join(__dirname, 'node_modules')));

// get authentictation for the channel;
app.post('/pusher/auth', (req, res) => {
    const socketId = req.body.socket_id;
    const channel = req.body.channel_name;

    var presenceData = {
        user_id:
            Math.random()
                .toString(36)
                .slice(2) + Date.now(),
        user_info: {
            name: req.body.name
        }
    };
    const auth = pusher.authenticate(socketId, channel, presenceData);

    console.log(socketId, channel, presenceData.user_id);
    res.send(auth);
});

//listen on the app
app.listen(port, () => {
    return console.log('Server is up on 3000');
});
