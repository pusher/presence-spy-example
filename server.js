var express = require('express');
var bodyParser = require('body-parser');

var Pusher = require('pusher');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var pusher = new Pusher({
  appId: 'REDACTED',
  key: 'REDACTED',
  secret: 'REDACTED'
});

app.post('/pusher/auth', function(req, res) {
  var presenceData = {
    user_id: req.body.user,
    user_info: {
      isSpy: req.body.isSpy == 'true'
    }
  };
  var auth = pusher.authenticate(
    req.body.socket_id,
    req.body.channel_name,
    presenceData
  );
  res.send(auth);
});

app.listen(5000);
