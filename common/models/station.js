module.exports = function(Station) {
    //game.disableRemoteMethod("findById", true);
    Station.disableRemoteMethod("create", true);
    Station.disableRemoteMethod("upsert", true);
    Station.disableRemoteMethod("updateAll", true);
    Station.disableRemoteMethod("deleteById", true);
    Station.disableRemoteMethod("updateAttributes", false);
    Station.disableRemoteMethod("createChangeStream", true);
    Station.disableRemoteMethod("count", true);
    Station.disableRemoteMethod("findOne", true);
    Station.disableRemoteMethod("exists", true);
};
