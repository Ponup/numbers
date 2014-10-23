
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

		document.title = 'Numbers menu';
		
		$canvas.empty().append( tplHtml );
		
		var $menuLayer = $( '#menu' );

		$menuLayer.on( 'click', '#startGame', function() {
			gaco.scenesManager.switchTo( 'game' );
		});
		$menuLayer.on( 'click', '#gotoScores', function() {
			gaco.scenesManager.switchTo( 'scores' );
		});
		$menuLayer.on( 'click', '#gotoOptions', function() {
			gaco.scenesManager.switchTo( 'options' );
		});
	};

	return MainMenu;
});

