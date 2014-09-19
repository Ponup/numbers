/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var game_moves = 4;
var game_goal = 20;
var game_points = 0;
var game_seconds = 20;
var game_width = 2.6;
var game_height = 2.6;
var game_level = 1;
var game_max_number = 3;
var game_bricks = 60;
var game_brick_size = 60;


$(function() {
    
    // setea el tamaño de la cuadricula y el tamaño de los bricks
    $('#bricks').css({
        width: game_width*100, 
        height: game_height*100
    });

    // agrega una cantidad (game_bricks=60) del div "brick" y le asigna un numero random entre el 1 y el (game_max_number=6)
    for (var i = 0; i < game_bricks; i++) {
      random = Math.floor((Math.random() * game_max_number) + 1);
      $('#bricks').append('<div class="brick" data-number="'+random+'"></div>')
    };

    $('.brick').css({
        width: game_brick_size+'px', 
        height: game_brick_size+'px' 
    });
    //$('#bricks').css('transform', 'scale(1)');



    // animaciones de inicio
    $('header').animate({top:'0px'}, 400);
    $('footer').delay(500).animate({bottom:'30px'}, 400);
    $('#bricks').delay(1000).animate({opacity:'1'}, 1000);

    // carga de variables en el campo MOVES
    $('#moves').text(game_moves);

    // agrega accion de actualizar la pagina en el boton de jugar de nuevo
    $('.reload').on('click', function(event) {
        event.preventDefault();
        location.reload();
    });

    

    $('.brick').each(function() {
        // codigo horrible, por cada brick asigna un fondo y un color de acuerdo al numero... .. mejorar
        if ( $(this).data('number') == "1")  { $(this).css({background:'#666d78',color :'#424b52'}) ;}
        if ( $(this).data('number') == "2")  { $(this).css({background:'#48cfae',color :'#36bc9b'}) ;}
        if ( $(this).data('number') == "3")  { $(this).css({background:'#f2c40f',color :'#f39a16'}) ;}
        if ( $(this).data('number') == "4")  { $(this).css({background:'#4fc0e8',color :'#3baeda'}) ;}
        if ( $(this).data('number') == "5")  { $(this).css({background:'#ed5564',color :'#da4652'}) ;}
        if ( $(this).data('number') == "6")  { $(this).css({background:'#ac92ed',color :'#967bdc'}) ;}

        // asigna como texto del div al valor del data-number
        $(this).text($(this).data('number'));
        
        // acciones a ejecutar al hacer click en los bricks
        $(this).click(function(event) {
            // codigo para ejecutar la animacion "puntos-hey" (en el div de puntos de la parte inferior, cada vez que se hace click
            //(hay que limpiar esto, buscar una mejor manera de reproducir una animacion css cada vez que se hace clic)
            $('#points').removeClass('puntos-hey');
            setTimeout(function(){$('#points').addClass('puntos-hey')} , 1);
            
            // si se llegan a los 10 puntos aparece la ventana "#modal" con clase ".win"
            if(game_points>10){
                $('#modal').addClass('win');
                $('#modal').animate({right:'0%'}, 200);
            }

            // codigo para ejecutar la animacion sobre el brick cada vez que se hace clic. 
            $(this).fadeOut('fast');

            // control de variables 
            $('#moves').text(--game_moves);
            $('#points').text(game_points++);
            // control de la barra de puntos
            $('#bar-points').css('width',"+=25"+'%');
            });
        });


});