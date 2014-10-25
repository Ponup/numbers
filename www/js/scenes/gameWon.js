
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
		$( '#game' ).hide();
		var $canvas = $( '#canvas' );
		$canvas.append( tplHtml );

		$( '#totalScore' ).html( gameScene.gameContext.score );

		$canvas.on( 'click', '#gotoMainMenu', function() {
			gaco.scenesManager.switchTo( 'mainMenu' );
		});
		$canvas.on( 'click', '#replay', function() {
			gaco.scenesManager.switchTo( 'game' );
		});
		$canvas.on( 'click', '#playNextLevel', function() {
			$( '#gameWon' ).remove();
			gameScene.startLevel();
			$( '#game' ).fadeIn();
		});

	};

	return GameWonScene;
});

