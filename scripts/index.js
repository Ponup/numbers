
require( [ 'jquery', 'config', 'snap', 'bricks' ], function( $, config, snap, Brick ) {

	var gameContext = {
		moves: config.moves,
		score: 0,
	};
	var bricksData = [];
	var game_moves = config.moves;
	var game_points = config.points;
	var game_max_number = config.max_number;
	var game_bricks = config.bricks;
	var game_brick_size = config.brick_size;

	$('header').animate({top:'0px'}, 400);
	$('footer').delay(500).animate({bottom:'0px'}, 400);
	$('#bricks').delay(1000).animate({opacity:'1'}, 1000);
	$('#plus').delay(1500).animate({bottom:'15px'}, 1000);
	$('#debug').delay(2700).animate({right:'20px',opacity:1}, 1000);

	game_size = $('#game').data('size');
	drawGrid(game_size);
	bindEvents();

	$('#config-theme li').click(function( ev ) {$('#game').removeClass().addClass($(this).data('config-theme')); });

	function drawGrid( gridSize ) {
		var $bricks = $( document.getElementById( 'bricks' ) );
		$bricks.css({
			width: gridSize * game_brick_size,
			height: gridSize * game_brick_size
		});

		$bricks.remove( '.brick' );
		$bricks[0].style.position = 'relative';
		game_size = gridSize;
		for (var y = 0; y < game_size; y++) {
			for( var x = 0; x < game_size; x++ )
			{
				var randomValue = Math.floor( ( Math.random() * game_max_number ) + x );
				var brick = new Brick();
				console.dir(brick);
				brick.setGridLocation( x, y );
				brick.setValue( randomValue );
				bricksData.push( brick );

				var brickNode = brick.toHtmlNode();
				$bricks.append( brickNode );
			}
		};
	    };

	    $('#moves').text(game_moves);

	    $('.reload').on('click', function(ev) {
		ev.preventDefault();
		location.reload();
	    });

	    function bindEvents()
	    {
		$('.brick').each(function() {

		    $(this).click(function( ev ) {
			$('#points').removeClass('puntos-hey');
			setTimeout(function(){$('#points').addClass('puntos-hey')} , 1);

			if(game_points>5550){
			    $('#modal').addClass('win');
			    $('#modal').animate({right:'0%'}, 200);
			}

			$(this).fadeOut('fast');
			game_points=game_points+100;
			$('#moves').text(--game_moves);

			$('#points').text(game_points++);
			$('#bar-points').css('width',"+=25"+'%');
			});
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
		if( null !== currentBrick )
		{
			$( currentBrick ).fadeOut();
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
		    index = parseInt( ( game_size * y ) + x ),
		    brickNode = $( '#bricks').children().eq( index ),
		    brick = bricksData[ index ];

		game_moves += brick.getValue();
		$('#moves').text( game_moves );	

		return brickNode;
	}

} );

