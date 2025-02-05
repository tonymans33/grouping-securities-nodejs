const fs = require('fs');
const Papa = require('papaparse');
const cliProgress = require('cli-progress');

function processCSV() {
   const csvFile = fs.readFileSync('test.csv', 'utf-8');
   const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

   Papa.parse(csvFile, {
       header: true,
       skipEmptyLines: true, // Skip empty lines
       complete: (results) => {
           // Count valid rows (with symbols) first
           const validRows = results.data.filter(row => row.symbol);
           progressBar.start(validRows.length, 0);
           let progress = 0;

           const groupedData = results.data.reduce((acc, curr) => {
               if (!curr.symbol) return acc;

               const symbol = curr.symbol;
               const cusip = curr.securityCusip;
               const name = curr.securityName.trim().replace(/\s+/g, ' ');

               if (!acc[symbol]) {
                   acc[symbol] = {
                       securityCusip: [],
                       securityName: []
                   };
               }

               if (!acc[symbol].securityCusip.includes(cusip)) {
                   acc[symbol].securityCusip.push(cusip);
               }

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