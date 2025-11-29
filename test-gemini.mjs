import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;

console.log('Testing Gemini API...');
console.log('API Key:', apiKey ? `${apiKey.substring(0, 10)}...` : 'NOT FOUND');

if (!apiKey) {
  console.error('❌ GEMINI_API_KEY not found in .env.local');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function testAPI() {
  try {
    console.log('\nTesting gemini-pro model...');
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const result = await model.generateContent('Say hello in JSON format: {"message": "hello"}');
    const response = result.response;
    const text = response.text();
    
    console.log('✓ API Response:', text);
    console.log('\n✅ Gemini API is working correctly!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\nPossible issues:');
    console.error('1. Invalid API key');
    console.error('2. API key not enabled for Gemini API');
    console.error('3. Billing not set up (if required)');
    console.error('\nPlease check: https://aistudio.google.com/app/apikey');
  }
}

testAPI();
