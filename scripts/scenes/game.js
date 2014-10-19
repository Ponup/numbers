
define( [ 'jquery', 'underscore', 'scullge/scenes/base', 'text!templates/scenes/game.html', 'data/context' ], function( $, _, BaseScene, tplHtml, gaco ) {

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
		
		require( [ 'config', 'snap', 'bricks' ], function( config, snap, Brick ) {

		var gameContext = {
			currentTotal: 0,
			score: 0,
		};
		var bricksData = null;
		var levelIndicator = config.points;
		var gridSize = 1;

		var goalNumber = null;

		var isDrawing = false;
		var lastPoint = null;
		var lines = [];

		var bricksOverlay = Snap( '#bricksOverlay' ),
			bricksLayer = document.getElementById( 'bricks' ),
			$bricksLayer = $( bricksLayer );

		startLevel();
		showElements();

		function showElements()
		{
			$('header').animate({top:'0px'}, 400);
			$('footer').delay(500).animate({bottom:'0px'}, 400);
			$('#bricks').delay(1000).animate({opacity:'1'}, 1000);
		}

		function calculateGoalNumber( bricksData )
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
		}

		function initializeBricksData( gridSize )
		{
			bricksData = [];
			var brickIndex = 0;

			for( var y = 0; y < gridSize; y++ )
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
		}

		function drawGrid( gridSize )
		{
			var $bricks = $( document.getElementById( 'bricks' ) );
			$bricks.css({
				width: gridSize * config.brick_size,
				height: gridSize * config.brick_size
			});

			$('#bricks .brick').remove();
			$bricks.remove( '.brick' );
			$bricks[0].style.position = 'relative';

			for( var i = 0; i < bricksData.length; i++ )
			{
				var brick = bricksData[ i ];
				var brickNode = brick.toHtmlNode();
				$bricks.append( brickNode );
			}
		}

		$('.reload').on( 'click', function( ev ) {
			ev.preventDefault();
			$( '#modal' ).fadeOut();

			startLevel();
		});

		function bindEvents()
		{
			$('.disabled-----brick').click(function( ev )
			{
				$(this).fadeOut('fast');
				levelIndicator = levelIndicator+100;

				$('#points').text(levelIndicator++);
				$('#bar-points').css('width',"+=25"+'%');
			});
		};

		function startDrawing( pageX, pageY ) {
			isDrawing = true;
			var x = pageX - bricksLayer.offsetLeft,
				y = pageY - bricksLayer.offsetTop;
			lastPoint = [ x, y ];			
		}

		$bricksLayer.on( 'mousedown', function( ev ) {
			startDrawing( ev.pageX, ev.pageY );
		} );
		$bricksLayer.on( 'touchstart', function( ev ) {
			startDrawing( ev.originalEvent.touches[0].pageX, ev.originalEvent.touches[0].pageY );
		} );		

		$bricksLayer.on( 'mousemove', function( ev ) {
			continueDrawing( ev.pageX, ev.pageY );
		} );
		$bricksLayer.on( 'touchmove', function( ev ) {
			continueDrawing( ev.originalEvent.touches[0].pageX, ev.originalEvent.touches[0].pageY );
		} );
		
		function continueDrawing( pageX, pageY ) {
			if( false === isDrawing ) {
				return;
			}
			var x = pageX - bricksLayer.offsetLeft,
				y = pageY - bricksLayer.offsetTop;
			var l = bricksOverlay.line( lastPoint[0], lastPoint[1], x, y );
			l.attr( {
				fill:"#ff0000",
				stroke:"#0000ff",
				strokeWidth: 5 
			});
			lines.push( l );
			lastPoint = [ x, y ];
			var currentBrick = findBrickByPosition( lastPoint );
			if( null !== currentBrick && false === currentBrick.counted )
			{
				gameContext.currentTotal += currentBrick.getValue();
				currentBrick.counted = true;
				currentBrick.remove();

				gameContext.score += 1;
				$( '.game-context-score' ).html( gameContext.score );

				if( gameContext.currentTotal === goalNumber )
				{
					isDrawing = false;
					lastPoint = null;

					$( '#modal' ).fadeIn();
				}
				else if( gameContext.currentTotal > goalNumber )
				{
					gaco.scenesManager.switchTo( 'gameOver' );
				}
			}
		}

		$bricksLayer.on( 'mouseup touchend', function( ev ) {
			 isDrawing = false;
			 lastPoint = null;
			 var lineGroup = bricksOverlay.g();
			 lineGroup.add( lines );
			 lineGroup.animate({ opacity: 0 }, 300 );
			 lineGroup.remove();
		} );

		function findBrickByPosition( point ) 
		{
			var x = Math.ceil( point[0] / 35 ),
			    y = Math.floor( point[1] / 35 ),
			    index = parseInt( ( gridSize * y ) + x );

			if( index > -1 && index <= bricksData.length )
			{
				return bricksData[ index - 1 ];
			}

			return null;
		}

		function startLevel()
		{
			gridSize++;
			gridSize = Math.min( 7, gridSize );

			initializeBricksData( gridSize );
			gameContext.currentTotal = 0;
			goalNumber = calculateGoalNumber( bricksData );

			drawGrid( gridSize );
			$( '#bricks svg' ).empty();
			$( '#goalNumber' ).html( goalNumber );

			bindEvents();
		}

		} );
	};

	return GameScene;
});

