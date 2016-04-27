var stations_json = require('../test.json');

// ======================================================
var createStations = function(Station, list_stations){
    for (var i = 0; i < list_stations.length; i++) {
        if (list_stations[i].status == "OPEN"){
            delete list_stations[i].status;
            delete list_stations[i].bike_stands;
            delete list_stations[i].availability;
            delete list_stations[i].available_bike_stands;
            delete list_stations[i].banking;
            delete list_stations[i].available_bikes;
            delete list_stations[i].availabilitycode;
            delete list_stations[i].last_update;
            delete list_stations[i].last_update_fme;
            var lat = list_stations[i].lat;
            var lng = list_stations[i].lng;
            list_stations[i].pos = {"lat" : parseFloat(lat), "lng" : parseFloat(lng)};
            delete list_stations[i].lat;
            delete list_stations[i].lng;
            list_stations[i].number = parseInt(list_stations[i].number);
            list_stations[i].nmarrond = parseInt(list_stations[i].nmarrond);
            list_stations[i].bonus = (list_stations[i].bonus == "Oui");
            list_stations[i].gid = parseInt(list_stations[i].gid);
            list_stations[i].altitude = 0;
        } else {
            delete list_stations[i];
        }
    }

    Station.create(list_stations);
    console.log("-- " + list_stations.length + " stations loaded.");

    return list_stations;
};
// ======================================================
var createTrajets = function(Trajet, Station){

    trajets = [];

    Station.find(function(err, all_stations){
        if (err){
            throw err;
        }

        for(var i = 0; i < 500; i++){
            station_rand1 = Math.floor(Math.random() * all_stations.length);
            station_rand2 = Math.floor(Math.random() * all_stations.length);

            trajets.push({
                station_start : all_stations[station_rand1].id,
                station_end : all_stations[station_rand2].id,
                validite_start : new Date(),
                validite_end : new Date(),
                max_number : Math.floor(Math.random() * 10),
                points : Math.floor(Math.random() * 100),
                distance : Math.random() * 20,
                delta_elevation : Math.random() * 50
            });
        }
        Trajet.create(trajets);
        console.log("-- " + trajets.length + " random trajets loaded.");
    });
};
// ======================================================
module.exports = function(app){

    var Station = app.models.Station;
    var Trajet = app.models.Trajet;


    Station.destroyAll(function(err){
        if (err){
            throw err;
        }
        console.log("-- Station table cleared.");

        createStations(Station, stations_json.values);

        Trajet.destroyAll(function(err) {
            if (err) {
                throw err;
            }
            console.log("-- Trajet table cleared.");
            createTrajets(Trajet, Station);
        });
    });

}


