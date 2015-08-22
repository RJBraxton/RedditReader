angular.module( 'ngBoilerplate', [
  'templates-app',
  'templates-common',
  'ngBoilerplate.home',
  'ngBoilerplate.about',
  'ngBoilerplate.feed',
  'ngBoilerplate.comments',
  'ngBoilerplate.user',
  'ui.router'
  ])

.config( function myAppConfig ( $stateProvider, $urlRouterProvider ) {
  $urlRouterProvider.otherwise( '/feed/all' );
})

.run( function run () {
})

.controller( 'AppCtrl', function AppCtrl ( $scope, $location, $state) {
  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    if ( angular.isDefined( toState.data.pageTitle ) ) {
      $scope.pageTitle = toState.data.pageTitle + ' | Reddit Reader' ;
    }
  });

  $scope.subredditSearch = function () {
    $state.go('feed', {subreddit: $scope.subredditSearchText});
    $scope.subredditSearchText = '';
    $scope.userSearchText = '';
  };

  $scope.userSearch = function () {
    $state.go('user', {username: $scope.userSearchText });
    $scope.subredditSearchText = '';
    $scope.userSearchText = '';
  };

  $scope.history = [];

})

;

