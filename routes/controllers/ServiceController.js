var async = require('async');
var fs = require('fs');
var Sequelize = require('sequelize');
var Service = require(__dirname + '/../models/services_model');

/**
 * @api {GET} /services
 * @apiName List of services
 * @apiGroup Service
 * @apiDescription List of services
 * @apiSuccess JSONArray "array of services available"
 * @apiError JSON "{error : true/false, message: err msg}"
 * @apiVersion 0.0.1
*/
exports.getServices = function (req, res){
	Service.findAll().then(function (services){
        res.status(200).send(services);
    }).catch(function (err){
        res.status(500).send({error : true, message: err});
    });
};

/**
* @api  {POST} /services/createService
* @apiName Create new service
* @apiGroup Service
* @apiParam {STRING} unique_value
* @apiParam {STRING} service_name
* @apiParam {FILE} service_icon
* @apiSuccess JSON "{error : false, message: Success}"
* @apiError JSON "{error : true, message: err msg}"
* @apiVersion 0.0.1
*/
exports.createService = function (req, res){
    if(!req.files.service_icon){
        return res.status(404).send({error : true, message : "Missing service icon"});
    }

};
