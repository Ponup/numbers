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
        app.receivedEvent('deviceready');
        $.each($('.brick'), function(index, val) {
             $('this').html = $('this').data('number');
        });
        $(document).keydown(keyHandler);
        setInterval( "gameLoop()", 1000);
        function drawBlock(x, y) {
            var block = $("<div class='brick'></div>").css('top', (17 - x) * 20).css('left', y * 20);
            $('#bricks').append(block);
        }
        function clearBlocks() {
            $('.brick').remove();
        }
        var verticalPosition = 18;
        var horizontalPosition = 5;
         
        function gameLoop() {
            verticalPosition--;
            clearBlocks();
            drawBlock(verticalPosition, horizontalPosition);
        }
        const keyCodeMoveLeft = 100;
        const keyCodeMoveRight = 102;
        const keyCodeMoveDown = 98;
         
        function keyHandler(keyEvent) {
         
            if(keyEvent.keyCode === keyCodeMoveLeft) {
                horizontalPosition--;
            }
         
            if(keyEvent.keyCode === keyCodeMoveRight) {
                horizontalPosition++;
            }
            
            if(keyEvent.keyCode === keyCodeMoveDown) {
                verticalPosition--;
            }
            
            clearBlocks();
            drawBlock(verticalPosition, horizontalPosition);
        }
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};
