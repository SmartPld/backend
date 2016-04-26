module.exports = function(app){
    var Station = app.models.Station;
    
    Station.destroyAll(function(err){
        if (err){
            throw err;
        }
        console.log("station table cleared");
        Station.create(file_json.values)
        
        var file_json = require('./test.json'); //(with path)
        
        for (var i = 0; i < file_json.values.length; i++) {
            var station_obj = file_json.value[i]
            if (station_obj.status != "OPEN"){
                continue;
            }
            delete station_obj.status;
            delete station_obj.bike_stands;
            delete station_obj.availability;
            delete station_obj.available_bike_stands;
            delete station_obj.banking;
            delete station_obj.available_bikes;
            delete station_obj.banking;
            delete station_obj.banking;
            Station.create(file_json.values)
        }
    });
    
    
    
}


