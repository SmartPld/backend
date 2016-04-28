module.exports = function(Trajet) {

    var app = require('../../server/server');

    Trajet.disableRemoteMethod("create", true);
    Trajet.disableRemoteMethod("upsert", true);
    Trajet.disableRemoteMethod("updateAll", true);
    Trajet.disableRemoteMethod("deleteById", true);
    Trajet.disableRemoteMethod("updateAttributes", false);
    Trajet.disableRemoteMethod("createChangeStream", true);
    Trajet.disableRemoteMethod("count", true);
    Trajet.disableRemoteMethod("findOne", true);
    Trajet.disableRemoteMethod("exists", true);

    /*Trajet.getter['station_start'] = function() {

        Station = app.models.Station;
        /*Station.find(this.station_start, function(err, stationFound){
            if(err)
                throw err;
            else
                return 1;
        });
    };

    Trajet.getter['station_end'] = function() {

        Station = app.models.Station;
        /*Station.find(this.station_end, function(err, stationFound){
            if(err)
                throw err;
            else
                return 2;
        });
    };*/

    Trajet.observe('before save', function (ctx, next) {
        var trajet = ctx.instance;
        if (trajet) {
            Station = app.models.Station;
            Station.findById(parseInt(trajet.station_start.id), function(err, stationStartFound){
                if(err)
                    throw err;
                else{
                    console.log(stationStartFound);
                    Station.findById(parseInt(trajet.station_end.id), function(err, stationEndFound){
                        if(err)
                            throw err;
                        else {
                            //console.log(stationFound);
                            trajet.station_start = stationStartFound;
                            trajet.station_end = stationEndFound;
                            next();
                        }
                    });
                }
            });
            //trajet.station_start = 1;
            //trajet.station_end = 2;
        }
    });
};
