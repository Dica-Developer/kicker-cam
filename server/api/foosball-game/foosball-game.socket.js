/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var FoosballGame = require('./foosball-game.model');

exports.register = function(socket) {
  FoosballGame.schema.post('save', function (doc) {
    var populateOptions = [
      {path: 'player', select: 'name', model: 'User'},
      {path: 'rounds', model: 'FoosballGameRound'},
      {path: 'rounds.red_offense', select: 'name', model: 'User'},
      {path: 'rounds.red_defense', select: 'name', model: 'User'},
      {path: 'rounds.blue_offense', select: 'name', model: 'User'},
      {path: 'rounds.blue_defense', select: 'name', model: 'User'}
    ];
    FoosballGame.populate(doc, populateOptions, function(err, doc){
      onSave(socket, doc);
    });
  });
  FoosballGame.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
};

function onSave(socket, doc, cb) {
  socket.emit('foosball-game:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('foosball-game:remove', doc);
}
