
define( function( require ) {
	var $ = require( 'jquery' ),
		_ = require( 'underscore' ),
		BaseScene = require( 'scullge/scenes/base' ),
		tplHtml = require( 'text!templates/scenes/game.html' ),
		gaco = require( 'data/context' ),
		config = require( 'config' ),
		Snap = require( 'snap' ),
		Brick = require( 'bricks' );
	
	function GameScene()
	{
		BaseScene.call( this );

		this.setId( 'game' );
	}

	GameScene.prototype = new BaseScene();
	GameScene.prototype.constructor = GameScene;

	GameScene.prototype.switchFrom = function( prevScene )
	{
		document.title = 'Numbers playing...';

		var $canvas = $( document.getElementById( 'canvas' ) );
		$canvas.empty().append( tplHtml );
		
		this.gameContext = {
			currentTotal: 0,
			score: 0,
		};
		this.bricksData = null;
		this.gridSize = 1;
		this.goalNumber = null;
		this.isDrawing = false;
		this.lastPoint = null;
		this.lines = [];

		var self = this;

		this.bricksOverlay = Snap( '#bricksOverlay' );
		this.bricksLayer = document.getElementById( 'bricks' );

		var $bricksLayer = $( this.bricksLayer );

		$bricksLayer.on( 'mousedown', function( ev ) {
			self.startDrawing( ev.pageX, ev.pageY );
		} );
		$bricksLayer.on( 'touchstart', function( ev ) {
			self.startDrawing( ev.originalEvent.touches[0].pageX, ev.originalEvent.touches[0].pageY );
		} );		

		$bricksLayer.on( 'mousemove', function( ev ) {
			self.continueDrawing( ev.pageX, ev.pageY );
		} );
		$bricksLayer.on( 'touchmove', function( ev ) {
			self.continueDrawing( ev.originalEvent.touches[0].pageX, ev.originalEvent.touches[0].pageY );
		} );

		$bricksLayer.on( 'mouseup touchend', function( ev ) {
			 self.isDrawing = false;
			 self.lastPoint = null;
			 var lineGroup = self.bricksOverlay.g();
			 lineGroup.add( self.lines );
			 lineGroup.animate({ opacity: 0 }, 300 );
			 lineGroup.remove();
		} );

		this.startLevel();
		this.showElements();
	};

	GameScene.prototype.startDrawing = function( pageX, pageY ) {
		this.isDrawing = true;
		var x = pageX - this.bricksLayer.offsetLeft,
			y = pageY - this.bricksLayer.offsetTop;
		this.lastPoint = [ x, y ];			
	};

	GameScene.prototype.continueDrawing = function( pageX, pageY ) {
		if( false === this.isDrawing ) {
			return;
		}
		var x = pageX - this.bricksLayer.offsetLeft,
			y = pageY - this.bricksLayer.offsetTop;
		var l = this.bricksOverlay.line( this.lastPoint[0], this.lastPoint[1], x, y );
		l.attr( {
			fill:"#ff0000",
			stroke:"#0000ff",
			strokeWidth: 5 
		});
		this.lines.push( l );
		this.lastPoint = [ x, y ];
		var currentBrick = this.findBrickByPosition( this.lastPoint );
		if( null !== currentBrick && false === currentBrick.counted )
		{
			this.gameContext.currentTotal += currentBrick.getValue();
			currentBrick.counted = true;
			currentBrick.remove();

			this.gameContext.score += 1;
			$( '.game-context-score' ).html( this.gameContext.score );

			if( this.gameContext.currentTotal === this.goalNumber )
			{
				this.isDrawing = false;
				this.lastPoint = null;

				gaco.scenesManager.switchTo( 'gameWon' );
			}
			else if( this.gameContext.currentTotal > this.goalNumber )
			{
				gaco.scenesManager.switchTo( 'gameLost' );
			}
		}
	};

	GameScene.prototype.findBrickByPosition = function( point ) 
	{
		var x = Math.ceil( point[0] / config.brickSize ),
		    y = Math.floor( point[1] / config.brickSize ),
		    index = parseInt( ( this.gridSize * y ) + x );

		if( index > -1 && index <= this.bricksData.length )
		{
			return this.bricksData[ index - 1 ];
		}

		return null;
	};

	GameScene.prototype.drawGrid = function( gridSize )
	{
		var $bricks = $( document.getElementById( 'bricks' ) );
		$bricks.css({
			width: gridSize * config.brickSize,
			height: gridSize * config.brickSize
		});

		$('#bricks .brick').remove();
		$bricks.remove( '.brick' );
		$bricks[0].style.position = 'relative';

		for( var i = 0; i < this.bricksData.length; i++ )
		{
			var brick = this.bricksData[ i ];
			var brickNode = brick.toHtmlNode();
			$bricks.append( brickNode );
		}
	};

	GameScene.prototype.calculateGoalNumber = function( bricksData )
	{
		var numberOfBricks = bricksData.length,
			numberOfBricksNeeded = parseInt( numberOfBricks * 0.2 ),
			bricksAvailable = _.range( numberOfBricks ),
			bricksAvailable = _.shuffle( bricksAvailable ),
			bricksIndexes = bricksAvailable.slice( 0, numberOfBricksNeeded ),
			goalNumber = 0,
			i = 0,
			brickIndex = null;
		for(; i < bricksIndexes.length; i++ )
		{
			brickIndex = bricksIndexes[ i ];
			goalNumber += bricksData[ brickIndex ].getValue();
		}
		return Math.max( 1, goalNumber );
	};

	GameScene.prototype.initializeBricksData = function( gridSize )
	{
		var bricksData = [],
		    brickIndex = 0,
		    y = 0;

		for( ; y < gridSize; y++ )
		{
			for( var x = 0; x < gridSize; x++ )
			{
				var randomValue = Math.floor( ( Math.random() * config.max_number ) + x );

				var brick = new Brick();
				brick.setIndex( brickIndex++ );
				brick.setGridLocation( x, y );
				brick.setValue( randomValue );

				bricksData.push( brick );
			}
		}

		return bricksData;
	};

	GameScene.prototype.showElements = function()
	{
		$('header').animate({top:'0px'}, 400);
		$('footer').delay(500).animate({bottom:'0px'}, 400);
		$('#bricks').delay(1000).animate({opacity:'1'}, 1000);
	};

	GameScene.prototype.startLevel = function()
	{
		this.gridSize++;
		this.gridSize = Math.min( 7, this.gridSize );

		this.bricksData = this.initializeBricksData( this.gridSize );
		this.gameContext.currentTotal = 0;
		this.goalNumber = this.calculateGoalNumber( this.bricksData );

		this.drawGrid( this.gridSize );

		$( '#bricks svg' ).empty();
		$( '#goalNumber' ).html( this.goalNumber );
	};

	return GameScene;
});

