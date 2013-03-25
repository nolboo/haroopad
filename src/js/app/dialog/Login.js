define([
		'vendors/text!tpl/twitter-oauth.html',
		'keyboard',
		'dialog/Login.twitter'
	], 
	function(html, HotKey, twitter) {
		$('#dialogs').append(html);

		var el = $('#twitter-oauth-dialog');

		function message(text) {
			el.find('#twitter_progress_msg').html(text);
		}

		function progress(per) {
			el.find('.bar-info').css({ width: per+'%' });
		}

		function successHandler() {
			message('트위터 인증 완료, 인증을 유지하려면 저장 버튼을 눌러주세요.');

			progress(100);

			el.find('._save').removeAttr('disabled');
			el.find('._clear').removeAttr('disabled');
			el.find('.progress').removeClass('active');
			el.find('.progress .bar').removeClass('bar-info').addClass('bar-success');
		}

		function resetHandler() {
			message('');

			progress(0);
				
			el.find('#request_token').removeAttr('disabled');
			el.find('._save').attr('disabled');
			el.find('._clear').attr('disabled');
			el.find('.progress').addClass('active');
			el.find('.progress .bar').removeClass('bar-success').addClass('bar-info');
		}

		function enable() {
			el.find('#request_token').removeAttr('disabled');
		}

		function show() {
			el.modal('show');
		}

		function hide() {
			el.modal('hide');
		}

		var View = Backbone.View.extend({
			el: '#twitter-oauth-dialog',

			events: {
				'click ._save': 'saveHandler',
				'click ._cancel': 'cancelHandler',
				'click ._clear': 'clearHandler',
				'click #request_token': 'getRequestToken'
			},

			initialize: function() {
				HotKey('defmod-ctrl-shift-l', show);

				if(!twitter.get('screen_name')) {
					enable();

					twitter.bind('twitter_success', this.onSuccess, this);	
					twitter.bind('twitter_verified', this.onVerified, this);	
					twitter.bind('twitter_authorized', this.onAuthorized, this);	
				} else {
					el.find('._clear').removeAttr('disabled');
				}
			},

			getRequestToken: function() {
				twitter.login();
			},

			onSuccess: function() {
				successHandler();

				twitter.success();
			},

			onVerified: function() {
				message('트위터 인증 요청');

				progress(80);
			},

			onAuthorized: function() {
				message('트위터 인증 시작');

				el.find('#request_token').attr('disabled', 'disabled');
				progress(40);
			},

			saveHandler: function() {
				hide();

				el.find('._save').attr('disabled');

				twitter.save();
				this.trigger('save');
			},

			clearHandler: function() {
				resetHandler();

				twitter.clear();
			},

			cancelHandler: function() {
				hide();
			},

			show: show,

			hide: hide
		});

		return View;
});