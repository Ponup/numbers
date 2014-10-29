
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
		var canvas = document.getElementById( 'canvas' );

		document.title = 'Numbers menu';

		canvas.innerHTML = tplHtml;

		gaco.audioLoader.play( 'bgmusic', true );
		
		var $menuLayer = $( document.getElementById( 'menu' ) );

		$menuLayer.on( 'click', '#startGame', function() {
			gaco.scenesManager.switchTo( 'game' );
		});
		$menuLayer.on( 'click', '#gotoScores', function() {
			gaco.scenesManager.switchTo( 'scores' );
		});
		$menuLayer.on( 'click', '#gotoOptions', function() {
			gaco.scenesManager.switchTo( 'options' );
		});

		if( 'undefined' !== typeof( device ) && null !== device.uuid )
		{
			this.tryToShare();
		}
	};

	MainMenu.prototype.tryToShare = function()
	{
		var self = this,
		    vias = [ 'com.apple.social.twitter', 'twitter' ],
		    message = 'I am playing Ponup Numbers!';

		$.each( vias, function( index, via ) {
			self.tryToShareVia( message, via );
		});
	};

	MainMenu.prototype.tryToShareVia = function( message, via )
	{
		var $share = $( document.getElementById( 'share' ) ),
			$options = $( document.getElementById( 'options' ) );

		window.plugins.socialsharing.canShareVia( via, message, null, null, null,
			function() {
				$options.on( 'click', '#share', function() {
					window.plugins.socialsharing.shareVia( via, message, null, null, null, function() {}, function( error ) { console.warning( error ); } );
				});

				$share.parent( 'li' )[0].style.display = 'inline-block';
			},
			function( error ) {
				console.error( error );
			}
		);
	};

	return MainMenu;
});

