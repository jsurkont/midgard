const mqtt = require('mqtt');

module.exports = mqtt.connect(process.env.MQTT_URL);
