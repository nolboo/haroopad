define([
		'dialog/Save',
		'dialog/Shortcuts',
		'dialog/Login'
	], 
	function(Save, Shortcuts, Login) {

		return {
			save: new Save,
			shortcuts: new Shortcuts,
			login: new Login
		}
});