'use strict';

const Device = require('../models/device');
const mqttClient = require('../services/mqtt');

module.exports = {
  delete(req, res) {
    // TODO delete associated jobs
    Device.findByIdAndRemove(req.params.deviceId, (err, device) => {
      if (err) res.status(400).send(err);
      else res.status(200).end();
    });
  },
  detect(req, res) {
    mqttClient.publish(process.env.MQTT_BASE, 'detect', err => {
      if (err) res.status(400).send(err);
      else res.status(200).end();
    });
  },
  get(req, res) {
    Device.findById(req.params.deviceId, (err, device) => {
      if (err) res.status(400).send(err);
      else res.status(200).send(device);
    });
  },
  list(req, res) {
    Device.find((err, devices) => {
      if (err) res.status(400).send(err);
      res.status(200).send(devices);
    });
  },
  run(req, res) {
    if (req.body.action) {
      // First translate _id into uid
      Device.findById(req.params.deviceId, (err, device) => {
        if (err) res.status(400).send(err);
        else {
          mqttClient.publish(`${process.env.MQTT_BASE}/${device.uid}`, req.body.action, err => {
            if (err) res.status(400).send(err);
            else res.status(200).end();
          });
        }
      });
    } else res.status(400).send({ error: 'Request body does not contain action' });
  },
  update(req, res) {
    Device.findByIdAndUpdate(req.params.deviceId, req.body, {new: true}, (err, device) => {
      if (err) res.status(400).send(err);
      else res.status(200).send(device);
    });
  },
};
