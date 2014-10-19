
require.config({
	baseUrl: 'scripts/',
	paths: {
		jquery: 'jquery-1.11.1.min',
		snap: 'snap.svg-min',
		underscore: 'underscore-min'
	},
	urlArgs: 'bust=' + Date.now() // nocache
});

define( function( require ) {
	var gaco = require( 'data/context' ),
		ScenesManager = require( 'scullge/scenes/manager' ),
		IntroScene = require( 'scenes/intro' ),
		MainMenuScene = require( 'scenes/mainMenu' ),
		GameScene = require( 'scenes/game' ),
		GameOverScene = require( 'scenes/gameOver' ),
		ScoresScene = require( 'scenes/scores' ),
		OptionsScene = require( 'scenes/options' )
	;

	var introScene = new IntroScene();

	gaco.scenesManager = new ScenesManager();
	gaco.scenesManager.add( introScene );
	gaco.scenesManager.add( new MainMenuScene() );
	gaco.scenesManager.add( new GameScene() );
	gaco.scenesManager.add( new GameOverScene() );
	gaco.scenesManager.add( new ScoresScene() );
	gaco.scenesManager.add( new OptionsScene() );
	gaco.scenesManager.switchTo( introScene );
});
