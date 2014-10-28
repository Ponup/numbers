
define( function( require ) {
	var $ = require( 'jquery' ),
		BaseScene = require( 'scullge/scenes/base' ),
		tplHtml = require( 'text!templates/scenes/scores.html' ),
		gaco = require( 'data/context' ),
		rankingModel = require( 'data/ranking' ),
		Handlebars = require( 'handlebars' )
	;

	function ScoresScene()
	{
		BaseScene.call( this );

		this.setId( 'scores' );
	}

	ScoresScene.prototype = new BaseScene();
	ScoresScene.prototype.constructor = ScoresScene;

	ScoresScene.prototype.switchFrom = function( prevScene )
	{
		var canvas = document.getElementById( 'canvas' );

		canvas.innerHTML = tplHtml;

		var source = document.getElementById( 'templateSource' ).innerHTML;
		var template = Handlebars.compile( source );
		var templateVariables = { scores: rankingModel.getScores() }

		document.getElementById( 'table' ).innerHTML = template( templateVariables );

		$( document.getElementById( 'scores' ) ).on( 'click', '#gotoBack', function() {
			gaco.scenesManager.switchTo( 'mainMenu' );
		});
	};

	return ScoresScene;
});

