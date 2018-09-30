"use strict";
var mysql = require("mysql");
var axios = require("axios");

var connection = mysql.createConnection({
  host: 'localhost',
  port: '3307',
  user: 'user',
  password: 'password',
  database: 'database',
});

connection.connect();

connection.query(
  `DELETE FROM hackujstat.budovaAdresa`, (delError) => {
  if (delError) {
    console.log("Error while performing DELETE Query.", delError);
  } else {
    console.log('Results in hackujstat.budovaAdresa were deleted.')
  }
  connection.query(
    `
      SELECT 
      GROUP_CONCAT(DISTINCT(idAdresa))
      FROM cedr.AdresaSidlo adrs
        JOIN cedr.Dotace as dot on dot.idPrijemce = adrs.idPrijemce
          JOIN Rozhodnuti as roz on roz.idDotace = dot.idDotace

      WHERE adrs.cisloDomovni != 0
      GROUP BY adrs.ulice, adrs.cisloDomovni, substr(adrs.psc, 1, 2)
    `, (selError, results, fields) => {
      if (selError) {
        console.log("Error while performing SELECT Query.", selError);
      } else {
        console.log('Selecting joined table grants grouped by address was successful.')
      }

      var parsedResults = JSON.parse(JSON.stringify(results));
      var values = parsedResults.map(parsedResult => Object.values(parsedResult))

      console.log('Starting to insert into hackujstat.budovaAdresa');
      var i;
      for (i = 0; i < values.length; i++) { 

          var splittedValues = values[i][0].split(",");
          var returnedValues = splittedValues.map(splittedValue => [i +1, splittedValue])

          connection.query(
            `INSERT INTO hackujstat.budovaAdresa (idBudova, idAdresaSidlo) VALUES ?`,
            [returnedValues],
            (insError) => { 
            if (insError) {
              console.log("Error while performing INSERT Query.", insError);
            }
          })
      }
      console.log('Finished inserting into hackujstat.budovaAdresa');
    });
  }
);

connection.query(
  `DELETE FROM hackujstat.budova`, (delError) => {
  if (delError) {
    console.log("Error while performing DELETE Query.", delError);
  } else {
    console.log('Results in hackujstat.budova were deleted.')
  }
  connection.query(
    `
      SELECT 
      count(dot.idDotace) as pocetDotaci, 
      iriStat, adrs.ulice as ulice, adrs.cisloDomovni as cisloDomovni, adrs.psc as psc, 
      COUNT(DISTINCT adrs.idPrijemce) as pocetPrijemcu, 
      SUM(roz.castkaPozadovana) as castkaPozadovana, 
      SUM(CASE WHEN roz.refundaceIndikator = 0 THEN roz.castkaRozhodnuta ELSE - roz.castkaRozhodnuta END) as castkaRozhodnuta
            
      FROM cedr.AdresaSidlo adrs
        JOIN cedr.Dotace as dot on dot.idPrijemce = adrs.idPrijemce
          JOIN Rozhodnuti as roz on roz.idDotace = dot.idDotace

      WHERE adrs.cisloDomovni != 0
      GROUP BY adrs.ulice, adrs.cisloDomovni, substr(adrs.psc, 1, 2)
    `, (error, results, fields) => {
      if (error) {
        console.log("Error while performing SELECT Query.", error);
      } else {
        console.log('Selecting grants grouped by address was successful.')
      }

      var parsedResults = JSON.parse(JSON.stringify(results));
      var values = parsedResults.map(parsedResult => Object.values(parsedResult))

      console.log('Starting to insert into hackujstat.budova wait for "DONE." message');
      var query = connection.query(
        `INSERT INTO hackujstat.budova (pocetDotaci,
        iriStat, ulice, cisloDomovni, psc, pocetPrijemcu, 
        castkaPozadovanaSum, castkaRozhodnuta) VALUES ?`,
        [values],
        (updateError) => { 
      
        if (updateError) {
          console.log("Error while performing INSERT Query.", updateError);
        } else {
          console.log('Finished inserting into hackujstat.budova');
          console.log('DONE.')
        }
      })
    }
  );
});
