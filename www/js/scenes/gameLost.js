
define( [ 'jquery', 'scullge/scenes/base', 'text!templates/scenes/gameLost.html', 'data/context' ], function( $, BaseScene, tplHtml, gaco ) {

	function GameLostScene()
	{
		BaseScene.call( this );

		this.setId( 'gameLost' );
	}

	GameLostScene.prototype = new BaseScene();
	GameLostScene.prototype.constructor = GameLostScene;

	GameLostScene.prototype.switchFrom = function( prevScene )
	{
		var $canvas = $( '#canvas' );
		$canvas.empty().html( tplHtml );
		
		$( '#totalScore' ).html( prevScene.gameContext.score );

		$canvas.on( 'click', '#gotoMainMenu', function() {
			gaco.scenesManager.switchTo( 'mainMenu' );
		});
		$canvas.on( 'click', '#replay', function() {
			gaco.scenesManager.switchTo( 'game' );
		});
	};

	return GameLostScene;
});

