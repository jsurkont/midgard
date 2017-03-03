const Job = require('../models/job');
const schedule = require('../services/schedule');
const client = require('../services/mqtt');

function addJobToSchedule(jobId, callback) {
  Job
    .findById(jobId)
    .populate('device')
    .exec((err, job) => {
      schedule.scheduleJob(
        job._id.toString(),
        job.cron,
        () => client.publish(`${process.env.MQTT_BASE}/${job.device.uid}`, job.action)
      );
      if (callback) callback(0, job);
    });
}

module.exports = {
  create(req, res) {
    const job = new Job({
      action: req.body.action,
      cron: req.body.cron,
      device: req.params.deviceId,
    });
    job.save(err => {
      if (err) res.status(400).send(err);
      else addJobToSchedule(job._id, (err, job) => res.status(201).send(job));
    });
  },
  delete(req, res) {
    Job.findByIdAndRemove(req.params.jobId, (err, job) => {
      if (err) res.status(400).send(err);
      else {
        schedule.cancelJob(job._id.toString());
        res.status(200).end();
      }
    });
  },
  get(req, res) {
    Job
      .findById(req.params.jobId)
      .populate('device')
      .exec((err, job) => {
        if (err) res.status(400).send(err);
        else res.status(200).send(job);
      });
  },
  list(req, res) {
    Job
      .find({ device: req.params.deviceId })
      .exec((err, jobs) => {
        if (err) res.status(400).send(err);
        res.status(200).send(jobs);
      });
  },
  update(req, res) {
    Job.findByIdAndUpdate(req.params.jobId, req.body, {new: true}, (err, job) => {
      if (err) res.status(400).send(err);
      else {
        schedule.cancelJob(job._id.toString());
        addJobToSchedule(job._id, (err, job) => res.status(200).send(job));
      }
    });
  },
};
