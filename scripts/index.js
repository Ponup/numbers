
require( [ 'jquery', 'config', 'snap', 'bricks', 'scullge/utils/arrays' ], function( $, config, snap, Brick, Arrays ) {

	function range( min, max ) {
		var numbers = [];
		for( var i = min; i < max; i++ ) numbers.push( i );
		return numbers;
	}

	var gameContext = {
		currentTotal: 0,
       	};
	var bricksData = [];
	var levelIndicator = config.points;
	var gridSize = 5;

	$('header').animate({top:'0px'}, 400);
	$('footer').delay(500).animate({bottom:'0px'}, 400);
	$('#bricks').delay(1000).animate({opacity:'1'}, 1000);
	$('#plus').delay(1500).animate({bottom:'15px'}, 1000);
	$('#debug').delay(2700).animate({right:'20px',opacity:1}, 1000);

	drawGrid( gridSize );
	var goalNumber = calculateGoalNumber( bricksData );
	$( '#goalNumber' ).html( 'Goal number: ' + goalNumber );
	bindEvents();

	function calculateGoalNumber( bricksData )
	{
		var numberOfBricks = bricksData.length,
			numberOfBricksNeeded = parseInt( numberOfBricks * 0.2 ),
			bricksAvailable = range( 0, numberOfBricks - 1 ),
			bricksAvailable = Arrays.shuffle( bricksAvailable ),
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
	}

	$('#config-theme li').click(function( ev ) {$('#game').removeClass().addClass($(this).data('config-theme')); });

	function drawGrid( gridSize ) {
		var $bricks = $( document.getElementById( 'bricks' ) );
		var brickIndex = 0;
		$bricks.css({
			width: gridSize * config.brick_size,
			height: gridSize * config.brick_size
		});

		$bricks.remove( '.brick' );
		$bricks[0].style.position = 'relative';
		for (var y = 0; y < gridSize; y++) {
			for( var x = 0; x < gridSize; x++ )
			{
				var randomValue = Math.floor( ( Math.random() * config.max_number ) + x );
				var brick = new Brick();
				brick.setIndex( brickIndex++ );
				brick.setGridLocation( x, y );
				brick.setValue( randomValue );
				bricksData.push( brick );

				var brickNode = brick.toHtmlNode();
				$bricks.append( brickNode );
			}
		};
	}


	$('.reload').on('click', function(ev) {
		ev.preventDefault();
		location.reload();
	});

	function bindEvents()
	{
		$('.brick').click(function( ev )
		{
			$('#points').removeClass('puntos-hey');
			setTimeout(function(){$('#points').addClass('puntos-hey')} , 1);

			$(this).fadeOut('fast');
			levelIndicator = levelIndicator+100;

			$('#points').text(levelIndicator++);
			$('#bar-points').css('width',"+=25"+'%');
		});
	};

	var isDrawing = false;
	var lastPoint = null;
	var lines = [];

	var s = Snap( '#bricksOverlay' );
	var bricksOverlay = document.getElementById( 'bricks' );
	
	 bricksOverlay.onmousedown = function( ev ) {
		 isDrawing = true;
		 var x = ev.pageX - bricksOverlay.offsetLeft,
		     y = ev.pageY - bricksOverlay.offsetTop;
		 lastPoint = [ x, y ];
	 };

	 bricksOverlay.onmousemove = function( ev ) {
		 if( false === isDrawing ) {
			 return;
		 }
		 var x = ev.pageX - bricksOverlay.offsetLeft,
		     y = ev.pageY - bricksOverlay.offsetTop;
		var l = s.line( lastPoint[0], lastPoint[1], x, y );
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
			if( gameContext.currentTotal === goalNumber )
			{
				$('#modal').addClass('win');
				$('#modal').animate({right:'0%'}, 200);
			}
			currentBrick.remove();
		}
	 };

	 bricksOverlay.onmouseup = function( ev ) {
		 isDrawing = false;
		 lastPoint = null;
		 var lineGroup = s.g();
		 lineGroup.add(lines);
		 lineGroup.animate({opacity:0}, 300);
		 lineGroup.remove();
	 };

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

} );

