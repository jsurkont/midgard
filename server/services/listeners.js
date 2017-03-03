'use strict';

const yaml = require('js-yaml');
const logger = require('winston');

const client = require('./mqtt');
const Device = require('../models/device');

function createDevice(uid, data) {
  Device.findOne({ uid: uid }, (err, device) => {
    if (err) {
      logger.error(err);
    } else {
      if (device) {
        logger.debug(`Device ${device._id} already exists`);
      } else {
        const device = new Device({
          uid: uid,
          data: data.data,
          name: data.name,
          description: data.description,
          actions: data.actions,
        });
        device.save(err => {
          if (err) logger.error(err);
          else logger.debug(`Device ${device._id} created.`);
        });
      }
    }
  });
}

client.on('connect', () => {
  client.subscribe(`${process.env.MQTT_BASE}/#`);
});

client.on('message', (topic, message) => {
  const msg = message.toString();
  const match = (new RegExp(`${process.env.MQTT_BASE}/(\\w+)/?`)).exec(topic);
  if (match) {
    const deviceId = match[1];
    switch (topic.replace(match[0], '')) {
      case '':
        logger.debug(`${new Date} (device: ${deviceId}) (command: ${msg})`);
        break;
      case 'help':
        createDevice(deviceId, yaml.safeLoad(msg));
        break;
      case 'log':
        Device.findOneAndUpdate({ uid: deviceId }, { lastMsg: msg },
          (error, device) => {});
        break;
      default:
        logger.debug(`(Default case) ${topic} ${msg}`);
    }
  } else {
    // Doesn't contain deviceId
    logger.debug(`${new Date} (topic: ${topic}) (msg: ${msg})`)
  }
});
