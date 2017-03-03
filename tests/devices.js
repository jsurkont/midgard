'use strict';

const crypto = require('crypto');
const mqtt = require('mqtt');

const client = mqtt.connect(process.env.MQTT_URL);

function generateUid() {
  return Math.round(Date.now() / 1000).toString(16) +
    crypto.randomBytes(4).toString('hex');
}

function createActuator() {
  const help = `name: Lamp
description:
  Phasellus id consequat augue. Integer ultrices auctor vestibulum.
  Nam pharetra ligula ac posuere varius. Morbi neque velit, laoreet quis erat
  quis, auctor accumsan nibh. Nam vehicula dolor erat, non tempor eros
  pellentesque et. Duis dignissim semper orci nec faucibus. Mauris eget
  dignissim metus, a lobortis nunc.
actions:
- name: on
  description: Turn the light on
- name: off
  description: Turn the light off
- name: brighten
  description: Brighten the light
- name: dim
  description: Dim the light`;
  const deviceId = '5887d4e48772746a';
  const devicePath = `${process.env.MQTT_BASE}/${deviceId}`;
  client.on('connect', function () {
    // subscribe to the base path for all devices
    client.subscribe(process.env.MQTT_BASE);
    // subscribe to the specific path to this device
    client.subscribe(devicePath);
    client.publish(devicePath + '/help', help);
  });
  client.on('message', function (topic, message) {
    // message is Buffer
    const msg = message.toString();
    if (topic.endsWith(`/devices/${deviceId}`)) {
      // message is addressed directly to this device
      console.log(`[${topic}] ${msg}`);
    } else if (/devices[\/]?$/.test(topic)) {
      // message is addressed to all devices
      if (msg === 'detect') {
        client.publish(devicePath + '/help', help);
      }
    }
  });
}

function createSensor() {
  const help = 'name: Simple Sensor\ndescription: This is a simple sensor.';
  const deviceId = '58892c017b810602';
  const devicePath = `${process.env.MQTT_BASE}/${deviceId}`;
  client.on('connect', function () {
    // subscribe to the base path for all devices
    client.subscribe(process.env.MQTT_BASE);
    // subscribe to the specific path to this device
    client.subscribe(devicePath);
    client.publish(devicePath + '/help', help);
  });
  client.on('message', function (topic, message) {
    // message is Buffer
    const msg = message.toString();
    if (topic.endsWith(`/devices/${deviceId}`)) {
      // message is addressed directly to this device
      console.log(`[${topic}] ${msg}`);
    } else if (/devices[\/]?$/.test(topic)) {
      // message is addressed to all devices
      if (msg === 'detect') {
        client.publish(devicePath + '/help', help);
      }
    }
  });
  setInterval(() => client.publish(devicePath + '/log', `${(Math.random() * 20).toFixed(2)}`), 20000);
}

module.exports = {
  generateUid,
  createActuator,
  createSensor,
};
