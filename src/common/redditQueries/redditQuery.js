angular.module( 'redditQuery', [] )

.factory( 'redditQuery', function($http) {

	//Vars
	var baseURLr = 'http://www.reddit.com/r/';
	var baseURLu = 'http://www.reddit.com/user/';

	return {
		searchLinks: function(subreddit) {
			var url = baseURLr + subreddit + '/hot.json';
			return $http.get(url);
		}, 
		searchComments: function(subreddit, articleID) {
			var url = baseURLr + subreddit + '/comments/' + articleID + '.json';
			return $http.get(url);
		},
		processComments: function(commentBlock) {
			var sorted = [];
			function insertComment(content) {
				var comment = content.data;
				if (comment !== undefined) {
					var nextComment = {};
					nextComment.author = comment.author;
					nextComment.created_utc = comment.created_utc;
					nextComment.gilded = comment.gilded;
					nextComment.author = comment.author;
					if (!comment.score_hidden) {nextComment.score = comment.score;}
					nextComment.body = comment.body;
					nextComment.edited = comment.edited;
					if(comment.replies) {
						nextComment.children = [];
						for (var i = 0; i < comment.replies.data.children.length; i++) {
							nextComment.children.push(insertComment(comment.replies.data.children[i].data));
						}
					}
					return nextComment;
				} 
				
			}
			for (var i = 0; i < commentBlock.data[1].data.children.length; i++) {
				sorted.push(insertComment(commentBlock.data[1].data.children[i]));
			}
			return sorted;
		},
		getUserAbout: function(username) {
			return $http.get(baseURLu + username + "/about.json");
		},
		getUserOverview: function(username) {
			return $http.get(baseURLu + username + "/overview.json");
		}
	};
});