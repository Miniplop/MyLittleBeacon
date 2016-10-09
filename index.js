var Beacon = require('./lib/beacon');

'use strict';

const ngrok = require('ngrok');
const tinyURL = require('tinyurl');
const Promise = require('promise');
const express = require('express');
const app = express();
const port = process.env.port || 8200;
const server  = app.listen(port);
const io = require('socket.io').listen(server);

app.use('/view', express.static('viewer'));
app.use('/play', express.static('player'));

var myBeacon = new Beacon();

new Promise(function(resolve, reject){
    // Ngrok connection
    ngrok.connect(port, function (err, url) {
        if(err) {
            error.log("## NGROK : Error gate")
            reject(err)
        }
        if (url) {
            console.log("## NGROK : Gate to " + port + " created")
            resolve(url)
        }
    });
})
.then(url => {
    console.log("## PROMISE : App available on " + url + "/view")
    tinyURL.shorten(url +"/play", function(res) {
        myBeacon.advertiseUrl(res , { name: 'Kevin Beacon' });
        console.log("## INFO : Beacon ready to use !");
    })
})
.catch(err => {
    error.log("## PROMISE : " + err)
})

io.on('connection', function(socket){

	socket.on('player-letter', function(data){
        console.log("## INFO : player typing")
		io.emit('letter', data);
	});

	socket.on('player-ready', function(){
        console.log("## INFO : player connected")
		io.emit('player-ready');
	});

	socket.on('disconnect', function(){
        console.log("## INFO : player disconnected")
		io.emit('player-gone', {});
	});

	socket.on('correct', function(){
        console.log("## INFO : correct")
		io.emit('correct', {});
	});

	socket.on('wrong', function(){
        console.log("## INFO : Wrong")
		io.emit('wrong', {});
	});

	socket.on('game-ended', function(){
        console.log("## INFO : game over")
		io.emit('game-ended');
	});

	socket.on('restart', function(){
        console.log("## INFO : game restart")
		io.emit("restart");
	});

});
