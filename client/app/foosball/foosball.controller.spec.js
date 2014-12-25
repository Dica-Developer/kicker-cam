'use strict';

describe('Controller: FoosballCtrl', function () {

  // load the controller's module
  beforeEach(module('kickerCamApp'));
  beforeEach(module('socketMock'));

  var FoosballCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FoosballCtrl = $controller('FoosballCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
