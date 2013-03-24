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
				'click ._clear': 'clearHandler',
				'click #request_token': 'getRequestToken'
			},

			initialize: function() {
				var opt = localStorage.getItem('Twitter');

				if(!opt) {
					HotKey('defmod-ctrl-shift-l', this.show.bind(this));

					twitter.bind('twitter_success', this.onSuccess, this);	
					twitter.bind('twitter_verified', this.onVerified, this);	
					twitter.bind('twitter_authorized', this.onAuthorized, this);	
				}
			},

			message: function(text) {
				this.$el.find('#twitter_progress_msg').html(text);
			},

			getRequestToken: function() {
				twitter.login();
			},

			onSuccess: function() {
				this.message('트위터 인증 완료, 인증을 유지하려면 저장 버튼을 눌러주세요.');

				this.$el.find('._save').removeClass('disabled');
				this.$el.find('._clear').removeClass('disabled');
				this.$el.find('.bar-info').css({width: '100%'});
				this.$el.find('.progress').removeClass('active');
				this.$el.find('.progress .bar').removeClass('bar-info').addClass('bar-success');

				twitter.success();
			},

			onVerified: function() {
				this.message('트위터 인증 요청');

				this.$el.find('.bar-info').css({width: '80%'});
			},

			onAuthorized: function() {
				this.message('트위터 인증 시작');

				this.$el.find('#request_token').attr('disabled', 'disabled');
				this.$el.find('.bar-info').css({width: '40%'});
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

			clearHandler: function() {
				this.message('');

				this.$el.find('#request_token').removeAttr('disabled');
				this.$el.find('._save').addClass('disabled');
				this.$el.find('._clear').addClass('disabled');
				this.$el.find('.progress').addClass('active');
				this.$el.find('.progress .bar').removeClass('bar-success').addClass('bar-info');
				this.$el.find('.bar-info').css({width: '0'});
				
				twitter.clear();
			},

			cancelHandler: function() {
				this.hide();
			}
		});

		return View;
});