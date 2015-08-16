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
    data:{ pageTitle: 'What is It?' }
  });
})

.controller( 'FeedCtrl', function FeedCtrl( $scope,  $stateParams, redditQuery ) {
  $scope.subreddit = $stateParams.subreddit;
  

  $scope.subreddit = $stateParams.subreddit;
    redditQuery.searchLinks($scope.subreddit).then(function(res) {
      console.log(res);
      $scope.posts = res.data.data.children;
      // console.log(res);
    }, function(data) {
      alert('Subreddit not found.');
    });
});