var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var actions = require('./lib/actions');

app.use(bodyParser.json());
app.set('port', (process.env.PORT || 5000));

app.post('/callback', function (req, res) {
  var update = req.body.action;
  var updateActions = {
    'createCard': ['updateCardNameWithId'],
    'updateCard': ['updateCardEstimation']
  };

  console.log('[Trello] Update of type: ' + update.type);

  var actionsRequested = updateActions[update.type];
  if (actionsRequested) {
    console.log('actions requested: ' + actionsRequested);
    
    actionsRequested.forEach(function (action) {
      if (typeof actions[action] === 'function') {
        actions[action](update);
      }
    });
  }

  res.send('OK');
});

app.get('/', function (req, res) {
  res.send('Trello Scrum Server');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
