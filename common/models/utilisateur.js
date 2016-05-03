module.exports = function(Utilisateur) {

    var app = require('../../server/server');
    var loopback = require('loopback');

    /*
     To erase the ACLs set for User ( base Class ) and apply those in config
     https://github.com/strongloop/loopback/issues/559
     */
    Utilisateur.settings.acls.length = 0;

    //Utilisateur.disableRemoteMethod("create", true);
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

    Utilisateur.disableRemoteMethod('__get__current_trajet', false);

    Utilisateur.disableRemoteMethod('__exists__history', false);
    Utilisateur.disableRemoteMethod('__link__history', false);
    Utilisateur.disableRemoteMethod('__destroy__history', false);
    Utilisateur.disableRemoteMethod('__update__history', false);
    Utilisateur.disableRemoteMethod('__unlink__history', false);
    Utilisateur.disableRemoteMethod('__count__history', false);
    Utilisateur.disableRemoteMethod('__create__history', false);
    Utilisateur.disableRemoteMethod('__delete__history', false);
    Utilisateur.disableRemoteMethod('__count__history', false);
    Utilisateur.disableRemoteMethod('__destroyById__history', false);
    Utilisateur.disableRemoteMethod('__findById__history', false);
    //Utilisateur.disableRemoteMethod('__get__history', false);
    Utilisateur.disableRemoteMethod('__updateById__history', false);
    Utilisateur.disableRemoteMethod('____history', false);


    Utilisateur.accepttrajet = function(user, trajet, cb) {

        var Trajet = app.models.Trajet;

        var ctx = loopback.getCurrentContext();
        var currentUser = ctx && ctx.get('currentUser');

        if(currentUser) {
            if(currentUser.id == user) {
        
                Utilisateur.findById(user, function(err, userFound) {
                    if(err)
                        throw err;
                    else{
                        if(userFound){
                            userFound.current_trajet(function AssignUserToTrajet (err,current_trajet){
                                if(err)
                                    throw err;
                               else{
                                   if (userFound.en_trajet){
                                        cb("User is already assigned to a task.",null);
                                   }else{
                                        Trajet.findById(trajet, function(err, trajetFound){
                                            if(err)
                                                throw err;
                                            else{
                                                if(trajetFound){
                                                    if (trajetFound.max_number < 1){
                                                        cb("Trajet Found is not available anymore.",null);
                                                    } else {
                                                        userFound.current_trajet(trajetFound);
                                                        userFound.en_trajet = true;
                                                        userFound.save(function(err,obj){if (err){ throw err }});
                                                        trajetFound.max_number -= 1;
                                                        trajetFound.save(function(err,obj){if (err){ throw err }});

                                                        userFound.trajet = trajetFound;
                                                        cb(err,userFound);
                                                    }
                                                }else {
                                                    cb("Trajet not found.",null);
                                                }
                                            }
                                        });
                                    }
                                }
                            });
                        }else {
                            cb("User not found.",null);
                        }
                    }
                });

            } else {
                cb({status:"403", message : "You are not allowed to perform this action."}, null);
            }
        } else {
            cb({status:"401", message : "You must be authenticated."}, null);
        }
    };

    Utilisateur.validetrajet = function(user, cb) {

        var Trajet = app.models.Trajet;
        var UtilisateurTrajet = app.models.utilisateurtrajet;

        var ctx = loopback.getCurrentContext();
        var currentUser = ctx && ctx.get('currentUser');

        if(currentUser) {
            if(currentUser.id == user) {

                Utilisateur.findById(user, function(err, userFound) {
                    if(err)
                        throw err;
                    else{
                        if(userFound){
                            userFound.current_trajet(function(err,current_trajet){
                                if(err)
                                    throw err;
                                else{
                                    if (!userFound.en_trajet) {
                                        cb("No task to validate.", null);
                                    }else{
                                        /*userFound.history.add(current_trajet.id, function (err) {
                                            if (err) throw err;
                                        });*/
                                        UtilisateurTrajet.create({
                                            date_validation : new Date(),
                                            utilisateurId : userFound.id,
                                            trajetId : current_trajet.id
                                        }, function(err, utilisateurtrajet){
                                            if(err)
                                                throw err;
                                        });
                                        userFound.points += current_trajet.points;
                                        userFound.distance_totale_parcourue += current_trajet.distance;
                                        userFound.en_trajet = false;
                                        userFound.save(function(err,userModified){
                                            if (err){ throw err;}
                                            else {
                                                delete userModified.current_trajetId;
                                                cb(err, userModified);
                                            }
                                        });
                                    }
                                }
                            });
                        } else {
                            cb("User not found.",null);
                        }
                    }
                });

            } else {
                cb({status:"403", message : "You are not allowed to perform this action."}, null);
            }
        } else {
            cb({status:"401", message : "You must be authenticated."}, null);
        }
    };

    Utilisateur.currenttrajet = function(user, cb) {

        var Utilisateur = app.models.Utilisateur;

        var ctx = loopback.getCurrentContext();
        var currentUser = ctx && ctx.get('currentUser');

        if(currentUser) {
            if(currentUser.id == user) {
                Utilisateur.findById(user, function (err, userFound) {
                    if (err)
                        throw err;
                    else {
                        if (userFound) {
                            userFound.current_trajet(function (err, current_trajet) {
                                if (current_trajet && userFound.en_trajet) {
                                    cb(err, current_trajet);
                                } else {
                                    cb("No current trajet.", null);
                                }
                            });
                        } else {
                            cb("User not found.", null);
                        }
                    }
                });
            } else {
                cb({status:"403", message : "You are not allowed to perform this action."}, null);
            }
        } else {
            cb({status:"401", message : "You must be authenticated."}, null);
        }
    };

    Utilisateur.findwithid = function(user, cb) {

        var ctx = loopback.getCurrentContext();
        var currentUser = ctx && ctx.get('currentUser');

        if(currentUser) {
            if(currentUser.id == user) {
                Utilisateur.findById(user, function (err, userFound) {
                    if (err)
                        throw err;
                    else {
                        if (userFound) {
                            if(currentUser.en_trajet){
                                userFound.current_trajet(function(err, trajetFound){
                                    userFound.trajet = trajetFound;
                                    cb(err, userFound);
                                });
                            } else {
                                cb(err, userFound);
                            }
                        } else {
                            cb("User not found.", null);
                        }
                    }
                });
            } else {
                cb({status:"403", message : "You are not allowed to perform this action."}, null);
            }
        } else {
            cb({status:"401", message : "You must be authenticated."}, null);
        }

    };

    Utilisateur.remoteMethod(
        'accepttrajet',
        {
            accepts: [
                {arg: 'user', type: 'number'},
                {arg: 'trajet', type: 'number'}
            ],
            returns: {arg: 'utilisateur', type: 'Utilisateur'},
            http: {
                verb: 'post',
                path: '/:user/accepttrajet/:trajet'
            }
        }
    );
    Utilisateur.remoteMethod(
        'validetrajet',
        {
            accepts: [
                {arg: 'user', type: 'number'}
            ],
            returns: {arg: 'utilisateur', type: 'utilisateur'},
            http: {
                verb: 'post',
                path: '/:user/validetrajet'
            }
        }
    );
    Utilisateur.remoteMethod(
        'currenttrajet',
        {
            accepts: [
                {arg: 'user', type: 'number'}
            ],
            returns: {arg: 'current_trajet', type: 'Trajet'},
            http: {
                verb: 'get',
                path: '/:user/currenttrajet'
            }
        }
    );
    Utilisateur.remoteMethod(
        'findwithid',
        {
            accepts: [
                {arg: 'user', type: 'number'}
            ],
            returns: {arg: 'utilisateur', type: 'Utilisateur'},
            http: {
                verb: 'get',
                path: '/:user'
            }
        }
    );

    Utilisateur.observe('before save', function (ctx, next) {

        if(!ctx.isNewInstance) {

            next();

        } else {
            // On recup le nouvel utilisateur
            var newUser = ctx.instance;

            newUser.points = 0;
            newUser.en_trajet = false;
            newUser.created = new Date();

            next();
        }
    });
};
