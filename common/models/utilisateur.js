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
                                    else if (trajetFound.max_number < 1){
                                        cb("Trajet Found is not available anymore.",null);
                                    }
                                    else{
                                        if(trajetFound){
                                            userFound.current_trajet(trajetFound);
                                            userFound.en_trajet = true;
                                            userFound.save(function(err,obj){if (err){ throw err }});
                                            trajetFound.max_number -= 1;
                                            trajetFound.save(function(err,obj){if (err){ throw err }});
                                            
                                            //console.log("OK - Utilisateur associé au trajet : " + string(userFound));
                                            cb(err,trajetFound);
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
    };

    Utilisateur.validetrajet = function(user, cb) {

        var Trajet = app.models.Trajet;

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
                                userFound.history.add(current_trajet.id, function (err) {
                                    if (err) throw err;
                                });
                                userFound.points += current_trajet.points;
                                console.log(userFound);
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
    };

    Utilisateur.currenttrajet = function(user, cb) {

        var Utilisateur = app.models.Utilisateur;

        Utilisateur.findById(user, function(err, userFound){
            if(err)
                throw err;
            else{
                if(userFound){
                    userFound.current_trajet(function(err, current_trajet){
                        if(current_trajet && userFound.en_trajet){
                            cb(err, current_trajet);
                        } else {
                            cb("No current trajet.",null);
                        }
                        console.log(current_trajet);
                    });
                } else {
                    cb("User not found.",null);
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
    Utilisateur.remoteMethod(
        'validetrajet',
        {
            accepts: [
                {arg: 'user', type: 'number'}
            ],
            returns: {arg: 'user', type: 'utilisateur'},
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
            returns: {arg: 'trajet', type: 'Trajet'},
            http: {
                verb: 'post',
                path: '/:user/currenttrajet'
            }
        }
    );

};
