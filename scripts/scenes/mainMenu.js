
define( [ 'jquery', 'scullge/scenes/base', 'text!templates/scenes/mainMenu.html', 'data/context' ], function( $, BaseScene, tplHtml, gaco ) {

	function MainMenu()
	{
		BaseScene.call( this );

		this.setId( 'mainMenu' );
	}

	MainMenu.prototype = new BaseScene();
	MainMenu.prototype.constructor = MainMenu;

	MainMenu.prototype.switchFrom = function( prevScene )
	{
		var $canvas = $( document.getElementById( 'canvas' ) );
		$canvas.empty().append( tplHtml );

		$( '#startGame' ).on( 'click', function() {
			gaco.scenesManager.switchTo( 'game' );
		});
	};

	return MainMenu;
});

