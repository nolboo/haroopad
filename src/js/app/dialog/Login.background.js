define([
		'store'
	],
	function(store) {
		var CONSUMER_KEY = "fP70dzvDVYa7OL8dK3bbQ";
		var CONSUMER_SECRET = "7hTnvKWOBZ6wj4HfwnGIhlcQhxWbU9hh6Z1zVpFKWs";

		var request = require('request');
		var qs = require('querystring');

		var Model = Backbone.Model.extend({
			getRequestToken: function() {
				var oauth = { 
					callback: "oob", 
					consumer_key: CONSUMER_KEY,
					consumer_secret: CONSUMER_SECRET
		    }, 
		    url = 'https://api.twitter.com/oauth/request_token';

				request.post({ url: url, oauth: oauth }, function (e, r, body) {
				  var access_token = qs.parse(body);

				  model.set(access_token);
				});
			},

			getPermission: function(pin) {
				var oauth = { 
		  			consumer_key: CONSUMER_KEY, 
		  			consumer_secret: CONSUMER_SECRET, 
		  			token: this.get('oauth_token'), 
		  			verifier: pin
		      };
			  var url = 'https://api.twitter.com/oauth/access_token';

				request.post({ url: url, oauth: oauth }, function (e, r, body) {
					if(body)
			    var perm_token = qs.parse(body);

				  model.set(perm_token);
				  model.set('verifier', pin);

			    model.trigger('success_permission', perm_token);
				});
			},

			save: function() {
				store.set('Twitter', model.toJSON());
			},

			getUserInfo: function() {
				var oauth = { 
						consumer_key: CONSUMER_KEY, 
						consumer_secret: CONSUMER_SECRET, 
						token: this.get('oauth_token'),
		        token_secret: this.get('oauth_token_secret')
		      }, 
		      url = 'https://api.twitter.com/1/users/show.json?', 
		      params = { 
		      	screen_name: this.get('screen_name'), 
		      	user_id: this.get('user_id')
		      };

		    url += qs.stringify(params)

		    request.get({ url: url, oauth: oauth, json: true }, function (e, r, user) {
		      console.log(user)
		    });
			}

		});

		return model = new Model;
});