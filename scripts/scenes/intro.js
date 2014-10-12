
define( [ 'jquery', 'scullge/scenes/base', 'text!templates/scenes/intro.html', 'data/context' ], function( $, BaseScene, tplHtml, gaco ) {

	function IntroScene()
	{
		BaseScene.call( this );

		this.setId( 'intro' );
	}

	IntroScene.prototype = new BaseScene();
	IntroScene.prototype.constructor = IntroScene;

	IntroScene.prototype.switchFrom = function( prevScene )
	{
		var $canvas = $( document.getElementById( 'canvas' ) );
		$canvas.empty().append( tplHtml );

		$( 'h1', $canvas ).animate(
			{ opacity: 100 }, 3000,
			function() {
				gaco.scenesManager.switchTo( 'mainMenu' );
		       	} 
		);
	};

	return IntroScene;
});

