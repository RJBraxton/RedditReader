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
    data:{}
  });
})

.controller( 'CommentsCtrl', function CommentsCtrl( $scope, $stateParams, redditQuery, $rootScope, $sce) {
  $scope.loading = true;

  $scope.htmltest = "<p>I always thought they were nice, gentle herbivores who moved with the gait of an old man. </p> </div>";
  $scope.htmltest = $sce.trustAsHtml($scope.htmltest);

  redditQuery.searchComments($stateParams.subreddit, $stateParams.articleID).then(function(res) {
    $scope.comments = res.comments;
    $scope.post = res.post;
    $rootScope.pageTitle = res.post.title + " | RedditReader";  
    $scope.loading = false;
    console.log(res);
  });  

});