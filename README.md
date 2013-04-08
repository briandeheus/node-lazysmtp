# LazySMTP
Your new favorite module for receiving mail. And nothing more. Nothing less.

## How to install
Run `npm install lazysmtp`, or alternatively clone this repo, or alternatively fork then clone, or alternatively view raw file, or alternatively hire an underpaid illegal worker to install it, or alternatively party hard.
 
**WARNING**: Partying hard might not lead to expected results, including but not limited to lazysmtp not working and noise complaints from your neighbors)
 
## How to use
### Mail(host, debug)
* **host**: Host for the server. (e.g. 127.0.0.1, "localhost", "example.com")
* **debug**: Boolean for outputting debug logs to stdout.

Instantiate a new Mail class. Has one method that allows you to start the server

#### methods
* start( *port* ) - Starts the server. *Port* defaults to 25. (Default SMTP port)

#### events
* mail

    The most important one. Fires when mail an e-mail has been received. Returns the entire e-mail as a string. (Including headers)

* connectionIncoming

    Fires whenever a connection is made to the server on your designated port by a client. Contains an object with client information.

* connectionClosed

    Fires whenever a connection to the server is closed. Contains an object with client information.


##Example:

```javascript
var Mail = require("lazysmtp").Mail;
var mail = new Mail("example.com", false);
mail.start();

mail.on("mail", function(email) {

    //Pass it on to a parser. Or don't. I don't care.
    parseThe(email);

});

mail.on("connectionIncoming", function(client) {
    console.log("Connection from: " + client.address + " on port " + client.port);
}):
```


## License
MIT License.
