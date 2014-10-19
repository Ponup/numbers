
define( [ 'jquery', 'scullge/scenes/base', 'text!templates/scenes/options.html', 'data/context' ], function( $, BaseScene, tplHtml, gaco ) {

	function OptionsScene()
	{
		BaseScene.call( this );

		this.setId( 'options' );
	}

	OptionsScene.prototype = new BaseScene();
	OptionsScene.prototype.constructor = OptionsScene;

	OptionsScene.prototype.switchFrom = function( prevScene )
	{
		var $canvas = $( document.getElementById( 'canvas' ) );
		$canvas.empty().append( tplHtml );

		$( 'h1', $canvas ).animate(
			{ opacity: 100 }, 1500,
			function() {
				gaco.scenesManager.switchTo( 'mainMenu' );
		       	} 
		);
	};

	return OptionsScene;
});

