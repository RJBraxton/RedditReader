angular.module( 'ngBoilerplate.user', [
  'ui.router',
  'plusOne'
])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
.config(function config( $stateProvider ) {
  $stateProvider.state( 'user', {
    url: '/user/:username',
    views: {
      "main": {
        controller: 'UserCtrl',
        templateUrl: 'user/user.tpl.html'
      }
    },
    data:{}
  });
})

/**
 * And of course we define a controller for our route.
 */
.controller( 'UserCtrl', function UserCtrl( $scope, $stateParams, redditQuery, $rootScope) {
  $rootScope.pageTitle = $stateParams.username + " | RedditReader";

  redditQuery.getUserAbout($stateParams.username).then(function(res) {
    $scope.userAbout = res;
  });

  redditQuery.getUserOverview($stateParams.username).then(function(res) {
    $scope.userOverview = res;
    console.log(res);
  });
});

