
require( [ 'jquery', 'config', 'snap' ], function( $, config ) {

var bricksConfig = [
	{background:'#ed5564','text-shadow' :'0px -2px 0px #da4652', 'border-bottom' :'solid 3px #da4652'},
	{background:'#48cfae','text-shadow' :'0px -2px 0px #36bc9b', 'border-bottom' :'solid 3px #36bc9b'},
	{background:'#4fc0e8','text-shadow' :'0px -2px 0px #3baeda', 'border-bottom' :'solid 3px #3baeda'},
	{background:'#ffce51','text-shadow' :'0px -2px 0px #f7ba47', 'border-bottom' :'solid 3px #f7ba47'},
	{background:'#ac92ed','text-shadow' :'0px -2px 0px #967bdc', 'border-bottom' :'solid 3px #967bdc'},
	{background:'#a0d469','text-shadow' :'0px -2px 0px #8cc051', 'border-bottom' :'solid 3px #8cc051'},
	{background:'#5d9cec','text-shadow' :'0px -2px 0px #4c89d9', 'border-bottom' :'solid 3px #4c89d9'},
	{background:'#fb6e52','text-shadow' :'0px -2px 0px #e9573e', 'border-bottom' :'solid 3px #e9573e'},
	{background:'#ec87bf','text-shadow' :'0px -2px 0px #d272af', 'border-bottom' :'solid 3px #d272af'},
];



	var gameContext = {
		moves: config.moves,
		score: 0,
	};
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
	    $('#bricks').css({
		width: game_size*game_brick_size,
		height: game_size*game_brick_size
	    });

	    redrawBricks(game_size);
	    bricks();
	    //debug actions
	    // change game color
	    $('#config-theme li').click(function(event) {$('#game').removeClass().addClass($(this).data('config-theme')); });
	    $('#config-size li').click(function(event) {
		new_game_size = $(this).data('config-size');
		$('#bricks').css({
		    width: new_game_size*game_brick_size,
		    height: new_game_size*game_brick_size
		});
		redrawBricks(new_game_size);
	    });

	    function redrawBricks(game_size_var){
		var $bricks = $( document.getElementById( 'bricks' ) );
		$bricks.remove( '.brick' );
		$bricks[0].style.position = 'relative';
		game_size = game_size_var;
		for (var y = 0; y < game_size; y++) {
			for( var x = 0; x < game_size; x++ )
			{
				random = Math.floor((Math.random() * game_max_number) + x);
				var $brick = $( '<div class="brick" data-number="'+random+'"></div>' ),
				    brick = $brick.get( 0 );
				$brick.css( bricksConfig[ random + 1 ] );

				brick.style.position = 'absolute';
				brick.style.left = x * 35 + 'px';
				brick.style.top = y * 35 + 'px';
				$bricks.append( $brick );
			}
		};

		bricks();
	    };

	    $('#moves').text(game_moves);

	    $('.reload').on('click', function(ev) {
		ev.preventDefault();
		location.reload();
	    });

	    function bricks(){
		$('.brick').each(function() {

		    $(this).text($(this).data('number'));

		    $(this).click(function(event) {
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
		 var g = s.g();
		 g.add(lines);
		 g.animate({opacity:0}, 300);
		 g.remove();
	 };
} );

function findBrickByPosition( point ) 
{
	var x = Math.ceil( point[0] / 35 );
	var y = Math.floor( point[1] / 35 );
	var index = parseInt( ( game_size * y ) + x );
	var brick = $( '#bricks').children().eq( index );
	return brick;
}


