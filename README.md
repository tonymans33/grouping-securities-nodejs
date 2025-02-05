# Grouping Symbols

This script processes a CSV file containing security data and groups records by symbol, creating arrays of unique CUSIPs and security names.

## Installation

```bash
npm install
```

## Usage

1. Place your CSV file named `test.csv` in the same directory as the script
2. Run:
```bash
node grouping_symbols.js
```

## Input CSV Format
- Required columns: securityCusip, securityName, symbol
- Encoding: UTF-8

## Output
- Creates `grouped_securities.json`
- Groups records by symbol
- Each group contains:
  - securityCusip: Array of unique CUSIPs
  - securityName: Array of unique names (cleaned and normalized)
- Progress bar shows processing status

## Error Handling
- Skips records with missing symbols
- Displays error messages for CSV parsing issues