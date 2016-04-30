# My Application

in order to run the server run the following commands :

// start SQL server (depends on your system)
>> mysql.server start

// install updates required modules
>> npm install

// init database (db must be started !!)
>> grunt

// fill db with data
>> node ./server/load-fixtures.js

// start server
>> node .