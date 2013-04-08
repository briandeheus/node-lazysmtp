var net     = require("net");
var EventEmitter  = require("events").EventEmitter;
var util    = require("util");

var Mail    = function (host, debug) {
    EventEmitter.call(this);
    
    this.debug      = debug;
    this.host       = host;
    var that        = this;

    var server      = net.createServer(function (socket)     {
        
        var data        = "";
        var moreData    = false;
        var client      = socket.remoteAddress + ":" + socket.remotePort;
        
        //Start handshake
        log(that.debug, "Client connected:" + client);
        
        that.emit("connectionIncoming", { client: { address: socket.remoteAddress, port: socket.remotePort }});

        replies.connect(socket);
        
        socket.on("data", function(d) {
            
            log(that.debug, "Received data from client:" + client);
            log(that.debug, d.toString());
            log(that.debug, "End of data from client:" + client);

            //In case we expect more data, for example when an e-mail is very large.
                
            if(moreData === true) {
            
                data += d.toString();
            
            } else {

                data = d.toString();
            
            }
            
            moreData = false;
            
            //What follows is a range of steps from the SMTP handshake.

            if(/^EHLO/i.test(data)) {

                replies.ehlo(socket);
        
            } else if(/^HELO/i.test(data)) {
              
                replies.helo(socket);  
                
            } else if(/^MAIL FROM/i.test(data)) {

                replies.mailFrom(socket);

            } else if(/^RCPT TO/i.test(data)) {

                replies.recipient(socket);

            } else if(/^DATA/i.test(data)) {
            
                replies.data(socket);

            } else if(/^QUIT/i.test(data)) {
          
                replies.quit(socket);  
            
            } else if(/^.\r\n/m.test(data)) {

                replies.end(socket, data);
        
            } else {
               
                //Assume we're receiving more data and that we're not ready to parse yet. 
                moreData = true;

            }

        });

        socket.on("close", function() {
            
            that.emit("connectionClosed", { client: { address: socket.remoteAddress, port: socket.remotePort }} );
            log(that.debug, "Connection closed");

        });

    });

    server.on("error", function(error) {
        
        that.emit("error", error);    
        log(that.debug, "Something went wrong:" + error.code);

    });

    //Functions that take care of the steps in SMTP handshake and actual mail delivery.

    var replies     = {};

    replies.connect = function (socket) {

        send( socket, "220 " + host );     

    }

    replies.helo   = function (socket) {

        send(socket, "250 Ok");

    }

    replies.quit    = function (socket) {

        send(socket, "221 Bye");

    };

    replies.end    = function (socket, data) {

        that.emit("mail", data);
        send(socket, "250 Ok");

    };

    replies.data    = function (socket) {

        send(socket, "354 Start mail input; end with <CRLF>.<CRLF>");

    }

    replies.ehlo    = function (socket) {
    
        send(socket, "250-" + host );
        send(socket, "250 8BITMIME");

    }

    replies.mailFrom    = function (socket) {

        send(socket, "250 Ok");

    }

    replies.recipient   = function (socket) {
      
        send(socket, "250 Ok");

    }

    function send (socket, message) {
        
        log(that.debug, "sending:" + message);
        socket.write(message + "\r\n");

    };

    this.start = function (port) {
        
        log(that.debug, "Starting lazysmtp");
        server.listen(port || 25);

    }

};

util.inherits(Mail, EventEmitter);


function log(debug, message) {
    
    if(debug) {

        util.log(message);
    
    }

}

exports.Mail = Mail;
