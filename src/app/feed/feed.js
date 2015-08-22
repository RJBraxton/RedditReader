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
  console.log($.inArray($stateParams.subreddit, $scope.$parent.history));
  if ($.inArray($stateParams.subreddit, $scope.$parent.history) <= -1) {
    if ($scope.$parent.history.length = 10) {
      $scope.$parent.history.shift();
      $scope.$parent.history.push($stateParams.subreddit);
    } else{
      $scope.$parent.history.push($stateParams.subreddit);
    }
  }

  $rootScope.pageTitle = "/r/" + $stateParams.subreddit + " | RedditReader";
  $scope.loading = true;

  $scope.subreddit = $stateParams.subreddit;
  

  $scope.moment = moment;

  $scope.subreddit = $stateParams.subreddit;
  redditQuery.searchLinks($scope.subreddit).then(function(res) {
    $scope.posts = res;
    $scope.loading = false;
  });
});