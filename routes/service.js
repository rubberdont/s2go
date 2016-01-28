/**
 * Created by rubberdont on 1/28/16.
 */
var express = require('express');
var router = express.Router();
var ServiceController = require(__dirname + "/controllers/ServiceController");
var auth = require(__dirname + '/controllers/AuthController');

// Get services
router.get('/', auth.requireToken, ServiceController.getServices);

// Create new service
router.post('/createService', ServiceController.createService);

// Update service status
router.put('/updateServiceStatus', auth.requireToken, ServiceController.updateServiceStatus);

// Delete service by Id
router.delete('/deleteServiceById/:id', ServiceController.deleteServiceById);

module.exports = router;