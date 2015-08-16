angular.module( 'ngBoilerplate.comments', [
  'ui.router',
  'placeholders',
  'ui.bootstrap',
  'redditQuery'
  ])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'comments', {
    url: '/comments/:subreddit/:articleID',
    views: {
      "main": {
        controller: 'CommentsCtrl',
        templateUrl: 'comments/comments.tpl.html'
      }
    },
    data:{ pageTitle: 'What is It?' }
  });
})

.controller( 'CommentsCtrl', function CommentsCtrl( $scope, $stateParams, redditQuery ) {
  // This is simple a demo for UI Boostrap.
  // $scope.s = redditQuery.test();
  redditQuery.searchComments($stateParams.subreddit, $stateParams.articleID).then(function(res) {
    $scope.comments = redditQuery.processComments(res);
    console.log($scope.comments);
  });
  

});