
var directiveModule = angular.module('directiveApp', []);

directiveModule.controller('InitInnerCtrl', function($scope) {
  console.log('running');
  console.log($scope);
  $scope.inner = {counter: 10};
});

directiveModule.directive('testDirective', function factory() {
      console.log('testDirective defn');
  var directiveDefinitionObject = {
    priority: 0,
    template: '<div ng-include="\'directivePartial.html\'"></div><div ng-transclude></div>',
    replace: false,
    transclude: true,
    restrict: 'AE',
    scope: {
      atattr: '@',
      equalattr: '=',
      andattr: '&'
    },
    // compile: function compile(tElement, tattrs, transclude) {
    //   return {
    //     pre: function preLink(scope, iElement, iattrs, controller) { ... },
    //     post: function postLink(scope, iElement, iattrs, controller) { ... }
    //   }
    // },
    link: function postLink(scope, iElement, iattrs) {
      scope.inner = {counter: 100};
      console.log('postLink');
    }
  };
  return directiveDefinitionObject;
});
