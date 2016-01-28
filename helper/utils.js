/**
 * Created by root on 1/28/16.
 */
var fs = require('fs');

exports.moveFile = function(file, directory, callback){
    fs.readFile(file.path, function (err, data){
        var destination = __dirname + '/../public/' + directory;
        var newFilePath = destination + '/' + file.name;
        var newFile = '/' + directory + '/' + file.name;
        if(!fs.existsSync(destination)){
            fs.mkdirSync(destination);
        }
        fs.writeFile(newFilePath, data, function (err){
            if(err){
                callback(err, null);
            }else{
                callback(null, newFile);
            }
        });
    });
};