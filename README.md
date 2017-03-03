# Midgard

Midgard is a simple RESTful service for controlling IoT devices connected via
the MQTT protocol. It is meant to provide a centralized method to control
multiple devices (for example, in home automation) using a common interface.
Actions can be send to devices instantly or scheduled for execution in the
future. Try [midgard-client](https://github.com/jsurkont/midgard-client) for a
more engaging experience with the service.

Please note that it is a hobby project and work in progress, the application
will substantially change in the future.

## Configuration

To run the service you need to configure connections to a MongoDB server and
an MQTT broker; set the following environmental variables:

- `MONGODB_URL`
- `MQTT_URL`
- `MQTT_BASE` the base topic where all devices are listening
  (for example, `/devices`)

## Adding devices

Midgard will automatically detect new devices that use the `MQTT_BASE` topic.
A device is expect to provide its interface to the network, hence, adding
new devices doesn't require any additional configuration.
See [swarog](https://github.com/jsurkont/swarog) for an example of such device.
