var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var util = require('./lib/util');

app.use(bodyParser.json());
app.set('port', (process.env.PORT || 5000));

app.post('/callback', function (req, res) {
  var action = req.body.action;
  var actions = {
    'createCard': [updateCardNameWithId]
    'updateCard': [updateCardEstimation]
  };

  var update = actions[action.type];
  if (update) {
    util[update](action);
  }

  res.send('OK');
});

app.get('/', function (req, res) {
  res.send('Trello Scrum Server');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
