
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

	var numLoads = 0,
		mediaLoaded = function() {
		if( 2 === ++numLoads )
		{
			gaco.scenesManager.switchTo( introScene );
		}
	},
		mediaError = function( ev ) { alert( ev ); };

	gaco.scenesManager = new ScenesManager();
	gaco.scenesManager.add( introScene );
	gaco.scenesManager.add( new MainMenuScene() );
	gaco.scenesManager.add( new GameScene() );
	gaco.scenesManager.add( new GameWonScene() );
	gaco.scenesManager.add( new GameLostScene() );
	gaco.scenesManager.add( new ScoresScene() );
	gaco.scenesManager.add( new OptionsScene() );
 
	var basePath = 'file:///android_asset/www/';

	document.addEventListener( 'deviceready', function() {
		gaco.bgmusic = new Media( basePath + 'audio/music.mp3', mediaLoaded, mediaError );
		gaco.beep = new Media( basePath + 'audio/beep.mp3', mediaLoaded, mediaError );
	});	
});

