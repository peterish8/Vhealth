const pdf = require('pdf-parse');
const fs = require('fs');

async function testPdfParse() {
  try {
    console.log('Testing pdf-parse library...');
    
    // Create a simple test buffer (this won't be a real PDF, just for testing the library)
    const testBuffer = Buffer.from('This is a test');
    
    try {
      const result = await pdf(testBuffer);
      console.log('pdf-parse library is working');
    } catch (error) {
      console.log('Expected error for non-PDF buffer:', error.message);
    }
    
    console.log('pdf-parse library test completed');
    
  } catch (error) {
    console.error('Error testing pdf-parse:', error);
  }
}

testPdfParse();