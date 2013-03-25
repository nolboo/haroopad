define([
		'store'
	],
	function(store) {
		//Deprecated
		var CONSUMER_KEY = "fP70dzvDVYa7OL8dK3bbQ";
		var CONSUMER_SECRET = "7hTnvKWOBZ6wj4HfwnGIhlcQhxWbU9hh6Z1zVpFKWs";

		var request = require('request');
		var http = require('http');
		var qs = require('querystring');

    var gui = require('nw.gui'),
    		win = gui.Window.get(),
    		loginWin;

		var server, access_token;

		function createServer4Callback() {
			server = http.createServer(function(req, res) {
		  	access_token = qs.parse(req.url.replace('/?', '')) || {};

		  	model.trigger('twitter_verified');

			  res.writeHead(200, {'Content-Type': 'text/plain'});
			  res.end('\n');

			  if(access_token && access_token.oauth_verifier) {
			  	getPermission();
			  } else {
			  	model.trigger('err_credential');
			  }

		  }).listen(1337, '127.0.0.1');
		}

		function destoryServer() {
			server.close();
			server = null;
		}

		function getPermission() {
			var oauth = { 
	  			consumer_key: CONSUMER_KEY, 
	  			consumer_secret: CONSUMER_SECRET, 
	  			token: access_token.oauth_token, 
	  			verifier: access_token.oauth_verifier
	      };
		  var url = 'https://api.twitter.com/oauth/access_token';

			request.post({ url: url, oauth: oauth }, function (e, r, body) {
		    var perm_token = qs.parse(body);

			  model.set(perm_token);
		    model.trigger('twitter_success', perm_token);
			});
		}

		/**
		 * desktop application oauth 
		 * get request token
		 * @return {[type]} [description]
		 */
		function getRequestToken() {
			var oauth = { 
				callback: "http://127.0.0.1:1337", 
				consumer_key: CONSUMER_KEY,
				consumer_secret: CONSUMER_SECRET
	    }, 
	    url = 'https://api.twitter.com/oauth/request_token';

			request.post({ url: url, oauth: oauth }, function (e, r, body) {
			  var req_token = qs.parse(body);
			  	
			  model.trigger('twitter_authorized');

			  createServer4Callback();
						
				loginWin = gui.Window.open('https://api.twitter.com/oauth/authorize?oauth_token='+ req_token.oauth_token, {
					width: 400,
					height: 500,
					x: win.x - 200,
					y: win.y,
				  toolbar: false
				});

			});
		}

		function load(act) {
			var oauth = { 
	  			consumer_key: CONSUMER_KEY, 
	  			consumer_secret: CONSUMER_SECRET, 
	  			token: model.get('oauth_token'), 
	  			token_secret: model.get('oauth_token_secret')
	      };

	    var url = 'https://api.twitter.com/1.1/account/'+ act +'.json';

	    request.get({ url: url, oauth: oauth }, function(err, res, body) {
	    	console.log(body);
	    });
		}

		var Model = Backbone.Model.extend({

			initialize: function() {
				var opt = localStorage.getItem('Twitter');

				this.bind('change', function() {
					store.set('Twitter', this.toJSON());
				});

				if(opt) {
					this.set(JSON.parse(opt));
				} else {
					// this.set(this.defaults);
					// store.set('Twitter', this.toJSON());
				}
			},

			login: function() {
				getRequestToken();
			},

			clear: function() {
				store.remove('Twitter');

				this.clear();
				this.trigger('clear');
			},

			success: function() {
				loginWin.close();

				destoryServer();
			},

			save: function() {
				store.set('Twitter', model.toJSON());
			},

			verify: function() {
				load('verify_credentials')
			}

		});

		return model = new Model;
});