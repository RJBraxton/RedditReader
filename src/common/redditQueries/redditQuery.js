angular.module( 'redditQuery', [] )

.factory( 'redditQuery', function($http, $cacheFactory, $q, $sce) {

	var postCache = $cacheFactory('posts');
	var commentCache = $cacheFactory('comments');

	//Vars
	var baseURLr = 'http://www.reddit.com/r/';
	var baseURLu = 'http://www.reddit.com/user/';

	//Elias Zamaria - http://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
	function numberWithCommas(x) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

	var rq = {
		searchLinks: function(subreddit) {

			//Have we been to this sub before in this session? If so, use the cache.
			var data = postCache.get(subreddit);

			if (data) {
				//Cache being used. Returning a promise.
				var cachePromise = $q.defer();
				cachePromise.resolve(data.data.data.children);
				return cachePromise.promise;
			} else {
				//Cache not being used.
				var url = baseURLr + subreddit + '/hot.json';
				return $http.get(url).then(function(res) {
					postCache.put(subreddit, res);
					return res.data.data.children;
				});
			}


		}, 
		searchComments: function(subreddit, articleID) {

			var data = commentCache.get(subreddit + articleID);

			if (data) {
				var cachePromise = $q.defer();
				cachePromise.resolve(data);
				return cachePromise.promise;
			} else{
				var url = baseURLr + subreddit + '/comments/' + articleID + '.json';
				return $http.get(url).then(function(res) {
					var results = {
						comments: rq.processComments(res),
						post: res.data[0].data.children[0].data
					};
					return commentCache.put(subreddit + articleID, results);
				});
			}			
		},
		processComments: function(commentBlock) {
			var sorted = [];
			function insertComment(content) {
				var comment = content.data;
				if (comment.body) { //No blank comments
					var nextComment = {};
					nextComment.author = comment.author;
					nextComment.created_utc = moment.utc(comment.created_utc, "X").fromNow();
					nextComment.gilded = comment.gilded;
					nextComment.author = comment.author;
					if (!comment.score_hidden) {nextComment.score = comment.score;}
					nextComment.body = (comment.body_html.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '\"'));
					nextComment.edited = comment.edited;
					if(comment.replies) {
						nextComment.children = [];
						for (var i = 0; i < comment.replies.data.children.length; i++) {
							if (comment.replies.data.children[i].kind !== "more") { //No "more comments"
								nextComment.children.push(insertComment(comment.replies.data.children[i]));
						}
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
	processText: function(content) {
		// content = content.replace(/\*\*/g)
		content = content.replace('&gt;', '>');
		content = content.replace('&lt;', '<');
		return content;
	},
	getUserAbout: function(username) {
		return $http.get(baseURLu + username + "/about.json").then(function(res) {
			res = res.data.data;
			res.comment_karma = numberWithCommas(res.comment_karma);
			res.linkKarma = numberWithCommas(res.link_karma); 
			res.createdSince = moment.utc(res.created_utc, "X").fromNow();
			res.createdDate = moment.utc(res.created_utc, "X").format("MMM Do YYYY");
			return res;
		});
	},
	getUserOverview: function(username) {
		return $http.get(baseURLu + username + "/overview.json").then(function(res) {
			res = res.data.data.children;
			return res;
		});
	}
};
return rq;
});