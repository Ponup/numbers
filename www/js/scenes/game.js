
define( function( require ) {
	var $ = require( 'jquery' ),
		_ = require( 'underscore' ),
		BaseScene = require( 'scullge/scenes/base' ),
		tplHtml = require( 'text!templates/scenes/game.html' ),
		gaco = require( 'data/context' ),
		config = require( 'config' ),
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
			selection: [],
			requiredBricks: 0.05,
			secondsLeft: 61,
		};
		this.bricksData = null;
		this.gridSize = 1;
		this.goalNumber = null;
		this.isDrawing = false;
		this.lastPoint = null;
		this.timerId = null;

		var self = this;

		this.bricksOverlay = document.getElementById( 'bricksOverlay' );
		this.context = this.bricksOverlay.getContext( '2d' );

		var $bricksOverlay = $( this.bricksOverlay );

		$bricksOverlay.on( 'touchstart', function( ev ) {
			ev.preventDefault();

			var x = ev.originalEvent.changedTouches[0].clientX,
				y = ev.originalEvent.changedTouches[0].clientY;

			self.startDrawing( x, y );
		} );
		$bricksOverlay.on( 'mousedown', function( ev ) {
			ev.preventDefault();
			self.startDrawing( ev.clientX, ev.clientY );
		} );

		$bricksOverlay.on( 'touchmove', function( ev ) {
			ev.preventDefault();

			var x = ev.originalEvent.changedTouches[0].clientX,
				y = ev.originalEvent.changedTouches[0].clientY;

			self.continueDrawing( x, y );
		} );
		$bricksOverlay.on( 'mousemove', function( ev ) {
			ev.preventDefault();
			self.continueDrawing( ev.clientX, ev.clientY );
		} );

		$bricksOverlay.on( 'mouseup touchend', function( ev ) {
			ev.preventDefault();

			self.stopDrawing();
		} );

		this.startLevel();
		this.showElements();
	};

	GameScene.prototype.startDrawing = function( clientX, clientY )
	{
		this.isDrawing = true;

		this.continueDrawing( clientX, clientY );
	};

	GameScene.prototype.drawCursor = function( x, y )
	{
		this.context.fillStyle = '#5063A7';
		this.context.arc( x, y, ( config.brickSize >> 2 ), 0, Math.PI * 2, true );
		this.context.fill();
		this.context.beginPath();
	};

	GameScene.prototype.continueDrawing = function( clientX, clientY )
	{
		if( false === this.isDrawing ) {
			return;
		}

		var x = clientX,
			y = clientY - document.getElementById( 'gameLayers' ).offsetTop;

		this.drawCursor( x, y );

		this.lastPoint = [ x, y ];

		var currentBrick = this.findBrickByPosition( this.lastPoint );
		if( null !== currentBrick && false === currentBrick.counted )
		{
			currentBrick.counted = true;
			currentBrick.remove();

			this.gameContext.selection.push( currentBrick );
		}
	};

	GameScene.prototype.stopDrawing = function()
	{
		this.isDrawing = false;
		this.lastPoint = null;
		this.context.clearRect( 0, 0, self.bricksOverlay.width, self.bricksOverlay.height );

		// Return if the line drawn was not touching bricks.
		if( 0 === this.gameContext.selection.length ) {
			return;
		}

		for( var i = 0; i < this.gameContext.selection.length; i++ )
		{
			var currentBrick = this.gameContext.selection[ i ];

			this.gameContext.currentTotal += currentBrick.getValue();
			this.gameContext.score += 1;
		}

		this.gameContext.selection = [];

		var nextScene = null;
		if( this.gameContext.currentTotal === this.goalNumber )
		{
			nextScene = 'gameWon';
		}
		else if( this.gameContext.currentTotal > this.goalNumber )
		{
			nextScene = 'gameLost';
		}

		if( null !== nextScene )
		{
			this.endGame( nextScene );
			return;
		}
	};

	GameScene.prototype.findBrickByPosition = function( point ) 
	{
		var 	xx = point[0] - document.getElementById( 'bricks' ).offsetLeft,
			yy = point[1],
			x = Math.ceil( xx / config.brickSize ),
			y = Math.floor( yy / config.brickSize ),
			index = parseInt( ( this.gridSize * y ) + x ),
			bricks = document.getElementById( 'bricks' ),
			l = bricks.offsetLeft,
			w = parseInt( bricks.style.width ),
			t = 0,
			h = parseInt( bricks.style.height );

		if(
			point[0] < l || point[0] > l + w ||
			point[1] < 0 || point[1] > t + h 
		)
		{
			return null;
		}

		if( index > -1 && index <= this.bricksData.length )
		{
			var brick = this.bricksData[ index - 1 ];
			if( 'undefined' === typeof( brick ) ) {
				console.log( 'missing index: ' + ( index - 1 ) );
				console.log( 'bricks len: ' + this.bricksData.length );
				return null;
			}

			return brick;
		}

		return null;
	};

	GameScene.prototype.drawGrid = function( gridSize )
	{
		var bricks = document.getElementById( 'bricks' ),
		    gridWidth = gridSize * config.brickSize,
		    gridHeight = gridSize * config.brickSize;

		bricks.style.width = gridWidth + 'px';
		bricks.style.height = gridHeight + 'px';
		bricks.style.position = 'relative';

		$( '.brick', bricks ).remove();

		var $game = $( '#game' );
		this.bricksOverlay.width = $game.width();
		this.bricksOverlay.height = $game.height();

		for( var i = 0; i < this.bricksData.length; i++ )
		{
			var brick = this.bricksData[ i ];
			var brickNode = brick.toHtmlNode();
			bricks.appendChild( brickNode );
		}
	};

	GameScene.prototype.calculateGoalNumber = function( bricksData )
	{
		var numberOfBricks = bricksData.length,
			numberOfBricksNeeded = Math.max( 1, parseInt( numberOfBricks * this.gameContext.requiredBricks ) ),
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

		return goalNumber;
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
				var randomValue = _.random( 0, config.maxNumber );

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
		$( 'header' ).animate({ top: '0px' }, 200);
		$( 'footer' ).delay(500).animate({ bottom: '0px' }, 200);
		$( document.getElementById( 'bricks' ) ).delay( 1000 ).animate({ opacity: 1 }, 500);
	};

	GameScene.prototype.startLevel = function()
	{
		this.gridSize++;
		this.gridSize = Math.min( 7, this.gridSize );

		this.bricksData = this.initializeBricksData( this.gridSize );

		this.gameContext.selection = [];
		this.gameContext.currentTotal = 0;
		this.gameContext.requiredBricks = Math.min( .5, this.gameContext.requiredBricks + 0.05 );
		this.gameContext.secondsLeft = Math.max( 10, this.gameContext.secondsLeft - 1 );

		this.goalNumber = this.calculateGoalNumber( this.bricksData );

		this.drawGrid( this.gridSize );

		this.timerId = setInterval( $.proxy( this.timer, this ), 1000 );

		this.context.clearRect( 0, 0, this.bricksOverlay.width, this.bricksOverlay.height );

		document.getElementById( 'goalNumber' ).innerHTML = this.goalNumber;
	};

	GameScene.prototype.timer = function()
	{
		this.gameContext.secondsLeft--;
		if( this.gameContext.secondsLeft < 0 )
		{
			this.endGame( 'gameLost' );
			return;
		}

		document.getElementById( 'secondsLeft' ).innerHTML = this.gameContext.secondsLeft;
	};

	GameScene.prototype.endGame = function( nextScene )
	{
		this.isDrawing = false;
		this.lastPoint = null;

		if( null !== this.timerId )
		{
			clearInterval( this.timerId );
		}

		gaco.scenesManager.switchTo( nextScene );
	};

	return GameScene;
});

