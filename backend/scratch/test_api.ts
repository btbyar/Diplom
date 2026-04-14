import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

async function testApi() {
  console.log('Testing API...');
  try {
    console.log('Calling /health...');
    const health = await axios.get(`${API_BASE_URL}/health`, { timeout: 2000 });
    console.log('Health:', health.data);
  } catch (err: any) {
    console.error('Health check failed:', err.message);
  }

  try {
    console.log('Calling /services...');
    const services = await axios.get(`${API_BASE_URL}/services`, { timeout: 2000 });
    console.log('Services count:', services.data.length);
  } catch (err: any) {
    console.error('Services fetch failed:', err.message);
  }
}

testApi();
