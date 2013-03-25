define([
		'preferences/Login.twitter'
	], 
	function(twitter) {
		var el;

		function login() {
			el.find('._login-state').fadeIn();
			el.find('._logout-state').hide();
		}

		function logout() {
			el.find('._logout-state').fadeIn();
			el.find('._login-state').hide();
		}

		function setScreenName() {
			var name = twitter.get('screen_name');
			el.find('#screen_name').html('<a href="http://twitter.com/'+ name +'">@'+ name +'</a>');
		}

		var View = Backbone.View.extend({
			el: '#section-twitter',

			events: {
				'click #login-twitter': 'loginHandler',
				'click #clear-twitter': 'clearHandler'
			},

			initialize: function() {
				el = $('#section-twitter');

				if(!twitter.get('screen_name')) {
					login();
				} else {
					setScreenName();
					logout();
				}

				twitter.bind('success', function() {
					twitter.success();
					setScreenName();
					logout();
				});

				twitter.bind('clear', function() {
					login();
				});
			},

			loginHandler: function() {
				twitter.login();
			},

			clearHandler: function() {
				twitter.clear();
			}
		});

		return View;
});