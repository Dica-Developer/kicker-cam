'use strict';

angular.module('kickerCamApp')
  .controller('FoosballCtrl', function ($scope, $http, socket, Auth, Foosball) {
    $scope.foosballGames = [];
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.signIn = function(gameId){
      var user = Auth.getCurrentUser();
      Foosball.signIn({id: gameId, userId: user._id}, {});
    };

    $http.get('/api/foosball-games').success(function(foosballGames) {
      $scope.foosballGames = foosballGames;
      socket.syncUpdates('foosball-game', $scope.foosballGames);
    });

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('foosballGames');
    });
  });
