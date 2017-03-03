'use strict';

const devicesController = require('../controllers').devices;
const jobsController = require('../controllers').jobs;

module.exports = (app) => {
  app.get('/api', (req, res) => {
    res.status(200).send({ message: 'Welcome to the Midgard API!', });
  });

  app.get('/api/devices', devicesController.list);
  app.put('/api/devices', devicesController.detect);

  app.get('/api/devices/:deviceId', devicesController.get);
  app.put('/api/devices/:deviceId', devicesController.update);
  app.post('/api/devices/:deviceId', devicesController.run);
  app.delete('/api/devices/:deviceId', devicesController.delete);

  app.post('/api/devices/:deviceId/jobs', jobsController.create);
  app.get('/api/devices/:deviceId/jobs', jobsController.list);

  app.get('/api/devices/:deviceId/jobs/:jobId', jobsController.get);
  app.put('/api/devices/:deviceId/jobs/:jobId', jobsController.update);
  app.delete('/api/devices/:deviceId/jobs/:jobId', jobsController.delete);
};
