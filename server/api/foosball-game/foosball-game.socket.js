/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var FoosballGame = require('./foosball-game.model');

exports.register = function(socket) {
  FoosballGame.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  FoosballGame.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('foosball-game:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('foosball-game:remove', doc);
}