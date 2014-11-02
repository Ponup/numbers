
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
		document.body.innerHTML = tplHtml;

		$( 'img', document.body ).animate(
			{ opacity: 100 }, 500,
			function() {
				gaco.scenesManager.switchTo( 'mainMenu' );
		       	} 
		);
	};

	return IntroScene;
});

