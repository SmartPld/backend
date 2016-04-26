module.exports = function(Station) {

    var mariadb = ;

    mariadb.createModel(Station.name, Station.properties, Station.options);

    mariadb.automigrate(function () {
        mariadb.discoverModelProperties('CUSTOMER_TEST', function (err, props) {
            console.log(props);
        });
    });

};
