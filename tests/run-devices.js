'use strict';

const process = require('process');
require('dotenv').config();

const devices = require('./devices');

devices.createActuator();
devices.createSensor();

process.on('SIGINT', function() {
    process.exit();
});
