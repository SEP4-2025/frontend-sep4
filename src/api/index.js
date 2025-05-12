const BASE_URL = import.meta.env.VITE_API_URL || 'https://webapi-service-68779328892.europe-north2.run.app'; // Override in .env for real prod URL

/*
 * 
 *   PLANT & GALLERY API ENDPOINTS
 * 
 */

/**
 * Get plant by ID
 * @param {number} plantId - ID of the plant to fetch
 * @returns {Promise<Object>} Plant data
 */
export async function getPlantById(plantId) {
  const res = await fetch(`${BASE_URL}/plant/${plantId}`);
  if (!res.ok) throw new Error(`Failed to fetch plant with ID ${plantId}`);
  return res.json();
}

/**
 * Get all plants
 * @returns {Promise<Array>} Array of plant objects
 */
export async function getAllPlants() {
  const res = await fetch(`${BASE_URL}/plant`);
  if (!res.ok) throw new Error('Failed to fetch plants');
  return res.json();
}

/**
 * Create a new plant
 * @param {string} name - Name of the plant
 * @param {string} species - Species of the plant (required by the API)
 * @returns {Promise<Object>} Created plant data
 */
export async function createPlant(name, species = null) {
  try {
    // Based on the validation error, the API is looking for direct Name and Species fields
    // Let's try a direct structure with no wrapping
    const requestData = {
      Name: name,
      Species: species || name,
      // Add greenhouse ID which is probably needed
      GreenhouseId: 1
    };
    
    // Log for debugging
    console.log('Creating plant with direct fields format:', requestData);
    
    // Ensure token is available
    const token = sessionStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    // Make the API request with proper headers
    const res = await fetch(`${BASE_URL}/plant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(requestData)
    });
    
    // If not successful, get more details about the error
    if (!res.ok) {
      // Get the raw response text first
      const responseText = await res.text();
      console.log('Plant creation response text:', responseText);
      
      // Try to parse as JSON if possible
      let errorData = null;
      try {
        if (responseText) {
          errorData = JSON.parse(responseText);
        }
      } catch (e) {
        console.log('Response is not valid JSON:', e);
      }
      
      console.error('Plant creation failed:', {
        status: res.status,
        statusText: res.statusText,
        responseText,
        errorData
      });
      
      // Provide a more descriptive error based on the status code
      if (res.status === 400) {
        // For 400 errors, include all available error details
        const errorDetails = errorData ? JSON.stringify(errorData, null, 2) : responseText || 'No details';
        throw new Error(`Failed to create plant: Invalid data format\n${errorDetails}`);
      } else if (res.status === 401 || res.status === 403) {
        throw new Error('Authentication error: Please log in again');
      } else {
        throw new Error(`Failed to create plant: ${res.status} ${res.statusText}\n${responseText || ''}`);
      }
    }
    
    return res.json();
  } catch (error) {
    console.error('Error in createPlant:', error);
    throw error;
  }
}

/**
 * Update plant name
 * @param {number} plantId - ID of the plant to update
 * @param {string} name - New name for the plant
 * @returns {Promise<Object>} Updated plant data
 */
export async function updatePlantName(plantId, name) {
  const res = await fetch(`${BASE_URL}/plant`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sessionStorage.getItem('token')}`
    },
    body: JSON.stringify({ id: plantId, name })
  });
  if (!res.ok) throw new Error(`Failed to update plant with ID ${plantId}`);
  return res.json();
}

/**
 * Delete a plant
 * @param {number} plantId - ID of the plant to delete
 * @returns {Promise<void>}
 */
export async function deletePlant(plantId) {
  const res = await fetch(`${BASE_URL}/plant/${plantId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${sessionStorage.getItem('token')}`
    }
  });
  if (!res.ok) throw new Error(`Failed to delete plant with ID ${plantId}`);
  return res.json();
}

/**
 * Get pictures by plant ID
 * @param {number} plantId - ID of the plant to fetch pictures for
 * @returns {Promise<Array>} Array of picture objects
 */
