
define( function( require ) {
	var $ = require( 'jquery' ),
		BaseScene = require( 'scullge/scenes/base' ),
		tplHtml = require( 'text!templates/scenes/gameLost.html' ),
		gaco = require( 'data/context' ),
		rankingModel = require( 'data/ranking' );

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

		var self = this;

		$canvas.on( 'click', '#gotoMainMenu', function() {
			self.saveScore( prevScene );
			gaco.scenesManager.switchTo( 'mainMenu' );
		});
		$canvas.on( 'click', '#replay', function() {
			self.saveScore( prevScene );
			gaco.scenesManager.switchTo( 'game' );
		});
	};

	GameLostScene.prototype.saveScore = function( prevScene )
	{
		rankingModel.saveScore({ player: 'Anonymous', score: prevScene.gameContext.score, recordTime: Date.now() });
	};

	return GameLostScene;
});

