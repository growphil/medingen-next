const axios = require('axios');
const API_ENDPOINT = 'https://pl03w30q-8001.inc1.devtunnels.ms/api/';
async function getTracking() {
  try {
    const res = await axios.post(API_ENDPOINT + 'order-tracking/DEL991823');
    console.log(JSON.stringify(res.data, null, 2));
  } catch (e) {
    console.log(e.response?.data || e.message);
  }
}
getTracking();
