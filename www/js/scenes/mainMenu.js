
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
		var canvas = document.getElementById( 'canvas' );

		document.title = 'Numbers menu';

		canvas.innerHTML = tplHtml;

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

		if( 'undefined' !== typeof( device ) && null !== device.uuid )
		{
			this.tryToShare();
		}
	};

	MainMenu.prototype.tryToShare = function()
	{
		var self = this,
		    vias = [ 'com.apple.social.twitter', 'twitter' ],
		    viasLen = vias.length,
		    message = 'I am playing @Ponup Numbers!',
		    i = 0;

		for( ; i < viasLen; i++ )
		{
			this.tryToShareVia( message, vias[ i ] );
		}
	};

	MainMenu.prototype.tryToShareVia = function( message, via )
	{
		var $share = $( document.getElementById( 'share' ) ),
			$options = $( document.getElementById( 'options' ) );

		window.plugins.socialsharing.canShareVia( via, message, null, null, null,
			function() {
				$options.on( 'click', '#share', function() {
					window.plugins.socialsharing.shareVia( via, message, null, null, null, function() {}, function( error ) { console.warning( error ); } );
				});

				$share.parent( 'li' )[0].style.display = 'inline-block';
			},
			function( error ) {
				console.error( error );
			}
		);
	};

	return MainMenu;
});

