var stations_json = require('../test.json');

module.exports = function(app){

    var Station = app.models.Station;
    
    Station.destroyAll(function(err){
        if (err){
            throw err;
        }
        console.log("-- Station table cleared.");

        var list_stations = stations_json.values;

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
    });
}


