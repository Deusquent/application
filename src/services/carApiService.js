const axios = require('axios');

const BASE_URL = 'https://carapi.app/api';

const getMakes = async () => {
    const response = await axios.get(`${BASE_URL}/makes`);
    return response.data;
};

const getModelsByMake = async (make) => {
    const response = await axios.get(`${BASE_URL}/models`, {
        params: { make }
    });
    return response.data;
};

const getVehicleByVIN = async (vin) => {
    const response = await axios.get(`${BASE_URL}/vin/${vin}`);
    return response.data;
};

module.exports = {
    getMakes,
    getModelsByMake,
    getVehicleByVIN
};