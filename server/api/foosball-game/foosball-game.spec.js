'use strict';

var should = require('should'),
  path = require('path'),
  app = require('../../app'),
  request = require('supertest'),
  FoosballGame = require('./foosball-game.model'),
  FoosballGameRound = require('./foosball-game-round.model'),
  User = require('../user/user.model'),
  user1 = {
    provider: 'local',
    name: 'Slava',
    email: 'user1@test.com',
    password: 'password'
  },
  user2 = {
    provider: 'local',
    name: 'mascha',
    email: 'user2@test.com',
    password: 'password'
  },
  user3 = {
    provider: 'local',
    name: '3Dfx',
    email: 'user3@test.com',
    password: 'password'
  },
  user4 = {
    provider: 'local',
    name: 'TwerkJörg',
    email: 'user4@test.com',
    password: 'password'
  };

describe('Foosball game model', function () {
  before(function (done) {
    // Clear games before testing
    FoosballGame.remove().exec().then(function () {
      FoosballGameRound.remove().exec().then(function () {
        User.remove().exec().then(function () {
          done();
        });
      });
    });
  });

  afterEach(function (done) {
    FoosballGame.remove().exec().then(function () {
      FoosballGameRound.remove().exec().then(function () {
        User.remove().exec().then(function () {
          done();
        });
      });
    });
  });

  it('should begin with no games', function (done) {
    FoosballGame.find({}, function (err, games) {
      games.should.have.length(0);
      done();
    });
  });

  describe('GET /api/foosball-games', function () {

    it('should respond with JSON array', function (done) {
      request(app)
        .get('/api/foosball-games')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) return done(err);
          res.body.should.be.instanceof(Array);
          done();
        });
    });
  });


  describe('CRUD', function () {

    it('should create a game with defaults', function (done) {
      FoosballGame.create({}, function (error, game) {
        should.not.exist(error);
        //noinspection BadExpressionStatementJS
        game.finished.should.be.an.instanceOf(Boolean).and.be.false;
        //noinspection BadExpressionStatementJS
        game.active.should.be.an.instanceOf(Boolean).and.be.false;
        done();
      })
    });

  });

  describe('Methods', function () {

    describe('.addPlayer', function(){
      it('should return error if user is not an instance of User', function (done) {
        var player = 'user';

        FoosballGame.create({}, function (error, game) {
          game.addPlayer(player, function (error) {
            should.exist(error);
            error.message.should.equal(player + ' is not an instance of ‘User’');
            done();
          });
        })
      });

      it('should return error if list of player already contains 4', function (done) {
        var player1 = new User(user1),
          player2 = new User(user2),
          player3 = new User(user3),
          player4 = new User(user4);

        FoosballGame.create({
          player: [player1._id, player2._id, player3._id, player4._id]
        }, function (error, game) {
          game.addPlayer(player1, function (error) {
            should.exist(error);
            error.message.should.equal('Already 4 player assigned to the game.');
            done();
          });
        })
      });

      it('should add a player to player list', function (done) {
        var player = new User(user1);

        FoosballGame.create({}, function (error, game) {
          game.addPlayer(player, function (error, game) {
            should.not.exist(error);
            FoosballGame.findById(game._id).exec(function (error, game) {
              should.not.exist(error);
              game.player.should.have.length(1);
              done();
            })
          });
        })
      });
    });

    describe('.readPlayerFromQr', function(){

      it('should return list of player with correct position and color', function (done) {
        this.timeout('20000');

        User.create([user1, user2, user3, user4], function(){
          FoosballGame.create({}, function (error, game) {
            game.readPlayerFromQr(function (error) {
              should.not.exist(error);
              done();
            });
          });
        });

      });

    });

    describe('.startNewRound', function(){
      it('should add a new round to the game', function(done){
        this.timeout('20000');

        User.create([user1, user2, user3, user4], function(){
          FoosballGame.create({}, function (error, game) {
            game.rounds.should.have.length(0);

            game.startNewRound(1, function (error) {
              should.not.exist(error);

              FoosballGame.findOne().exec(function(error, game){

                game.rounds.should.have.length(1);
                done();

              });
            });
          });
        });
      });

    });

  });
});
