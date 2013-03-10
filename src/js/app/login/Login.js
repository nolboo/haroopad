define([
		'keyboard'
	], 
	function(HotKey) {

    var gui = require('nw.gui'),
    		win = gui.Window.get(),
    		login;

    HotKey('defmod-ctrl-shift-l', function() {
			login = gui.Window.open('login.html', {
				width: 400,
				height: 400,
				x: win.x - 400,
				y: win.y,
			  toolbar: true
			});
    });
});