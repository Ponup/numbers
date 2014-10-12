
require.config({
	baseUrl: 'scripts/',
	paths: {
		jquery: 'jquery-1.11.1.min',
		snap: 'snap.svg-min',
	}
});

require( [ 'data/context', 'scullge/scenes/manager', 'scenes/intro', 'scenes/mainMenu', 'scenes/game' ], function( gaco, ScenesManager, IntroScene, MainMenuScene, GameScene ) {

	var introScene = new IntroScene();

	gaco.scenesManager = new ScenesManager();
	gaco.scenesManager.add( introScene );
	gaco.scenesManager.add( new MainMenuScene() );
	gaco.scenesManager.add( new GameScene() );
	gaco.scenesManager.switchTo( introScene );

});

