define([
		'vendors/text!tpl/preferences.html',
		'keyboard',
		'preferences/General',
		'preferences/Editor',
		'preferences/Viewer',
		'preferences/Helper',
		'preferences/About',
		'preferences/Twitter'
	], function(html, HotKey, General, Editor, Viewer, Helper, About, Twitter) {

		var gui = require('nw.gui');
		var shell = gui.Shell;

		$('#dialogs').append(html);
		$('.switch').bootstrapSwitch();

		HotKey('defmod-,', function(e) {
			$('._preferences').modal('show');
		});

		var tabGeneral = new General();
		var tabEditor = new Editor();
		var tabViewer = new Viewer();
		var tabHelper = new Helper();
		var tabAbout = new About();

		var sectionTwitter = new Twitter();

		$('#dialogs').find('a').click(function(e) {
			var href = $(e.target).attr('href');
			shell.openExternal(href);
				
			e.preventDefault();
		});
});