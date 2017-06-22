# reTHINK-LWM2M
This module uses the [lwm2m-node-lib](https://github.com/telefonicaid/lwm2m-node-lib/)-module by Telefonica to provide a lwm2m-server with MongoDB backend for the hotel use-case scenario.

Devices and rooms can be initialised with a configuration-object (example in test/config.js).
When started the module will listen for new devices and store information on registration-state, observed values and correlating timestamps from device-objects.
The server comes with a HTTP-Interface which provides access to its LWM2M clients supporting `READ` and `WRITE`.

## Setup
The application requires NodeJS version 4.4.1 or greater. This is usually not shipped with common linux distributions such as Ubuntu. Therefore I recommend using [Node Version Manager (nvm)](https://github.com/creationix/nvm) to install the latest stable version.

Also a MongoDB-server is required for the module to store data. On Ubuntu you can install it like so:
```bash
sudo apt-get install mongodb
```

To install the remaining dependencies run npm in the application directory:
```bash
npm install
```
If you want to use the http-interface please provide ssl-certificates and set the file paths in the configuration.

## Run Server
To start the server run
```bash
npm start
```
Once started run 'help' to get a list of available commands.

You can reset the database:
```bash
npm run reset
```
After a reset the server will initialize the database from the config presets.

###HTTP-interface
The HTTP-interface supports 'POST'. At this stage you can query information about a specific room or a specific device or write information (actuate).

####Examples with CURL:

*Note: The curl-flag '--insecure' is needed if you are using an untrusted certificate.*

#####Reading:
Get all data for room 'room1':
```bash
curl --insecure https://localhost:8000 --data '{"mode": "read", "room": "room1"}'
```
Get all data for device 'myRaspberry':
```bash
curl --insecure https://localhost:8000 --data '{"mode": "read", "device": "myRaspberry"}'
```
Get all room-data available:
```bash
curl --insecure https://localhost:8000 --data '{"mode": "read", "room": null}'

```

#####Writing:
Turn on the light with ID 1 connected to device 'myRaspberry':
```bash
curl https://localhost:8000 --insecure --data '{"mode": "write", "deviceName": "myRaspberry", "objectType": "light", "objectId": "1", "resourceType": "isOn", "value": "true"}'
```

#####Reply schema:
A JSON-object in this format will be returned:
```json
{
    "data": {},
    "error": {}
}
```
Data contains the requested data-set. Error contains the error message or 'null' if no error.