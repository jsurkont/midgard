'use strict';

const schedule = require('node-schedule');
const logger = require('winston');

const client = require('./mqtt');
const Job = require('../models/job');

Job.find()
  .populate('device', 'uid')
  .exec((error, jobs) => {
    if (error) logger.error(error);
    else {
      for (let job of jobs) {
        schedule.scheduleJob(
          job._id.toString(),
          job.cron,
          () => client.publish(`${process.env.MQTT_BASE}/${job.device.uid}`, job.action)
        );
      }
    }
  });

module.exports = schedule;
