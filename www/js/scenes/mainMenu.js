
define( function( require ) {
	var $ = require( 'jquery' ),
		BaseScene = require( 'scullge/scenes/base' ),
		tplHtml = require( 'text!templates/scenes/mainMenu.html' ),
		gaco = require( 'data/context' ),
		preferences = require( 'data/preferences' );

	function MainMenu()
	{
		BaseScene.call( this );

		this.setId( 'mainMenu' );
	}

	MainMenu.prototype = new BaseScene();
	MainMenu.prototype.constructor = MainMenu;

	MainMenu.prototype.switchFrom = function( prevScene )
	{
		document.title = 'Numbers menu';
		document.body.innerHTML = tplHtml;

		if( preferences.isMusicEnabled() )
		{
			gaco.sounds.bgmusic.play();
		}
		
		var $menuLayer = $( document.getElementById( 'menu' ) );

		$menuLayer.on( 'click', '#startGame', function() {
			gaco.scenesManager.switchTo( 'game' );
		});
		$menuLayer.on( 'click', '#gotoScores', function() {
			gaco.scenesManager.switchTo( 'scores' );
		});
		$menuLayer.on( 'click', '#gotoOptions', function() {
			gaco.scenesManager.switchTo( 'options' );
		});

		window.plugins.socialsharing.available( this.shareIfAvailable );
	};

	MainMenu.prototype.shareIfAvailable = function( isAvailable )
	{
		if( false === isAvailable )
		{
			return;
		}

		var $share = $( document.getElementById( 'share' ) ),
			$options = $( '.actions' );

		$share.removeClass( 'hidden' );

		$options.on( 'click', '#share', function() {
			window.plugins.socialsharing.share( 'Play the @Ponup Numbers game for free in your phone. More info http://www.ponup.com', '@Ponup Numbers' );
		});
	};

	return MainMenu;
});

