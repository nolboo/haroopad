define([
		'vendors/text!tpl/twitter-oauth.html',
		'keyboard',
		'dialog/Login.twitter'
	], 
	function(html, HotKey, twitter) {
		$('#dialogs').append(html);

		var View = Backbone.View.extend({
			el: '#twitter-oauth-dialog',

			events: {
				'click ._save': 'saveHandler',
				'click ._cancel': 'cancelHandler',
				'click #request_token': 'getRequestToken'
			},

			initialize: function() {
				var opt = localStorage.getItem('Twitter');

				HotKey('defmod-ctrl-shift-l', this.show.bind(this));

				if(!opt) {
					twitter.bind('twitter_success', this.onSuccess, this);	
					twitter.bind('twitter_verified', this.onVerified, this);	
					twitter.bind('twitter_authorized', this.onAuthorized, this);	
				}
			},

			getRequestToken: function() {
				twitter.login();
			},

			onSuccess: function() {
				this.$el.find('._save').removeClass('disabled');
				this.$el.find('.bar-success').css({width: '100%'});

				twitter.success();
			},

			onVerified: function() {
				this.$el.find('.bar-success').css({width: '40%'});
			},

			onAuthorized: function() {
				this.$el.find('.bar-success').css({width: '80%'});
			},

			show: function() {
				this.$el.modal('show');
			},

			hide: function() {
				this.$el.modal('hide');
			},

			saveHandler: function() {
				this.trigger('save');
				twitter.save();
				this.hide();
			},

			cancelHandler: function() {
				this.hide();
			}
		});

		return View;
});