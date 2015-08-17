angular.module( 'ngBoilerplate.feed', [
  'ui.router',
  'placeholders',
  'ui.bootstrap',
  'redditQuery'
  ])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'feed', {
    url: '/feed/:subreddit',
    views: {
      "main": {
        controller: 'FeedCtrl',
        templateUrl: 'feed/feed.tpl.html'
      }
    },
    data:{}
  });
})

.controller( 'FeedCtrl', function FeedCtrl( $scope,  $stateParams, redditQuery, $rootScope ) {
  $rootScope.pageTitle = "/r/" + $stateParams.subreddit + " | RedditReader";
  $scope.loading = true;

  $scope.subreddit = $stateParams.subreddit;
  

  $scope.moment = moment;

  $scope.subreddit = $stateParams.subreddit;
    redditQuery.searchLinks($scope.subreddit).then(function(res) {
      $scope.posts = res;
      $scope.loading = false;
      console.log(res);
    });
});