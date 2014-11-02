
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

	GameLostScene.prototype.switchFrom = function( gameScene )
	{
		var self = this;
		
		document.body.insertAdjacentHTML( 'beforeend', tplHtml );

		document.getElementById( 'totalScore' ).innerHTML = gameScene.gameContext.score;

		var $gameLost = $( document.getElementById( 'gameLost' ) );
		$gameLost.on( 'click', '#gotoMainMenu', function() {
			self.saveScore( gameScene );
			gaco.scenesManager.switchTo( 'mainMenu' );
		});
		$gameLost.on( 'click', '#replay', function() {
			self.saveScore( gameScene );
			gaco.scenesManager.switchTo( 'game' );
		});
	};

	GameLostScene.prototype.saveScore = function( gameScene )
	{
		rankingModel.saveScore({
			player: 'Anonymous',
			score: gameScene.gameContext.score,
			recordTime: Date.now(),
			level: ( gameScene.gameContext.level + 1 ),
		});
	};

	return GameLostScene;
});

