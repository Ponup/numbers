
define( [ 'jquery', 'scullge/scenes/base', 'text!templates/scenes/scores.html', 'data/context' ], function( $, BaseScene, tplHtml, gaco ) {

	function ScoresScene()
	{
		BaseScene.call( this );

		this.setId( 'scores' );
	}

	ScoresScene.prototype = new BaseScene();
	ScoresScene.prototype.constructor = ScoresScene;

	ScoresScene.prototype.switchFrom = function( prevScene )
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

	return ScoresScene;
});

