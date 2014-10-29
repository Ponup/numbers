
require.config({
	baseUrl: 'js/',
	paths: {
		jquery: 'jquery-1.11.1.min',
		underscore: 'underscore-min',
		handlebars: 'handlebars-v2.0.0'
	}
});

define( function( require ) {
	var gaco = require( 'data/context' ),
		AudioLoader = require( 'scullge/loaders/audio' ),
		ScenesManager = require( 'scullge/scenes/manager' ),
		IntroScene = require( 'scenes/intro' ),
		MainMenuScene = require( 'scenes/mainMenu' ),
		GameScene = require( 'scenes/game' ),
		GameWonScene = require( 'scenes/gameWon' ),
		GameLostScene = require( 'scenes/gameLost' ),
		ScoresScene = require( 'scenes/scores' ),
		OptionsScene = require( 'scenes/options' ),
		introScene = new IntroScene()
	;

	gaco.scenesManager = new ScenesManager();
	gaco.scenesManager.add( introScene );
	gaco.scenesManager.add( new MainMenuScene() );
	gaco.scenesManager.add( new GameScene() );
	gaco.scenesManager.add( new GameWonScene() );
	gaco.scenesManager.add( new GameLostScene() );
	gaco.scenesManager.add( new ScoresScene() );
	gaco.scenesManager.add( new OptionsScene() );
 

	document.addEventListener( 'deviceready', function() {
		var basePath = ( 'Android' === device.platform || 'android' === device.platform ? '/android_asset/www/' : '' );

		if( null === device.uuid )
		{
			// Disable Media object on browser.
//			Media = function() { this.play = this.stop = function() {}; };
		}

		gaco.sounds = {
			bgmusic: new Media( basePath + 'audio/music.mp3' ),
			beep: [
				new Media( basePath + 'audio/beep.mp3' ),
				new Media( basePath + 'audio/beep.mp3' ),
				new Media( basePath + 'audio/beep.mp3' ),
				new Media( basePath + 'audio/beep.mp3' )
			]
		};

		gaco.scenesManager.switchTo( introScene );
	}, false);	
});

