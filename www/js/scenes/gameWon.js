
define( [ 'jquery', 'scullge/scenes/base', 'text!templates/scenes/gameWon.html', 'data/context' ], function( $, BaseScene, tplHtml, gaco ) {

	function GameWonScene()
	{
		BaseScene.call( this );

		this.setId( 'gameWon' );
		this.setVirtual( true );
	}

	GameWonScene.prototype = new BaseScene();
	GameWonScene.prototype.constructor = GameWonScene;

	GameWonScene.prototype.switchFrom = function( gameScene )
	{
		var game = document.getElementById( 'game' ),
			$canvas = $( document.getElementById( 'canvas' ) );

		game.style.display = 'none';
		$canvas.append( tplHtml );

		document.getElementById( 'totalScore' ).innerHTML = gameScene.gameContext.score;

		gameScene.gameContext.scoreUpdate += gameScene.gameContext.secondsLeft;
		this.updateScore( gameScene.gameContext, 100 );

		var $gameWon = $( document.getElementById( 'gameWon' ) );
		$gameWon.on( 'click', '#gotoMainMenu', function() {
			gaco.scenesManager.switchTo( 'mainMenu' );
		});
		$gameWon.on( 'click', '#replay', function() {
			gaco.scenesManager.switchTo( 'game' );
		});
		$gameWon.on( 'click', '#playNextLevel', function() {
			gameScene.startLevel();
			$gameWon.remove();
			$( game ).fadeIn();
		});

	};

	GameWonScene.prototype.updateScore = function( gameContext, refreshInterval )
	{
		var totalScore = document.getElementById( 'totalScore' );

		if( gameContext.scoreUpdate > 0 )
		{
			var self = this,
			    fasterRefreshInterval = Math.max( 20, refreshInterval * .95 );

			gameContext.scoreUpdate--;
			gameContext.score++;

			totalScore.innerHTML = gameContext.score;

			setTimeout( function() { self.updateScore( gameContext, fasterRefreshInterval ); }, refreshInterval );
		}
		else
		{
			totalScore.style.fontSize = '100px';
			setTimeout( function() { totalScore.style.fontSize = '80px'; }, 300 );
			
		}
	};

	return GameWonScene;
});

