const fs = require('fs');
const Papa = require('papaparse');
const cliProgress = require('cli-progress');

function processCSV() {
   // read the contents of the CSV file
   const csvFile = fs.readFileSync('test.csv', 'utf-8');

   // create a progress bar to track the progress of the processing
   const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

   // parse the CSV file
   Papa.parse(csvFile, {
       header: true,
       complete: (results) => {
           // start the progress bar
           progressBar.start(results.data.length, 0);
           let progress = 0;

           // group the data by symbol
           const groupedData = results.data.reduce((acc, curr) => {
               // if the row doesn't have a symbol, skip it
               if (!curr.symbol) return acc;

               // extract the relevant information from the row
               const symbol = curr.symbol;
               const cusip = curr.securityCusip;
               const name = curr.securityName.trim().replace(/\s+/g, ' ');

               // if the symbol is not already in the result object, add it
               if (!acc[symbol]) {
                   acc[symbol] = {
                       // create an array to store the CUSIPs for this symbol
                       securityCusip: [],
                       // create an array to store the names for this symbol
                       securityName: []
                   };
               }

               // if the CUSIP is not already in the array, add it
               if (!acc[symbol].securityCusip.includes(cusip)) {
                   acc[symbol].securityCusip.push(cusip);
               }

               // if the name is not already in the array, add it
               if (!acc[symbol].securityName.includes(name)) {
                   acc[symbol].securityName.push(name);
               }

               // update the progress bar
               progress++;
               progressBar.update(progress);

               // return the updated result object
               return acc;
           }, {});

           // stop the progress bar
           progressBar.stop();

           // write the grouped data to a file
           fs.writeFileSync('grouped_securities.json', JSON.stringify(groupedData, null, 2), 'utf-8');

           // print a message to indicate that the processing is complete
           console.log('\nProcessing complete. Data written to grouped_securities.json');
       },
       error: (error) => {
           // stop the progress bar
           progressBar.stop();

           // print an error message if there was an error parsing the CSV file
           console.error('Error parsing CSV:', error);
       }
   });
}

processCSV();
