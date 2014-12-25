'use strict';

describe('Directive: foosballGame', function () {

  // load the directive's module and view
  beforeEach(module('kickerCamApp'));
  beforeEach(module('app/directives/foosball-game/foosball-game.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  xit('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<foosball-game></foosball-game>');
    element = $compile(element)(scope);
    scope.$apply();
    console.log(element);
    expect(element.text()).toBe('this is the foosballGame directive');
  }));
});
