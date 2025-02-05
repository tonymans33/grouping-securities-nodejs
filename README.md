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

## Sample Output
```json
{
  "6060.HK": {
    "securityCusip": ["Y989DF109"],
    "securityName": [
      "ZhongAn Online P&C Insurance C",
      "ZhongAn Online P&C Insurance Co Ltd",
      "ZHONGAN ONLINE P&C INSURAN-H"
    ]
  },
  "WVE": {
    "securityCusip": ["Y95308105"],
    "securityName": [
      "WAVE LIFE SCIENCES LTD",
      "Wave Life Sciences Ltd",
      "WAVE LIFE SCIENCES LIMITED SHS"
    ]
  }
}
```

## Error Handling
- Skips records with missing symbols
- Displays error messages for CSV parsing issues