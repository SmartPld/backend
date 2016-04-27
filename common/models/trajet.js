module.exports = function(Trajet) {
    Trajet.disableRemoteMethod("create", true);
    Trajet.disableRemoteMethod("upsert", true);
    Trajet.disableRemoteMethod("updateAll", true);
    Trajet.disableRemoteMethod("deleteById", true);
    Trajet.disableRemoteMethod("updateAttributes", false);
    Trajet.disableRemoteMethod("createChangeStream", true);
    Trajet.disableRemoteMethod("count", true);
    Trajet.disableRemoteMethod("findOne", true);
    Trajet.disableRemoteMethod("exists", true);
};
