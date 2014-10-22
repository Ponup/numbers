
define( [ 'jquery', 'scullge/scenes/base', 'text!templates/scenes/intro.html', 'data/context' ], function( $, BaseScene, tplHtml, gaco ) {

	function GameOverScene()
	{
		BaseScene.call( this );

		this.setId( 'gameOver' );
	}

	GameOverScene.prototype = new BaseScene();
	GameOverScene.prototype.constructor = GameOverScene;

	GameOverScene.prototype.switchFrom = function( prevScene )
	{
		alert( 'You lose!' );
		gaco.scenesManager.switchTo( 'mainMenu' );
	};

	return GameOverScene;
});

