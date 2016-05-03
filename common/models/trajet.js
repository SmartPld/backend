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

    Trajet.disableRemoteMethod('__exists__users', false);
    Trajet.disableRemoteMethod('__link__users', false);
    Trajet.disableRemoteMethod('__destroy__users', false);
    Trajet.disableRemoteMethod('__update__users', false);
    Trajet.disableRemoteMethod('__unlink__users', false);
    Trajet.disableRemoteMethod('__count__users', false);
    Trajet.disableRemoteMethod('__create__users', false);
    Trajet.disableRemoteMethod('__delete__users', false);
    Trajet.disableRemoteMethod('__count__users', false);
    Trajet.disableRemoteMethod('__destroyById__users', false);
    Trajet.disableRemoteMethod('__findById__users', false);
    Trajet.disableRemoteMethod('__get__users', false);
    Trajet.disableRemoteMethod('__updateById__users', false);
    Trajet.disableRemoteMethod('____users', false);

    Trajet.delete = function(id, cb) {

        Utilisateur = app.models.Utilisateur;

        Trajet.findById(id, function(err, trajetFound){
            if(err)
                throw err;
            else {
                if(trajetFound){
                    trajetFound.users(function(err, users){
                        if(err)
                            throw err;
                        else{
                            if(users.length > 0){
                                cb({status:"403", message : "At least one user made this trajet."}, null);
                            } else {
                                Utilisateur.findOne({where : {current_trajetId : trajetFound.id}}, function(err, userFound){
                                    if(err)
                                        throw err;
                                    else if(userFound){
                                        cb({status:"403", message : "At least one user is making this trajet."}, null);
                                    } else {
                                        Trajet.destroyById(trajetFound.id, function (err) {
                                            if(err)
                                                throw err;
                                            else
                                                cb({status:"204", message : "Trajet successfully deleted."}, null);
                                        });
                                    }
                                });
                            }
                        }
                    });
                } else {
                    cb({status:"404", message : "Trajet not found."}, null);
                }
            }
        });
    };

    Trajet.remoteMethod(
        'delete',
        {
            accepts: [
                {arg: 'id', type: 'number'}
            ],
            http: {
                verb: 'delete',
                path: '/:id'
            }
        }
    );

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

            //trajet.validite_end = new Date(trajet.validite_start.getTime() + 3600000);

            /*Trajet.findById(trajet.id, function(err, originalTrajet){
                if(err)
                    throw err;
                else{
                    if(originalTrajet){
                        console.log(trajet);
                        console.log(originalTrajet);
                        if(trajet.nb_station_start != originalTrajet.nb_station_start){

                            next({status : 403, message : "You're not allowed to change nb_station_start."});

                        }else if(trajet.nb_station_end != originalTrajet.nb_station_end){

                            next({status : 403, message : "You're not allowed to change the nb_station_end."});

                        }else if(JSON.stringify(trajet.pos_station_start) != JSON.stringify(originalTrajet.pos_station_start)){

                            next({status : 403, message : "You're not allowed to change the pos_station_start."});

                        } else {

                            next();

                        }
                    } else {
                        next({status : 403, message : "You're not allowed to change the id."});
                    }
                }
            });*/
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
                            trajet.pos_station_start = stationStartFound.pos;
                            trajet.station_end = stationEndFound;
                            trajet.delta_elevation = stationEndFound.altitude - stationStartFound.altitude;
                            var COEFF_POINTS_KM = 5;
                            var COEFF_POINTS_ELEVATION = 2;
                            trajet.points = COEFF_POINTS_KM*(trajet.distance/1000) + COEFF_POINTS_ELEVATION*trajet.delta_elevation;
                            next();
                        } else {
                            next({status : 404, message : "Station number " + trajet.nb_station_end + " does not exists."});
                        }
                    });
                } else {
                    next({status : 404, message : "Station number " + trajet.nb_station_end + " does not exists."});
                }
            });
        }
        // Recherche de la bonne station de depart
        //trajet.station_start = 1;
        //trajet.station_end = 2;

    });
};