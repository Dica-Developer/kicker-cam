/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Thing = require('../api/thing/thing.model');
var User = require('../api/user/user.model');
var FoosballGame = require('../api/foosball-game/foosball-game.model');
var FoosballGameRound = require('../api/foosball-game/foosball-game-round.model');
var Promise = require('promise');

Thing.find({}).remove(function () {
  Thing.create({
    name: 'Development Tools',
    info: 'Integration with popular tools such as Bower, Grunt, Karma, Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, Stylus, Sass, CoffeeScript, and Less.'
  }, {
    name: 'Server and Client integration',
    info: 'Built with a powerful and fun stack: MongoDB, Express, AngularJS, and Node.'
  }, {
    name: 'Smart Build System',
    info: 'Build system ignores `spec` files, allowing you to keep tests alongside code. Automatic injection of scripts and styles into your index.html'
  }, {
    name: 'Modular Structure',
    info: 'Best practice client and server structures allow for more code reusability and maximum scalability'
  }, {
    name: 'Optimized Build',
    info: 'Build process packs up your templates as a single JavaScript payload, minifies your scripts/css/images, and rewrites asset names for caching.'
  }, {
    name: 'Deployment Ready',
    info: 'Easily deploy your app to Heroku or Openshift with the heroku and openshift subgenerators'
  });
});

function cleanDB() {
  return new Promise(function (resolve) {
    User.find({}).remove(function () {
      FoosballGame.find({}).remove(function () {
        FoosballGameRound.find({}).remove(function () {
          console.log('finished cleaning DB');
          resolve();
        });
      });
    });
  });
}

function injectUser() {
  return new Promise(function (resolve) {
    User.create({
        provider: 'local',
        name: 'Slava',
        email: 'slava@test.com',
        password: '12345'
      },
      {
        provider: 'local',
        name: '3Dfx',
        email: '3Dfx@test.com',
        password: '12345'
      },
      {
        provider: 'local',
        name: 'mascha',
        email: 'mascha@test.com',
        password: '12345'
      },
      {
        provider: 'local',
        name: 'TwerkJörg',
        email: 'joerg@test.com',
        password: '12345'
      },
      {
        provider: 'local',
        role: 'admin',
        name: 'Admin',
        email: 'admin@admin.com',
        password: 'admin'
      }, function () {
        console.log('finished populating users');
        resolve();
      }
    );
  });
}

function injectGames() {
  return new Promise(function (resolve) {
    User.find().where('name').ne('Admin').exec(function (err, user) {
      var game1 = {
          player: [user[0]._id, user[1]._id, user[2]._id, user[3]._id],
          finished: true
        },
        game2 = {
          player: [user[0]._id, user[1]._id, user[2]._id, user[3]._id]
        };
      FoosballGame.create([game1, game2], function () {
        console.log('finished populating games');
        FoosballGame.find().exec(function (error, games) {
          var game1_round1 = {
              nr: 1,
              game: games[0]._id,
              red_offense: user[0]._id,
              red_defense: user[1]._id,
              blue_offense: user[2]._id,
              blue_defense: user[3]._id,
              red_score: 10,
              blue_score: 9
            },
            game1_round2 = {
              nr: 2,
              game: games[0]._id,
              red_offense: user[3]._id,
              red_defense: user[2]._id,
              blue_offense: user[1]._id,
              blue_defense: user[0]._id,
              red_score: 10,
              blue_score: 9
            },
            game1_round3 = {
              nr: 3,
              game: games[0]._id,
              red_offense: user[0]._id,
              red_defense: user[1]._id,
              blue_offense: user[2]._id,
              blue_defense: user[3]._id,
              red_score: 10,
              blue_score: 9
            },
            game2_round1 = {
              nr: 1,
              game: games[0]._id,
              red_offense: user[2]._id,
              red_defense: user[1]._id,
              blue_offense: user[0]._id,
              blue_defense: user[3]._id,
              red_score: 10,
              blue_score: 5
            },
            game2_round2 = {
              nr: 2,
              game: games[0]._id,
              red_offense: user[3]._id,
              red_defense: user[0]._id,
              blue_offense: user[1]._id,
              blue_defense: user[2]._id,
              red_score: 5,
              blue_score: 3
            };

          FoosballGameRound.create([game1_round1, game1_round2, game1_round3, game2_round1, game2_round2], function () {
            console.log('finished populating rounds');
            FoosballGameRound.find()
              .sort('_id nr')
              .select('_id nr')
              .exec(function (error, rounds) {
                games[0].rounds.push(rounds[0]._id);
                games[0].rounds.push(rounds[1]._id);
                games[0].rounds.push(rounds[2]._id);
                games[0].save(function () {
                  games[1].rounds.push(rounds[3]._id);
                  games[1].rounds.push(rounds[4]._id);
                  games[1].save(function () {
                    console.log('finished connecting games and rounds');
                    resolve();
                  });
                });
              });
          });

        });
      });
    });
  });
}

cleanDB()
  .then(injectUser)
  .then(injectGames)
  .then(function () {
    console.log('finished seeding DB');
  });
