module.exports = function(Trajet) {

    var app = require('../../server/server');

    //Trajet.disableRemoteMethod("create", true);
    Trajet.disableRemoteMethod("upsert", true);
    Trajet.disableRemoteMethod("updateAll", true);
    Trajet.disableRemoteMethod("deleteById", true);
    //Trajet.disableRemoteMethod("updateAttributes", false);
    Trajet.disableRemoteMethod("createChangeStream", true);
    Trajet.disableRemoteMethod("count", true);
    Trajet.disableRemoteMethod("findOne", true);
    Trajet.disableRemoteMethod("exists", true);

    Trajet.observe('before save', function (ctx, next) {

        /*console.log('----------------------- instance');
        console.log(ctx.instance);
        console.log('----------------------- current instance');
        console.log(ctx.currentInstance);*/

        Station = app.models.Station;
        Trajet = app.models.Trajet;

        if(!ctx.isNewInstance) {
            // On recup le trajet
            var trajet = ctx.currentInstance || ctx.instance;

            trajet.validite_start = new Date();
            trajet.validite_end = new Date(trajet.validite_start.getTime() + 3600000);

            next();
        } else {
            // On recup le trajet
            var trajet = ctx.instance;

            Station.findOne({where: {number: trajet.nb_station_start}}, function (err, stationStartFound) {
                if (err)
                    throw err;
                else if (stationStartFound) {
                    // Recherche de la bonne station d'arrivee
                    Station.findOne({where: {number: trajet.nb_station_end}}, function (err, stationEndFound) {
                        if (err)
                            throw err;
                        else if (stationEndFound) {
                            trajet.station_start = stationStartFound;
                            trajet.station_end = stationEndFound;
                            trajet.validite_start = new Date();
                            trajet.validite_end = new Date(trajet.validite_start.getTime() + 3600000);
                            next();
                        } else {
                            var errTrajet = new Error("Trajet number " + trajet.nb_station_end + " does not exists.");
                            next(errTrajet);
                        }
                    });
                } else {
                    var errTrajet = new Error("Trajet number " + trajet.nb_station_start + " does not exists.");
                    next(errTrajet);
                }
            });
        }
        // Recherche de la bonne station de depart
        //trajet.station_start = 1;
        //trajet.station_end = 2;

    });
};