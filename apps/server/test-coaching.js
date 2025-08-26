const http = require('http');

// Test data for coaching endpoint
const testData = {
  lastMove: "e2e4",
  evalBefore: 0,
  evalAfter: 25,
  bestMove: "e7e5",
  pv: "e7e5 g1f3 b8c6"
};

// Test the coaching endpoint
const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/coach',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  }
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers)}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      console.log('Response:', response);
    } catch (error) {
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('Request error:', error);
});

req.write(JSON.stringify(testData));
req.end();

console.log('Testing coaching endpoint...');
console.log('Test data:', testData);
