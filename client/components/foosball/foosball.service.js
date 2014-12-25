'use strict';

angular.module('kickerCamApp')
  .factory('Foosball', function ($resource) {
    return $resource('/api/foosball-games/:id/:controller/:userId', {
        id: '@_id'
      },
      {
        signIn: {
          'method': 'PUT',
          'params': {
            'controller': 'sign-in',
            'userId': 'userId'
          }
        }
      });
  });
