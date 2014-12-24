'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  FoosballGameRound = require('./foosball-game-round.model'),
  User = require('../user/user.model'),
  _ = require('lodash'),
  Reader = require('../../components/qr/qr'),
  streamService = require('../../stream');

function FoosballGameModelError(message) {
  this.name = 'FoosballGameModelError';
  this.message = (message || '');
}
FoosballGameModelError.prototype = Error.prototype;

var FoosballGameSchema = new Schema({
  player: [{type: Schema.Types.ObjectId, ref: 'User'}],
  rounds: [{type: Schema.Types.ObjectId, ref: 'FoosballGameRound'}],
  active: {type: Boolean, default: false},
  finished: {type: Boolean, default: false}
});

FoosballGameSchema.methods = {
  addPlayer: function (user, cb) {
    var game = this, error = null;
    if (!(user instanceof User)) {
      error = new FoosballGameModelError(user + ' is not an instance of ‘User’');
      return cb(error);
    }

    if (this.player.length === 4) {
      error = new FoosballGameModelError('Already 4 player assigned to the game.');
      return cb(error);
    }

    this.player.push(user._id);
    this.save(function (error) {
      cb(error, game);
    });
  },

  startNewRound: function (roundNr, cb) {
    var game = this;

    this.readPlayerFromQr(function(error, player){
      if(error){
        return cb(error);
      }

      FoosballGameRound.create({
        nr: roundNr,
        game: game._id,
        red_offense: player.red_offense,
        red_defense: player.red_defense,
        blue_offense: player.blue_offense,
        blue_defense: player.blue_defense
      }, function (error, round) {
        if (error) {
          return cb(error)
        }
        game.rounds.push(round);
        game.save(function (error) {
          cb(error);
        });

      });
    });
  },

  readPlayerFromQr: function (cb) {
    var player = {},
      qr = new Reader();
    var readerCallback = function (playerName, x, y, playerColor, playerPosition) {
      User.findOne({name: playerName}).exec(function (error, user) {
        if (error) {
          return cb(error);
        }

        player[playerColor + '_' + playerPosition] = user._id;

        if (_.size(player) === 4) {
          cb(null, player);
        }
      });
    };

    streamService.getQrCodeImagePath(function (error, imagePath) {
      if (error) {
        return cb(error)
      }
      qr.loadImage(imagePath, readerCallback);
    });
  }
};

module.exports = mongoose.model('FoosballGame', FoosballGameSchema);
