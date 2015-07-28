"use strict";

var Q = require('q');
var Trello = require('node-trello');
var config = {
  appKey: process.env.APPLICATION_KEY,
  oauthToken: process.env.TOKEN
};

// create Trello API client
var t = new Trello(config.appKey, config.oauthToken);

var service = module.exports = {};

/**
 * @TODO add doc
 */
service.updateCardNameWithId = function (action) {
  var card = action.data.card;
  var name = card.name;

  // already contains an id
  if (/^#\d+ /.test(name)) {
    return;
  }

  console.log('update card name with id');

  var issueNumber = '#' + card.idShort;
  var newName = issueNumber + ' ' + name;
  
  updateCard(card.id, newName);
};

/**
 * // should be (8) my ticket description
 * Will update if:
 * - the card has been moved from WIP to QA
 * - the card has no true estimation yet
 */
service.updateCardEstimation = function (action) {
  var card = action.data.card;
  var newName;

  if (action.data.listAfter.name === 'QA' 
  && action.data.listBefore.name === 'WORK IN PROGRESS') {

    var trueEstimationRegExp = /\[(\d+)\]$/;
    var alreadyEstimate = trueEstimationRegExp.test(card.name);
    if (alreadyEstimate) {
      return;
    }

    var initialEstimationRegExp = /^\((\d+)\)/;
    var result = initialEstimationRegExp.exec(card.name);

    if (result) {
      console.log('update card estimation');

      initialEstimation = result[1];
      newName = card.name + ' ['+initialEstimation+']';
    
      updateCard(card.id, newName);  
    }    
  }
}

/**
 * @TODO add doc
 */
function updateCard(id, newName) {
  var defer = Q.defer();
  var url = '/1/cards/' + id + '/name';

  t.put(url, {value: newName}, function (err, data) {
    if (err) {
      defer.reject(err);
    } else {
      defer.resolve('Card '+id+': name change for: ' + data.name);
    }
  });

  return defer.promise;
}

