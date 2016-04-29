module.exports = function(Trajet) {

    var app = require('../../server/server');

    //Trajet.disableRemoteMethod("create", true);
    Trajet.disableRemoteMethod("upsert", true);
    Trajet.disableRemoteMethod("updateAll", true);
    Trajet.disableRemoteMethod("deleteById", true);
    Trajet.disableRemoteMethod("updateAttributes", false);
    Trajet.disableRemoteMethod("createChangeStream", true);
    Trajet.disableRemoteMethod("count", true);
    Trajet.disableRemoteMethod("findOne", true);
    Trajet.disableRemoteMethod("exists", true);


    Trajet.observe('before save', function (ctx, next) {
        var trajet = ctx.instance;
        if (trajet) {
            Station = app.models.Station;
            console.log(trajet.station_start.number);
            console.log(trajet.station_end.number);
            Station.findOne({where: {number : trajet.station_start.number}}, function(err, stationStartFound){
                if(err)
                    throw err;
                else if(stationStartFound){
                    Station.findOne({where: {number : trajet.station_end.number}}, function(err, stationEndFound){
                        if(err)
                            throw err;
                        else if(stationEndFound){
                            trajet.station_start = stationStartFound;
                            trajet.station_end = stationEndFound;
                            trajet.validite_start = new Date();
                            trajet.validite_end = new Date(trajet.validite_start.getTime() + 3600000);
                            next();
                        } else {
                            var errTrajet = new Error("Trajet number " + trajet.station_end.number + " does not exists.");
                            next(errTrajet);
                        }
                    });
                } else {
                    var errTrajet = new Error("Trajet number " + trajet.station_start.number + " does not exists.");
                    next(errTrajet);
                }
            });
            //trajet.station_start = 1;
            //trajet.station_end = 2;
        }
    });
};
