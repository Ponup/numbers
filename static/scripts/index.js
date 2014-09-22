
require( [ 'jquery', 'config' ], function( $, config ) {

	var game_moves = config.moves;
	// var game_goal = 20;
	var game_points = config.points;
	// var game_seconds = 20;
	// var game_width = 320;
	// var game_height = 320;
	// var game_level = 1;
	var game_max_number = config.max_number;
	var game_bricks = config.bricks;
	var game_brick_size = config.brick_size;


	$(function() {




	    // animaciones de inicio
	    $('header').animate({top:'0px'}, 400);
	    $('footer').delay(500).animate({bottom:'0px'}, 400);
	    $('#bricks').delay(1000).animate({opacity:'1'}, 1000);
	    $('#plus').delay(1500).animate({bottom:'15px'}, 1000);
	    $('#debug').delay(2700).animate({right:'20px',opacity:1}, 1000);

	    game_size = $('#game').data('size');
	    // setea el tamaño de la cuadricula y el tamaño de los bricks
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
		//$('#game').removeClass().addClass($(this).data('config-size'));
		new_game_size = $(this).data('config-size');
		$('#bricks').css({
		    width: new_game_size*game_brick_size,
		    height: new_game_size*game_brick_size
		});
		console.log(new_game_size);
		redrawBricks(new_game_size);
	    });

	    // agrega una cantidad (game_bricks=60) del div "brick" y le asigna un numero random entre el 1 y el (game_max_number=6)
	    // for (var i = 0; i < game_bricks; i++) {
	    //   random = Math.floor((Math.random() * game_max_number) + 1);
	    //   $('#bricks').append('<div class="brick" data-number="'+random+'"></div>')
	    // };

	    function redrawBricks(game_size_var){
		$('#bricks').text('');
		console.log(game_size);
		game_size = game_size_var;
		for (var y = 0; y < game_size; y++) {
		    console.log('col'+y);
		    $('#bricks').append('<div class="brick-col brick-col-'+(y+1)+'"></div>');
		};

		for (var i = 0; i < game_size; i++) {
		    for (var e = 0; e < game_bricks; e++) {
			random = Math.floor((Math.random() * game_max_number) + 1);
			  $('.brick-col-'+(i+1)).append('<div class="brick" data-number="'+random+'"></div>');
			  console.log('col:'+i+' brick:'+e);
			};
		};
		bricks();
	    };

	    // carga de variables en el campo MOVES
	    $('#moves').text(game_moves);

	    // agrega accion de actualizar la pagina en el boton de jugar de nuevo
	    $('.reload').on('click', function(event) {
		event.preventDefault();
		location.reload();
	    });

	    function bricks(){
		$('.brick').each(function() {

		    // codigo horrible, por cada brick asigna un fondo y un color de acuerdo al numero... .. mejorar
		    if ( $(this).data('number') == "1")  { $(this).css({background:'#ed5564','text-shadow' :'0px -2px 0px #da4652', 'border-bottom' :'solid 3px #da4652'}) ;}
		    if ( $(this).data('number') == "2")  { $(this).css({background:'#48cfae','text-shadow' :'0px -2px 0px #36bc9b', 'border-bottom' :'solid 3px #36bc9b'}) ;}
		    if ( $(this).data('number') == "3")  { $(this).css({background:'#4fc0e8','text-shadow' :'0px -2px 0px #3baeda', 'border-bottom' :'solid 3px #3baeda'}) ;}
		    if ( $(this).data('number') == "4")  { $(this).css({background:'#ffce51','text-shadow' :'0px -2px 0px #f7ba47', 'border-bottom' :'solid 3px #f7ba47'}) ;}
		    if ( $(this).data('number') == "5")  { $(this).css({background:'#ac92ed','text-shadow' :'0px -2px 0px #967bdc', 'border-bottom' :'solid 3px #967bdc'}) ;}
		    if ( $(this).data('number') == "6")  { $(this).css({background:'#a0d469','text-shadow' :'0px -2px 0px #8cc051', 'border-bottom' :'solid 3px #8cc051'}) ;}
		    if ( $(this).data('number') == "7")  { $(this).css({background:'#5d9cec','text-shadow' :'0px -2px 0px #4c89d9', 'border-bottom' :'solid 3px #4c89d9'}) ;}
		    if ( $(this).data('number') == "8")  { $(this).css({background:'#fb6e52','text-shadow' :'0px -2px 0px #e9573e', 'border-bottom' :'solid 3px #e9573e'}) ;}
		    if ( $(this).data('number') == "9")  { $(this).css({background:'#ec87bf','text-shadow' :'0px -2px 0px #d272af', 'border-bottom' :'solid 3px #d272af'}) ;}
		    if ( $(this).data('number') == "10")  { $(this).css({background:'#40474e','text-shadow' :'0px -2px 0px #363c42','border-bottom' :'solid 3px #363c42'}) ;}

		    // asigna como texto del div al valor del data-number
		    $(this).text($(this).data('number'));

		    // acciones a ejecutar al hacer click en los bricks
		    $(this).click(function(event) {
			// codigo para ejecutar la animacion "puntos-hey" (en el div de puntos de la parte inferior, cada vez que se hace click
			//(hay que limpiar esto, buscar una mejor manera de reproducir una animacion css cada vez que se hace clic)
			$('#points').removeClass('puntos-hey');
			setTimeout(function(){$('#points').addClass('puntos-hey')} , 1);

			// si se llegan a los 10 puntos aparece la ventana "#modal" con clase ".win"
			if(game_points>5550){
			    $('#modal').addClass('win');
			    $('#modal').animate({right:'0%'}, 200);
			}

			// codigo para ejecutar la animacion sobre el brick cada vez que se hace clic.
			$(this).fadeOut('fast');
			game_points=game_points+100;
			// control de variables
			$('#moves').text(--game_moves);

			$('#points').text(game_points++);
			// control de la barra de puntos
			$('#bar-points').css('width',"+=25"+'%');
			});
		    });

		};
	});

} );