export async function getPicturesByPlantId(plantId) {
  const res = await fetch(`${BASE_URL}/picture/${plantId}`);
  if (!res.ok) throw new Error(`Failed to fetch pictures for plant ID ${plantId}`);
  return res.json();
}

/**
 * Add a new picture
 * @param {number} plantId - ID of the plant to add picture to
 * @param {File} imageFile - Image file to upload
 * @param {string} note - Optional note for the picture
 * @returns {Promise<Object>} Created picture data
 */
export async function addPicture(plantId, imageFile, note = '') {
  // For this demo, since we don't have an actual image upload endpoint,
  // we'll create a mock successful response and display the image locally
  
  try {
    console.log('Adding picture with mock implementation:', {
      plantId,
      fileName: imageFile.name,
      fileSize: imageFile.size,
      fileType: imageFile.type,
      note: note || 'No note provided'
    });
    
    // Create a unique ID for the picture
    const pictureId = Math.floor(Math.random() * 10000) + 1;
    
    // Create a data URL from the image file for local display
    const reader = new FileReader();
    
    return new Promise((resolve, reject) => {
      reader.onload = function() {
        try {
          const imageUrl = reader.result;
          
          // Create a mock successful response that matches the expected API structure
          const mockResponse = {
            id: pictureId,
            plantId: plantId,
            url: imageUrl,
            note: note || '',
            date: new Date().toISOString(),
            imageUrl: imageUrl // For frontend display
          };
          
          console.log('Mock picture created successfully:', {
            id: mockResponse.id,
            plantId: mockResponse.plantId,
            noteLength: (mockResponse.note || '').length,
            date: mockResponse.date
          });
          
          // Simulate network delay for realism
          setTimeout(() => {
            resolve(mockResponse);
          }, 500);
          
        } catch (error) {
          console.error('Error creating mock picture:', error);
          reject(error);
        }
      };
      
      reader.onerror = function() {
        reject(new Error('Failed to read image file'));
      };
      
      // Start reading the file
      reader.readAsDataURL(imageFile);
    });
  } catch (error) {
    console.error('Error in addPicture:', error);
    throw error;
  }
}

/**
 * Update picture note
 * @param {number} pictureId - ID of the picture to update
 * @param {string} note - New note for the picture
 * @returns {Promise<Object>} Updated picture data
 */
export async function updatePictureNote(pictureId, note) {
  try {
    const token = sessionStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found. Please log in again.');
    }

    const res = await fetch(`${BASE_URL}/picture/${pictureId}/note`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ note })
    });
    
    if (!res.ok) {
      const errorData = await res.text();
      console.error('Error updating picture note:', {
        status: res.status,
        statusText: res.statusText,
        responseText: errorData,
        errorData: errorData ? JSON.parse(errorData) : {}
      });
      throw new Error(`Failed to update picture note: ${res.status} ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    console.error('Error in updatePictureNote:', error);
    throw error;
  }
}

/**
 * Update a picture's date
 * @param {number} pictureId - ID of the picture to update
 * @param {string} date - New date for the picture in ISO format
 * @returns {Promise<Object>} Updated picture data
 */
export async function updatePictureDate(pictureId, date) {
  try {
    const token = sessionStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found. Please log in again.');
    }

    // Log the data being sent for debugging
    console.log('Updating picture date:', { pictureId, date });
    
    const res = await fetch(`${BASE_URL}/picture/${pictureId}/date`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ date })
    });
    
    if (!res.ok) {
      const errorData = await res.text();
      console.error('Error updating picture date:', {
        status: res.status,
        statusText: res.statusText,
        responseText: errorData,
        errorData: errorData ? JSON.parse(errorData) : {}
      });
      throw new Error(`Failed to update picture date: ${res.status} ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    console.error('Error in updatePictureDate:', error);
    throw error;
  }
}

