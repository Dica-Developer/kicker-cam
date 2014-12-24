'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var Round = require('./foosball-game-round.model');
var User = require('../user/user.model');

var user1 = {
    provider: 'local',
    name: 'User1',
    email: 'user1@test.com',
    password: 'password'
  },
  user2 = {
    provider: 'local',
    name: 'User2',
    email: 'user2@test.com',
    password: 'password'
  },
  user3 = {
    provider: 'local',
    name: 'User3',
    email: 'user3@test.com',
    password: 'password'
  },
  user4 = {
    provider: 'local',
    name: 'User4',
    email: 'user4@test.com',
    password: 'password'
  };

describe('Round Model', function () {
  var player1 = null,
    player2 = null,
    player3 = null,
    player4 = null;

  before(function (done) {
    Round
      .remove()
      .exec()
      .then(function () {
        User
          .remove()
          .exec()
          .then(function(){
            done();
          });
      });
  });

  beforeEach(function(){
    player1 = new User(user1);
    player2 = new User(user2);
    player3 = new User(user3);
    player4 = new User(user4);

    player1.save();
    player2.save();
    player3.save();
    player4.save();
  });

  afterEach(function (done) {
    Round
      .remove()
      .exec()
      .then(function () {
        User
          .remove()
          .exec()
          .then(function(){
            done();
          });
      });
  });

  describe('CRUD', function () {

    it('should create a round', function (done) {
      Round.create({
        nr: 1,
        game:null,
        red_offense: player1._id,
        red_defense: player2._id,
        blue_offense: player3._id,
        blue_defense: player4._id,
        red_score: 0,
        blue_score: 0
      }, function(error){
        should.not.exist(error);
        done();
      });
    });

    it('should throw error if a player is missing', function (done) {
      Round.create({
        nr: 1,
        game:null,
        red_offense: player1._id,
        red_defense: player2._id,
        blue_offense: player3._id,
        red_score: 0,
        blue_score: 0
      }, function(error){
        error.name.should.equal('ValidationError');
        error.errors.blue_defense.message.should.equal('Path `blue_defense` is required.');
        done();
      });
    });

    it('should throw error if a player is assigned twice to blue_defense of blue_offense', function (done) {
      Round.create({
        nr: 1,
        game:null,
        red_offense: player1._id,
        red_defense: player2._id,
        blue_offense: player3._id,
        blue_defense: player3._id,
        red_score: 0,
        blue_score: 0
      }, function(error){
        error.name.should.equal('ValidationError');
        error.errors.blue_offense.message.should.equal('Player can not play two or more positions.');
        error.errors.blue_defense.message.should.equal('Player can not play two or more positions.');
        done();
      });
    });

    it('should throw error if a player is assigned twice to red_offense of red_defense', function (done) {
      Round.create({
        nr: 1,
        game:null,
        red_offense: player1._id,
        red_defense: player1._id,
        blue_offense: player3._id,
        blue_defense: player4._id,
        red_score: 0,
        blue_score: 0
      }, function(error){
        error.name.should.equal('ValidationError');
        error.errors.red_offense.message.should.equal('Player can not play two or more positions.');
        error.errors.red_defense.message.should.equal('Player can not play two or more positions.');
        done();
      });
    });
  });

  describe('Virtuals', function () {
    var round = null;

    beforeEach(function (done) {
      round = Round.create({
        nr: 1,
        game:null,
        red_offense: player1._id,
        red_defense: player2._id,
        blue_offense: player3._id,
        blue_defense: player4._id,
        red_score: 0,
        blue_score: 0
      }, function(){
        done();
      });
    });

    it('.normalized should return round with user names instead of objectId', function (done) {
      Round.findOne().exec(function(err, result){
        result.normalized.then(function(round){
          round.red_offense.name.should.equal('User1');
          round.red_defense.name.should.equal('User2');
          round.blue_offense.name.should.equal('User3');
          round.blue_defense.name.should.equal('User4');
          done();
        });
      });
    });
  });

  describe('Methods', function () {
    var round = null;

    beforeEach(function (done) {
      round = Round.create({
        nr: 1,
        game:null,
        red_offense: player1._id,
        red_defense: player2._id,
        blue_offense: player3._id,
        blue_defense: player4._id,
        red_score: 0,
        blue_score: 0
      }, function(){
        done();
      });
    });

    it('.updateScore should update and save round', function (done) {
      Round.findOne().exec(function(err, round){
        var roundId = round._id;
        round.red_score.should.equal(0);
        round.blue_score.should.equal(0);

        round.updateScore({red: 4, blue: 7}, function(error){
          should.not.exist(error);
          Round.findById(roundId).exec(function(error, round){
            round.red_score.should.equal(4);
            round.blue_score.should.equal(7);
            done();
          });
        });
      });
    });
  });
});
