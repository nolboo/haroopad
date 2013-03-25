define([
		'vendors/text!tpl/twitter-oauth.html',
		'keyboard'
	], 
	function(html, HotKey) {
		//Deprecated

		$('#fields').append(html);

		var View = Backbone.View.extend({
			el: '#fields',

			events: {
			},

			initialize: function() {
    		HotKey('defmod-ctrl-shift-l', function() {});
			}
		}

   //  var gui = require('nw.gui'),
   //  		win = gui.Window.get(),
   //  		login;

   //  HotKey('defmod-ctrl-shift-l', function() {

			// login = gui.Window.open('login.html', {
			// 	width: 400,
			// 	height: 400,
			// 	x: win.x - 400,
			// 	y: win.y,
			//   toolbar: true
			// });
   //  });
});