/**
 * Delete a picture
 * @param {number} pictureId - ID of the picture to delete
 * @returns {Promise<void>}
 */
export async function deletePicture(pictureId) {
  const res = await fetch(`${BASE_URL}/picture/${pictureId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${sessionStorage.getItem('token')}`
    }
  });
  if (!res.ok) throw new Error(`Failed to delete picture with ID ${pictureId}`);
  return res.json();
}

/*
 * 
 *   NEW API ENDPOINTS - Mariete
 * 
 */

/*
 *   GetSensorData(type)
 *   INPUT: 
 *     type (string) - type of sensor data to fetch || possible values: "all", "temperature", "humidity", "light", "soilMoisture"
 *   RETURNS:
 *   Array of sensor data objects || each object contains the following properties:
 *     id (int) - id of the sensor data
 *     date (date-time) - date of the sensor data
 *     value (int) - value of the sensor data
 *     sensorId (int) - id of the sensor
 *       1 - temperature
 *       2 - humidity
 *       3 - light
 *       4 - soilMoisture
 */

export async function getSensorData(type) {
  // Validate the type parameter
  if (!['all', 'temperature', 'humidity', 'light', 'soilMoisture'].includes(type)) {
    throw new Error(`Invalid sensor type: ${type}`);
  }

  // Transform type to lowercase
  type = type.toLowerCase();

  // Translate type into int
  let typeId = '';
  if (type === 'temperature') typeId = 'sensor/1';
  else if (type === 'humidity') typeId = 'sensor/2';
  else if (type === 'light') typeId = 'sensor/3';
  else if (type === 'soilmoisture') typeId = 'sensor/4';

  // Fetch data from the API
  const res = await fetch(`${BASE_URL}/SensorReading/${typeId}`);
  if (!res.ok) throw new Error(`Failed to load sensor data for type ${type}, which is ${typeId}`);
  return res.json();
}

/*
 *   GetSensorDataLastest(type)
 *   INPUT:
 *   type (string) - type of sensor data to fetch || possible values: "all", "temperature", "humidity", "light", "soilMoisture"
 *   RETURNS:
 *   Lastest sensor data object || the object contains the following properties:
 *     id (int) - id of the sensor data
 *     date (date-time) - date of the sensor data
 *     value (int) - value of the sensor data
 *     sensorId (int) - id of the sensor
 *       1 - temperature
 *       2 - humidity
 *       3 - light
 *       4 - soilMoisture
 */

export async function getSensorDataLastest(type) {
  const allData = await getSensorData(type)

  // Get the latest data from the response's array (last element)
  const data = await allData;
  const latestData = data[data.length - 1];
  if (!latestData) throw new Error(`No data found for type ${type}`);

  return latestData;
}

/* 
 *   getSensorAverageByDate(type, date)
 *   INPUT:
 *     type (string) - type of sensor data to fetch || possible values: "all", "temperature", "humidity", "light", "soilMoisture"
 *     date (date-time) - date to fetch the data for
 *   RETURNS:
 *   Sensor data object from the specified date where the value is averaged || the object contains the following properties:
 *     id (int) - id of the sensor data
 *     date (date-time) - date of the sensor data
 *     value (int) - averaged value of the sensor data for the specified date
 *     sensorId (int) - id of the sensor
 *       1 - temperature
 *       2 - humidity
 *       3 - light
 *       4 - soilMoisture
 */

