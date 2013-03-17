define([
		'vendors/text!tpl/twitter-oauth.html',
		'keyboard',
		'dialog/Login.background'
	], 
	function(html, HotKey, oAuth) {
		$('#dialogs').append(html);

    var gui = require('nw.gui'),
    		win = gui.Window.get(),
    		login;

		var View = Backbone.View.extend({
			el: '#twitter-oauth-dialog',

			events: {
				'click ._save': 'saveHandler',
				'click ._cancel': 'cancelHandler',
				'click #request_token': 'getRequestToken',
				'click #get_pincode': 'openAuthorize',
				'click #get_cridential': 'getCridential'
			},

			initialize: function() {
				var opt = localStorage.getItem('Twitter');

				HotKey('defmod-ctrl-shift-l', this.show.bind(this));

				if(!opt) {
					oAuth.bind('change:oauth_token', this.completeRequest, this);
					oAuth.bind('success_permission', this.completeAccessCredential, this);	
				}
			},

			getRequestToken: function() {
				oAuth.getRequestToken();
			},

			completeRequest: function() {
				$('#request_token').addClass('disabled');
				$('#request_token span').removeClass('hide');
				$('#pincode').removeAttr('disabled');

				$('#get_pincode').removeClass('disabled');
				$('#get_cridential').removeClass('disabled');
			},

			completeAccessCredential: function(model, data) {
				this.$el.find('._save').removeClass('disabled');

				$('#pincode').attr('disabled', 'disabled');
				$('#get_cridential').addClass('disabled');

				console.log(model)
			},

			openAuthorize: function() {
				var url = 'https://api.twitter.com/oauth/authorize?oauth_token='+ oAuth.get('oauth_token');
				
				login = gui.Window.open(url, {
					width: 500,
					height: 540,
					x: win.x - 500,
					y: win.y,
				  toolbar: false
				});

				$('#get_pincode').addClass('disabled');
				$('#get_pincode span').removeClass('hide');
			},

			getCridential: function() {
				oAuth.getPermission($('#pincode').val());
			},

			show: function() {
				this.$el.modal('show');
			},

			hide: function() {
				this.$el.modal('hide');
			},

			saveHandler: function() {
				this.trigger('save');
				this.hide();
			},

			cancelHandler: function() {
				this.hide();
			}
		});

		return View;
});