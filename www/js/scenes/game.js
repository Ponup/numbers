
define( function( require ) {
	var $ = require( 'jquery' ),
		_ = require( 'underscore' ),
		BaseScene = require( 'scullge/scenes/base' ),
		tplHtml = require( 'text!templates/scenes/game.html' ),
		gaco = require( 'data/context' ),
		config = require( 'config' ),
		Brick = require( 'bricks' ),
		preferences = require( 'data/preferences' )
	;
	
	function GameScene()
	{
		BaseScene.call( this );

		this.DOUBLE_PI = ( Math.PI * 2 );

		this.setId( 'game' );
	}

	GameScene.prototype = new BaseScene();
	GameScene.prototype.constructor = GameScene;

	GameScene.prototype.switchFrom = function( prevScene )
	{
		document.title = 'Numbers playing...';
		document.body.innerHTML = tplHtml;

		var self = this;

		gaco.sounds.bgmusic.stop();
		
		this.gameContext = {
			level: -1,
			currentTotal: 0,
			score: 0,
			scoreUpdate: 0,
			selection: [],
			requiredBricks: 0.05,
			secondsLeft: 61,
		};
		this.bricksData = null;
		this.goalNumber = null;
		this.isDrawing = false;
		this.timerId = null;
		this.nextOpPending = '+';
		this.paused = false;

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
		this.context.arc( x, y, config.quarterBrickSize, 0, this.DOUBLE_PI, true );
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

		var currentBrick = this.findBrickByPosition( [ x, y ] );
		if( null !== currentBrick && false === currentBrick.counted )
		{
			if( preferences.isSoundEnabled() )
			{
				gaco.sounds.beep[ currentBrick.getIndex() % 4 ].play();
			}
			currentBrick.counted = true;
			currentBrick.remove();

			this.gameContext.selection.push( currentBrick );
		}
	};

	GameScene.prototype.stopDrawing = function()
	{
		this.isDrawing = false;
		this.context.clearRect( 0, 0, this.bricksOverlay.width, this.bricksOverlay.height );

		// Return if the line drawn was not touching bricks.
		if( 0 === this.gameContext.selection.length ) {
			return;
		}

		var i = 0,
		    selectionLength = this.gameContext.selection.length;
		
		this.gameContext.scoreUpdate += selectionLength;
		this.gameContext.currentTotal = this.doMathWithBricks( this.gameContext.currentTotal, this.gameContext.selection, this.nextOpPending );
		if( 'string' === typeof( this.gameContext.selection[ selectionLength - 1 ] ) )
		{
			this.nextOpPending = this.gameContext.selection[ selectionLength - 1 ];
		}
		else
		{
			this.nextOpPending = '+';
		}
		this.gameContext.selection = [];

		var nextScene = null;
		if( this.gameContext.currentTotal === this.goalNumber )
		{
			nextScene = 'gameWon';
		}
		else if( Math.abs( this.gameContext.currentTotal ) > Math.abs( this.goalNumber ) )
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
		var 	bricksContainer = document.getElementById( 'bricks' ),
			l = bricksContainer.offsetLeft,
			w = parseInt( bricksContainer.style.width ),
			t = 0,
			h = parseInt( bricksContainer.style.height );
			xx = point[0] - l,
			yy = point[1],
			x = Math.ceil( xx / config.brickSize ),
			y = Math.floor( yy / config.brickSize ),
			index = parseInt( ( this.gridSize * y ) + x );

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
				console.warn( 'missing index: ' + ( index - 1 ) );
				console.warn( 'bricks len: ' + this.bricksData.length );
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

		bricks.innerHTML = null;
		bricks.style.width = gridWidth + 'px';
		bricks.style.height = gridHeight + 'px';
		bricks.style.position = 'relative';

		// It would be nice to use offsetWidth/offsetHeight,
		// but for some reason was not working as expected all the times.
		var game = document.getElementById( 'game' ),
		    $game = $( game );
		this.bricksOverlay.width = $game.width();
		this.bricksOverlay.height = $game.height();

		var bricksDataLength = this.bricksData.length;
		for( var i = 0; i < bricksDataLength; i++ )
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
			i = 0,
			bricks = [];

		for( ; i < numberOfBricksNeeded; i++ )
		{
			bricks.push( bricksData[ bricksIndexes[ i ] ] );
		}

		return this.doMathWithBricks( 0, bricks );
	};

	GameScene.prototype.doMathWithBricks = function( initialNumber, bricks, nextOpDefault )
	{
		var i = 0,
			bricksLen = bricks.length,
			nextOp = nextOpDefault || '+',
			result = initialNumber;

		for(; i < bricksLen; i++ )
		{
			var value = bricks[ i ].getValue();
			if( 'string' === typeof( value ) )
			{
				nextOp = value;
			}
			else
			{
				switch( nextOp )
				{
				case '+':
					result += value; break;
				case '*':
					result *= value; break;
				case '/':
					// Division by zero returns 0 instead of infinity in this game.
					if( 0 === value )
					{
						result = 0;
					}
					else
					{
						// Truncates all decimal digits.
						result = parseInt( result / value );
					}
					break;
				}
				nextOp = '+';
			}
		}

		return result; // Check for isFinite?
	};

	GameScene.prototype.initializeBricksData = function( gridSize )
	{
		var bricksData = [],
		    brickIndex = 0,
		    y = 0;
		
		var maxNumber = Math.max( 1, ( this.gameContext.level % 10 ) );
		var minNumber = ( this.gameContext.level < 10 ? 0 : -maxNumber );
		var dictionary = _.range( minNumber, maxNumber + 1 );

		if( this.gameContext.level > 19 ) dictionary.push( '*' );
		if( this.gameContext.level > 29 ) dictionary.push( '/' );

		for( ; y < gridSize; y++ )
		{
			for( var x = 0; x < gridSize; x++ )
			{
				var randomValue = _.sample( dictionary );

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
		$( 'footer' ).delay(500).animate({ bottom: '0px' }, 200);
		document.getElementById( 'bricks' ).style.opacity = 1;
	};

	GameScene.prototype.startLevel = function()
	{
		this.gameContext.level++;

		this.gridSize = Math.min( 7, ( this.gameContext.level % 10 ) + 2 );

		this.bricksData = this.initializeBricksData( this.gridSize );

		this.gameContext.selection = [];
		this.gameContext.scoreUpdate = 0;
		this.gameContext.currentTotal = 0;
		this.gameContext.requiredBricks = Math.min( .5, this.gameContext.requiredBricks + 0.01 );
		this.gameContext.secondsLeft = ( 60 - ( ( this.gameContext.level % 10 ) * 3 ) );

		this.goalNumber = this.calculateGoalNumber( this.bricksData );

		this.drawGrid( this.gridSize );

		this.startTimer();

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

		if( null !== this.timerId )
		{
			clearInterval( this.timerId );
		}

		gaco.scenesManager.switchTo( nextScene );
	};

	GameScene.prototype.pause = function()
	{
		clearInterval( this.timerId );
		this.paused = true;
	};

	GameScene.prototype.resume = function()
	{
		if( true === this.paused )
		{
			this.startTimer();
		}
	};

	GameScene.prototype.startTimer = function()
	{
		this.timerId = setInterval( $.proxy( this.timer, this ), 1000 );
	};

	return GameScene;
});

