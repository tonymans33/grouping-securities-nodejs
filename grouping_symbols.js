const fs = require('fs');
const Papa = require('papaparse');
const cliProgress = require('cli-progress');

function processCSV() {
   const csvFile = fs.readFileSync('test.csv', 'utf-8');
   const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

   Papa.parse(csvFile, {
       header: true,
       skipEmptyLines: true, 
       complete: (results) => {
           // Count valid rows (with symbols) first
           const validRows = results.data.filter(row => row.symbol);
           progressBar.start(validRows.length, 0);
           let progress = 0;

           /**
            * Process each row of the CSV and group the data by symbol.
            * We use an object to store the grouped data where the key is the symbol
            * and the value is another object containing the lists of CUSIPs and names.
            */
           const groupedData = results.data.reduce((acc, curr) => {
               if (!curr.symbol) return acc;

               const symbol = curr.symbol;
               const cusip = curr.securityCusip;
               const name = curr.securityName.trim().replace(/\s+/g, ' ');

               // If the symbol is not in the grouped data, add it with empty lists
               if (!acc[symbol]) {
                   acc[symbol] = {
                       securityCusip: [],
                       securityName: []
                   };
               }

               // Add the CUSIP to the list if it's not already there
               if (!acc[symbol].securityCusip.includes(cusip)) {
                   acc[symbol].securityCusip.push(cusip);
               }

               // Add the name to the list if it's not already there
               if (!acc[symbol].securityName.includes(name)) {
                   acc[symbol].securityName.push(name);
               }

               progress++;
               progressBar.update(progress);
               return acc;
           }, {});

           progressBar.stop();
           fs.writeFileSync('grouped_securities.json', JSON.stringify(groupedData, null, 2), 'utf-8');
           console.log('\nProcessing complete. Data written to grouped_securities.json');
       },
       error: (error) => {
           progressBar.stop();
           console.error('Error parsing CSV:', error);
       }
   });
}

processCSV();
