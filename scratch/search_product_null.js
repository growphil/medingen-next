const fs = require('fs');

const file = 'd:\\GROWPHIL PROJECT\\MEDINGEN WRAP\\next-ssr\\legacy\\screens\\SearchViewMedicine\\SearchViewMedicine.jsx';
const content = fs.readFileSync(file, 'utf-8');
const lines = content.split('\n');

lines.forEach((line, idx) => {
  if (line.includes('product.') && !line.includes('!product') && !line.includes('product?.') && !line.includes('props.product')) {
    console.log(`${idx + 1}: ${line.trim()}`);
  }
});
