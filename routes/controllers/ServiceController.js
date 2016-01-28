var async = require('async');
var formidable = require('formidable');
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
                moveFile(files.service_icon, function (err, newFile){
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

function moveFile(file, callback){
    fs.readFile(file.path, function (err, data){
        var directory = __dirname + '/../../public/images/';
        var newFilePath = directory + file.name;
        var newFile = '/images/' + file.name;
        if(!fs.existsSync(directory)){
            fs.mkdirSync(directory);
        }
        fs.writeFile(newFilePath, data, function (err){
            if(err){
                callback(err, null);
            }else{
                callback(null, newFile);
            }
        });
    });
}
