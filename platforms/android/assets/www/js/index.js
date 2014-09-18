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
var game_width = 3;
var game_height = 3;
var game_level = 1;
var game_max_number = 6;
var game_bricks = 60;


var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);

    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
      //$('#bricks').css('transform','scale(1.5)');
      $('header').animate({top:'0px'}, 200);
      $('footer').animate({bottom:'20px'}, 200);
      $('#bricks').animate({opacity:'1'}, 500);
      $('#moves').text(game_moves);
        app.receivedEvent('deviceready');
        console.log("Corriendo Aplicacion");
        for (var i = 0; i < game_bricks; i++) {
          random = Math.floor((Math.random() * game_max_number) + 1);
          $('#bricks').append('<div class="brick" data-number="'+random+'"></div>')
        };
        $('.brick').each(function() {
          if ( $(this).data('number') == "1")  { $(this).css({background:'#666d78',color :'#424b52'}) ;}
          if ( $(this).data('number') == "2")  { $(this).css({background:'#48cfae',color :'#36bc9b'}) ;}
          if ( $(this).data('number') == "3")  { $(this).css({background:'#f2c40f',color :'#f39a16'}) ;}
          if ( $(this).data('number') == "4")  { $(this).css({background:'#4fc0e8',color :'#3baeda'}) ;}
          if ( $(this).data('number') == "5")  { $(this).css({background:'#ed5564',color :'#da4652'}) ;}
          if ( $(this).data('number') == "6")  { $(this).css({background:'#ac92ed',color :'#967bdc'}) ;}
             $(this).text($(this).data('number'));
             $(this).click(function(event) {
                  $(this).addClass('clicked');

                  $(this).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',  $(this).hide('fast') );

                    console.log("hiciste clic en el " + $(this).data('number'));
                    $('#moves').text(--game_moves);
                    $('#points').text(game_points++);
                    $('#bar-points').css('width',game_points*30);
               });
        });


    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
    }
};
