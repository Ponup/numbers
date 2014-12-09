
define( function( require ) {

	var $ = require( 'jquery' ),
		BaseScene = require( 'scullge/scenes/base' ),
		tplHtml = require( 'text!templates/scenes/options.html' ),
		gaco = require( 'data/context' ),
		preferences = require( 'data/preferences' );

	function OptionsScene()
	{
		BaseScene.call( this );

		this.setId( 'options' );
	}

	OptionsScene.prototype = new BaseScene();
	OptionsScene.prototype.constructor = OptionsScene;

	OptionsScene.prototype.switchFrom = function( prevScene )
	{
		document.title = 'Numbers :: Options';
		document.body.innerHTML = tplHtml;

		document.getElementById( 'soundEnabled' ).className += ( preferences.isSoundEnabled() ? ' setting-on' : ' setting-off' );
		document.getElementById( 'musicEnabled' ).className += ( preferences.isMusicEnabled() ? ' setting-on' : ' setting-off' );

		var $options = $( document.getElementById( 'options' ) );
		$options.on( 'click', '.setting', function() {
			var propertyValue = ( this.className.indexOf( 'setting-on' ) !== -1 ),
				newPropertyValue = !propertyValue;

			if( 'musicEnabled' === this.id && false === newPropertyValue )
			{
				gaco.sounds.bgmusic.stop();
			}

			preferences.setBooleanProperty( this.id, !propertyValue );

			$( this ).toggleClass( 'setting-on setting-off' );
		});
		$options.on( 'click', '#backButton', function() {
			gaco.scenesManager.switchTo( 'mainMenu' );
		});
	};

	return OptionsScene;
});

