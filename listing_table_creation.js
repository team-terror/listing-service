var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'nordstromterror.c7b1493plokd.us-west-2.rds.amazonaws.com',
  user     : 'terror_admin',
  password : 'superterror'
});

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + connection.threadId);
});

function createListingTable (tableName) {
  var query = `CREATE TABLE ${tableName} (
    id INT PRIMARY KEY AUTO_INCREMENT,
    propertyID INT,
    startDate DATE,
    endDate DATE,
    minimumStayDays INT,
    PRIMARY KEY (id),
    FOREIGN KEY (propertyId) REFERENCES Property(id)
  )`;
  connection.query(query, function (err, result) {
    if (err) throw err;
    console.log("Table created");
  });
};
