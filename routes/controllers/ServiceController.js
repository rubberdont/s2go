var async = require('async');
var formidable = require('formidable');
var fs = require('fs');
var Sequelize = require('sequelize');
var Service = require(__dirname + '/../models/services_model');
var util = require(__dirname + '/../../helper/utils');

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
* @apiSuccess JSON "{error : false, service: {new inserted service data}}"
* @apiError JSON "{error : true, message: err msg}"
* @apiVersion 0.0.1
*/
exports.createService = function (req, res){
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var data = fields;
        if (!files.service_icon) {
            return res.status(404).send({error: true, message: "Missing service icon"});
        }
        async.waterfall([
            function (done){
                util.moveFile(files.service_icon, "images", function (err, newFile){
                    done(null, err, newFile);
                });
            }, function (err, newFile, done){
                if(err){
                    done({error: true, message: "Failed to upload file"}, null);
                }else{
                    data.service_icon = newFile;
                    Service.create(data)
                        .then(function (service) {
                            done(null, {error: false, service: service});
                        })
                        .catch(function (err) {
                            done({error: true, message: err}, null);
                        });
                }
            }
        ], function (err, success){
            if(err){
               return res.status(404).send(err);
            }
            if(success){
                res.status(200).send(success);
            }
        });
    });
};

/**
 * @api  {PUT} /services/updateServiceStatus
 * @apiName Update service status
 * @apiGroup Service
 * @apiParam {STRING} service_id
 * @apiParam {STRING} status "Change status to HIDE, VISIBLE"
 * @apiSuccess JSON "{error : false, message: Update Successful}"
 * @apiError JSON "{error : true, message: Update Failed}"
 * @apiVersion 0.0.1
 */
exports.updateServiceStatus = function (req, res){
    if(req.body.service_id == undefined || req.body.service_id.trim().length == 0){
        return res.status(404).send({error : true, message: "Missing service_id"});
    }
    if(req.body.status == undefined || req.body.status.trim().length == 0){
        return res.status(404).send({error : true, message: "Missing status"});
    }
    if(req.body.status != "HIDE" && req.body.status != "VISIBLE"){
        return res.status(400).send({error : true, message: "status should be HIDE or VISIBLE"});
    }
    Service.update(req.body, {
        where : {
            id: req.body.service_id
        }
    }).then(function (result){
            if (result > 0) {
                res.status(200).send({
                    error: false,
                    message: "Update success"
                });
            } else {
                res.status(404).send({
                    error: true,
                    message: "Record not found"
                });
            }
        })
        .catch(function (err){
            console.log(err);
            res.status(404).send({
                error : true,
                message : err
            });
        }).done();
};

/**
 * @api  {DELETE} /services/deleteServiceById/:id
 * @apiName Delete service
 * @apiGroup Service
 * @apiParam {STRING} id ID of service
 * @apiSuccess JSON "{error : false, message: Delete Successful}"
 * @apiError JSON "{error : true, message: Delete Failed}"
 * @apiVersion 0.0.1
 */
exports.deleteServiceById = function (req, res){
    Service.destroy({
        where: {
            id : req.params.id
        }
    }).then(function (result){
        if(result > 0) {
            res.status(200).send({error : false, message : "Delete Successful"});
        }else{
            res.status(404).send({error : true, message : "Delete failed"});
        }
    }).catch(function (err){
        res.status(200).send({error : true, message : err});
    });
};
