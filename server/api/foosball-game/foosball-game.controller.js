'use strict';

var _ = require('lodash');
var FoosballGame = require('./foosball-game.model');
var User = require('../user/user.model');

// Get list of foosball-games
exports.index = function(req, res) {
  console.time('Get Games');
  var roundPopulateOptions = [
    {path: 'rounds.red_offense', select: 'name', model: 'User'},
    {path: 'rounds.red_defense', select: 'name', model: 'User'},
    {path: 'rounds.blue_offense', select: 'name', model: 'User'},
    {path: 'rounds.blue_defense', select: 'name', model: 'User'}
  ];
  FoosballGame.find()
    .populate('player', 'name')
    .populate('rounds', '-_id')
    .populate(roundPopulateOptions)
    .exec(function (err, foosballGames) {
      FoosballGame.populate(foosballGames, roundPopulateOptions, function(err, foosballGames){
        if(err) { return handleError(res, err); }
        console.timeEnd('Get Games');
        return res.json(200, foosballGames);
      });
  });
};

// Get a single foosball-game
exports.show = function(req, res) {
  FoosballGame.findById(req.params.id, function (err, foosballGame) {
    if(err) { return handleError(res, err); }
    if(!foosballGame) { return res.send(404); }
    return res.json(foosballGame);
  });
};

// Creates a new foosballGame in the DB.
exports.create = function(req, res) {
  FoosballGame.create(req.body, function(err, foosballGame) {
    if(err) { return handleError(res, err); }
    return res.json(201, foosballGame);
  });
};

// Updates an existing foosballGame in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  FoosballGame.findById(req.params.id, function (err, foosballGame) {
    if (err) { return handleError(res, err); }
    if(!foosballGame) { return res.send(404); }
    var updated = _.merge(foosballGame, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, foosballGame);
    });
  });
};

// Deletes a foosballGame from the DB.
exports.destroy = function(req, res) {
  FoosballGame.findById(req.params.id, function (err, foosballGame) {
    if(err) { return handleError(res, err); }
    if(!foosballGame) { return res.send(404); }
    foosballGame.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

exports.signIn = function(req, res) {
  User.findById(req.params.userId, function(err, user){
    if(err) { return handleError(res, err); }

    FoosballGame.findById(req.params.id, function (err, foosballGame) {
      if(err) { return handleError(res, err); }
      foosballGame.addPlayer(user, function(err, game){
        if(err) { return handleError(res, err); }
        return res.send(200, game);
      });
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
