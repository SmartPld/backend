var app = require('./server');
var stations_json = require('./data.json');

// ======================================================
var createStations = function(Station, list_stations){

    numbers = [];

    for (var i = 0; i < list_stations.length; i++) {
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
        list_stations[i].open = (list_stations[i].status == "OPEN");
        list_stations[i].gid = parseInt(list_stations[i].gid);
        //list_stations[i].altitude = 0;

        numbers.push(list_stations[i].number);
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
                nb_station_start : numbers[station_rand1],
                nb_station_end : numbers[station_rand2],
                validite_end : new Date((new Date()).getTime()+3600000),
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
var createUsers = function(Utilisateur, Role, RoleMapping){

    Utilisateur.create([
        {username: 'admin', email: 'adming@insa-lyon.fr', password: 'password', 'salt' : 'poiuytreza', points : 0, "distance_totale_parcourue" : 0},
        {username: 'Guigui', email: 'guillaume.kheng@insa-lyon.fr', password: 'password', 'salt' : 'poiuytreza', points : 42, "distance_totale_parcourue" : 15},
        {username: 'Kilian', email: 'kilian.ollivier@insa-lyon.fr', password: 'password', 'salt' : 'poiuytreza', points : 0, "distance_totale_parcourue" : 0}
    ], function(err, users){
        if(err)
            throw err;
        else
        {
            Role.create({
                name: 'admin'
            }, function(err, role) {
                if (err) cb(err);

                //make bob an admin
                role.principals.create({
                    principalType: RoleMapping.Utilisateur,
                    principalId: users[0].id
                }, function(err, principal) {
                    console.log("-- " + users.length + " users loaded.");
                });
            });
        }
    });
};
// ======================================================


var Station = app.models.Station;
var Trajet = app.models.Trajet;
var Utilisateur = app.models.Utilisateur;
var Role = app.models.Role;
var RoleMapping = app.models.RoleMapping;

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

        Utilisateur.destroyAll(function(err) {
            if (err) {
                throw err;
            }
            console.log("-- Users table cleared.");
            createUsers(Utilisateur, Role, RoleMapping);
        });
    });
});