
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

	return GameWonScene;
});

