'use strict';

angular.module('kickerCamApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('foosball', {
        url: '/foosball',
        templateUrl: 'app/foosball/foosball.html',
        controller: 'FoosballCtrl'
      });
  });