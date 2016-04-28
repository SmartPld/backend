module.exports = function(Utilisateur) {

    var app = require('../../server/server');

    /*
     To erase the ACLs set for User ( base Class ) and apply those in config
     https://github.com/strongloop/loopback/issues/559
     */
    Utilisateur.settings.acls.length = 0;

    Utilisateur.disableRemoteMethod("create", true);
    Utilisateur.disableRemoteMethod("upsert", true);
    Utilisateur.disableRemoteMethod("updateAll", true);
    Utilisateur.disableRemoteMethod("updateAttributes", false);
    Utilisateur.disableRemoteMethod("createChangeStream", true);

    Utilisateur.disableRemoteMethod("find", true);
    Utilisateur.disableRemoteMethod("findById", true);
    Utilisateur.disableRemoteMethod("findOne", true);

    Utilisateur.disableRemoteMethod("deleteById", true);

    Utilisateur.disableRemoteMethod("confirm", true);
    Utilisateur.disableRemoteMethod("count", true);
    Utilisateur.disableRemoteMethod("exists", true);
    Utilisateur.disableRemoteMethod("resetPassword", true);

    Utilisateur.disableRemoteMethod("resetPassword", true);

    Utilisateur.disableRemoteMethod('__create__accessTokens', false);
    Utilisateur.disableRemoteMethod('__delete__accessTokens', false);
    Utilisateur.disableRemoteMethod('__count__accessTokens', false);
    Utilisateur.disableRemoteMethod('__destroyById__accessTokens', false);
    Utilisateur.disableRemoteMethod('__findById__accessTokens', false);
    Utilisateur.disableRemoteMethod('__get__accessTokens', false);
    Utilisateur.disableRemoteMethod('__updateById__accessTokens', false);

    Utilisateur.disableRemoteMethod('__create__history', false);
    Utilisateur.disableRemoteMethod('__delete__history', false);
    Utilisateur.disableRemoteMethod('__count__history', false);
    Utilisateur.disableRemoteMethod('__destroyById__history', false);
    Utilisateur.disableRemoteMethod('__findById__history', false);
    Utilisateur.disableRemoteMethod('__get__history', false);
    Utilisateur.disableRemoteMethod('__updateById__history', false);

    Utilisateur.accepttrajet = function(user, trajet, cb) {

        var Trajet = app.models.Trajet;
        console.log('a');

        Utilisateur.findById(user, function(err, userFound) {
            if(err)
                throw err;
            else{
                if(userFound){
                    Trajet.findById(trajet, function(err, trajetFound){
                        if(err)
                            throw err;
                        else{
                            if(trajetFound){
                                userFound.current_trajet(trajetFound);
                                userFound.current_trajet(trajetFound.id);
                                userFound.current_trajet({
                                    station_start: 1321,
                                    station_end: 1244,
                                    validite_start: new Date(),
                                    validite_end: new Date(),
                                    max_number: 8,
                                    distance: 3,
                                    delta_elevation: 15,
                                    points: 99
                                });
                                cb(trajetFound);
                            }
                        }
                    });
                }
            }
        });

    };

    Utilisateur.remoteMethod(
        'accepttrajet',
        {
            accepts: [
                {arg: 'user', type: 'number'},
                {arg: 'trajet', type: 'number'}
            ],
            returns: {arg: 'current_trajet', type: 'Trajet'},
            http: {
                verb: 'post',
                path: '/:user/accepttrajet/:trajet'
            }
        }
    );
};