export async function getSensorAverageByDate(type, date) {
  // Validate the type parameter
  if (!['all', 'temperature', 'humidity', 'light', 'soilMoisture'].includes(type)) {
    throw new Error(`Invalid sensor type: ${type}`);
  }

  // Validate if the date is in the correct format and in date-time format
  // YYYY-MM-DD format
  // const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  // if (!dateRegex.test(date)) {
  //   throw new Error(`Invalid date format: ${date}. Expected format: YYYY-MM-DD`);
  // }

  // Transform type to lowercase
  type = type.toLowerCase();

  // Translate type into int
  let typeId = '';
  if (type === 'temperature') typeId = 1;
  else if (type === 'humidity') typeId = 2;
  else if (type === 'light') typeId = 3;
  else if (type === 'soilmoisture') typeId = 4;

  // Fetch data from the API
  const res = await fetch(`${BASE_URL}/SensorReading/date/${date}`);
  if (!res.ok) {
    console.error(`Failed to load sensor data average for the date ${date} [type ${type}, which is ${typeId}]`);
    return null; 
  }
  // Filter the data by typeId
  const data = await res.json();
  const filteredData = data.filter(item => item.sensorId === typeId);
  if (filteredData.length === 0) {
    console.error(`No data found for type ${type} on date ${date}`);
    return null; 
  }

  /* Construct the average data object, which is a single .json element averaging the "res" data:
   *   date (date-time) - date of the sensor data
   *   value (int) - averaged value of the sensor data for the specified date
   *   sensorId (int) - id of the sensor 
   */
  const average = {
    date: date,
    value: filteredData.reduce((acc, item) => acc + item.value, 0) / filteredData.length,
    sensorId: typeId
  };

  return average;
}

/* TODO: water level and ground moisture - Mariete
 *   getLastestPrediction()
 *   INPUT:
 *     none
 *   RETURNS:
 *   Lastest prediction object || the object contains the following properties:
 *     id (int) - id of the prediction
 *     date (date-time) - date of the prediction
 *     optimaltemp (int) - optimal temperature for the greenhouse
 *     optimalhumidity (int) - optimal humidity for the greenhouse
 *     optimallight (int) - optimal light for the greenhouse
 *     greenhouseId (int) - id of the greenhouse
 *     sensorReadingId (int) - id of the sensor reading
 *     optimalWaterLevel (int) - TODO: What is this? - Mariete
 */

export async function getLastestPrediction() {
  const res = await fetch(`${BASE_URL}/Prediction/`);
  if (!res.ok) throw new Error(`Failed to load lastest prediction`);
  const data = await res.json();
  console.log("Lastest prediction data:", data); 

  // Get the latest data from the response's array (last element)
  const latestData = data[data.length - 1];
  if (!latestData) throw new Error(`No data found for prediction`);

  return latestData;
}

/*
 *   fetchGrenhouseDataByGardenerId(gardenerId)
 *   INPUT:
 *     gardenerId (int) - id of the gardener
 *   RETURNS:
 *     Greenhose data object whith the id provided || the object contains the following properties:
 *       id (int) - id of the greenhouse
 *       name (string) - name of the greenhouse
 *       gardenerId (int) - id of the gardener
 */

export async function fetchGrenhouseDataByGardenerId(gardenerId) {
  const res = await fetch(`${BASE_URL}/Greenhouse/gardener/${gardenerId}`);
  if (!res.ok) throw new Error(`Failed to load greenhouse data for gardener ${gardenerId}`);
  const data = await res.json();
  console.log("Greenhouse data:", data); 
  return data;
}

/*
 *   updateGreenhouseData(greenhouseId, data)
 *   INPUT:
 *     greenhouseId (int) - id of the greenhouse
 *     name (string) - new name for the greenhouse
 *   RETURNS:
 *     Updates the database with the new name for the greenhouse
 *     Returns the updated greenhouse data object || the object contains the following properties:
 *       id (int) - id of the greenhouse
 *       name (string) - name of the greenhouse
 *       gardenerId (int) - id of the gardener
 */

export async function updateGreenhouseName(greenhouseId, name) {
  const res = await fetch(`${BASE_URL}/Greenhouse/update/${greenhouseId}`, {
    method: 'PUT',  // method needs to be specified
    headers: { // content type needs to be specified
      'Content-Type': 'application/json'  
    },
    body: JSON.stringify(name),
  });
  if (!res.ok) throw new Error(`Failed to update greenhouse name for ${greenhouseId}`);
  return res.json();
}

