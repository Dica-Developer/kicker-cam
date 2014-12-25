'use strict';

angular.module('kickerCamApp')
  .directive('foosballGame', function () {
    return {
      templateUrl: 'app/directives/foosball-game/foosball-game.html',
      restrict: 'E'
    };
  });
