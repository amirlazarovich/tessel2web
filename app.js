/**
 * Sample code for tessel, web server and a web socket
 *
 * @author Amir Lazarovich
 * @date   2014, Nov 19
 */

// imports    
var router = require('tiny-router');
var ws = require("nodejs-websocket");
var fs = require('fs');
var tessel = require('tessel');

// variables
var webport = 8000;
var socketport = 8001;




function main() {
    setupWeb();
    setupSocket();
    printSettings();
}

function setupWeb() {
    router.use('static', {path: './static'})
          .use('fs', fs) // use onboard file system
          .listen(webport);
}

function setupSocket() {
    ws.createServer(function(conn) {
        console.log("+ new connection");
            
        conn.on("text", function(msg) {
            console.log("> from web: " + msg);
            msg = JSON.parse(msg);

            // set led state
            tessel.led[msg.led].toggle();

            // send ack
            conn.sendText("ack: " + msg.led);
        });
        
        conn.on("close", function(code, reason) {
            console.log("- connection closed");
        });
    }).listen(socketport);
}

function printSettings() {
    console.log("Using:");
    console.log("+ web port: " + webport);
    console.log("+ socket port: " + socketport);
}

// run 
main();
