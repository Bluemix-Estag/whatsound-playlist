/**
 * Module dependencies.
 */

var express = require('express');

var app = express();
var cfenv = require('cfenv');
var fs = require('fs');
var PORT = 8080;
var bodyParser = require('body-parser');

// load local VCAP configuration
var vcapLocal = null;
var appEnv = null;
var appEnvOpts = {};

app.use(bodyParser.json());


fs.stat('./vcap-local.json', function (err, stat) {
    if (err && err.code === 'ENOENT') {
        // file does not exist
        console.log('No vcap-local.json');
        initializeAppEnv();
    } else if (err) {
        console.log('Error retrieving local vcap: ', err.code);
    } else {
        vcapLocal = require("./vcap-local.json");
        console.log("Loaded local VCAP", vcapLocal);
        appEnvOpts = {
            vcap: vcapLocal
        };
        initializeAppEnv();
    }
});


// get the app environment from Cloud Foundry, defaulting to local VCAP
function initializeAppEnv() {
    appEnv = cfenv.getAppEnv(appEnvOpts);
    if (appEnv.isLocal) {
        require('dotenv').load();
    }
    if (appEnv.services.cloudantNoSQLDB) {
        initCloudant();
    } else {
        console.error("No Cloudant service exists.");
    }
}


// =====================================
// CLOUDANT SETUP ======================
// =====================================
var dbname = "playlist";
var database;

function initCloudant() {
    var cloudantURL = appEnv.services.cloudantNoSQLDB[0].credentials.url || appEnv.getServiceCreds("whatsound-playlist-cloudantNoSQLDB").url;
    var Cloudant = require('cloudant')({
        url: cloudantURL,
        plugin: 'retry',
        retryAttempts: 10,
        retryTimeout: 500
    });
    // Create the accounts Logs if it doesn't exist
    Cloudant.db.create(dbname, function (err, body) {
        if (err && err.statusCode == 412) {
            console.log("Database already exists: ", dbname);
        } else if (!err) {
            console.log("New database created: ", dbname);
        } else {
            console.log('Cannot create database!');
        }
    });
    database = Cloudant.db.use(dbname);
    // Create/check the document existance
    database.get('ranking', {
        revs_info: true
    }, function (err, doc) {
        if (err) {
            database.insert({
                "tracks": []
            },'ranking',function(err,doc){
                if(!err){
                    console.log(doc);
                }else{
                    console.log(err);
                }
            });
        } else {

        }
    });
}



//INSERT INTO RANKING
app.post('/whatsound/api/v1/playlist/insert', function (req, res) {
    var track = req.body.track;
    // console.log("Received " + JSON.stringify(track));
    database.get('ranking', {
        revs_info: true
    }, function (err, doc) {
        if (err) {
            console.error(err);
        } else {
            var tracks = doc.tracks;
            var existingTrack = false;
            var existingVoter = false;
            var foundTrack;
            
            for (var tr in tracks) {
                if (track.uri.localeCompare(tracks[tr].uri) == 0) {
                    existingTrack = true;
                    foundTrack = tr;
                    for (var vt in tracks[tr].voters) {
                        if (tracks[tr].voters[vt].name.localeCompare(track.voter.name) == 0) {
                            existingVoter = true;
                            res.setHeader('Content-Type', 'application/json');
                            res.status(403).json({
                                message: "Forbidden, already voted.",
                                status: false
                            });
                        }
                    }
                }
            }
            if (!existingTrack) {
                //Insert a new track
                tracks.push({
                    "track_name": track.track_name,
                    "votes": 1,
                    "voters": [track.voter],
                    "uri": track.uri
                });
            } else {
                if (!existingVoter) {
                    tracks[foundTrack].votes += 1;
                    tracks[foundTrack].voters.push(track.voter);

                }
            }
            if (!existingVoter || !existingTrack) {
                doc.tracks = tracks;
                database.insert(doc, 'ranking', function (err, doc) {
                    if (err) {
                        res.setHeader('Content-Type', 'application/json');
                        res.status(400).json({
                            message: "Could not handle the request",
                            status: false
                        });
                    } else {
                        res.setHeader('Content-Type', 'application/json');
                        res.status(200).json({
                            message: "Vote computed correctly",
                            status: true
                        });
                    }
                });
            }
            console.log(tracks);
        }
    });
});

app.get('/whatsound/api/v1/playlist/ranking', function(req,res){
    database.get('ranking', {
        revs_info:true
    },function(err,doc){
        if(err){
            res.setHeader('Content-Type', 'application/json');
            res.status(400).json({message: "Could not handle the request",status: false});
        }else{
            var ranking = [];
            ranking= doc.tracks;
            for(var i=0;i<ranking.length-1;i++){
                var max = i;
                for(var j=i+1;j<ranking.length;j++){
                    if(ranking[j].votes>ranking[max].votes){
                        max = j;
                    }
                }
                if(max != i){
                    var aux = ranking[i];
                    ranking[i] = ranking[max];
                    ranking[max] = aux;
                }
            }
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({ranking,status:true});
        }
    })
});

app.listen(PORT);
console.log("Listening on port " + PORT);