const {Pool} = require('pg');

const pool = new Pool({
  user: "development",
  password: "development",
  host: "localhost",
  database: "lightbnb",
});







/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function (email) {
  const queryString = `
    SELECT * 
    FROM users
    WHERE users.email = $1
  `;

  return pool.query(queryString, [email])
    .then((res) => {
      if (res.rows.length === 0) {
        return null; // No user found
      }
      console.log(res.rows[0]); 
      return res.rows[0];
    })
    .catch((err) => {
      console.error("Database error:", err.message);
      return null; 
    });
};


/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
   const queryString = `
    SELECT * 
    FROM users
    WHERE users.id = $1
  `;

  return pool.query(queryString, [id])
    .then((res) => {
      if (res.rows.length === 0) {
        return null; // No user found
      }
      console.log(res.rows[0]); 
      return res.rows[0];
    })
    .catch((err) => {
      console.error("Database error:", err.message);
      return null; 
    });
};


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (name, email, password) {

  const queryString = `
  INSERT INTO users (name, email, password)
  VALUES ($1, $2, $3)
  RETURNING *
  `
 
  return pool.query(queryString, [name, email, password])
    .then((res) => {
      console.log(res.rows)
      return res.rows
    })
    .catch((err) => {
      console.log(err.message)
    })
};



/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {

  const queryString = `
  SELECT 
    reservations.id as id, 
    properties.*, 
    reservations.start_date as start_date, 
    AVG(property_reviews.rating) as average_rating
  FROM properties
  JOIN reservations ON properties.id = reservations.property_id
  JOIN property_reviews ON properties.id = property_reviews.property_id
  WHERE reservations.guest_id = $1
  GROUP BY reservations.id, properties.id
  ORDER BY reservations.start_date
  LIMIT $2;
  `
  return pool.query(queryString, [guest_id, limit])
    .then((res) => {
      console.log(res.rows)
      return res.rows
    })
    .catch((err) => {
      console.log(err.message)
    })
};


// /// Properties


/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */


const getAllProperties = function (options, limit = 10) {
  const queryParams = [];
  let queryString = `
    SELECT properties.*, AVG(property_reviews.rating) AS average_rating
    FROM properties
    JOIN property_reviews ON properties.id = property_reviews.property_id
  `;

  const whereClauses = [];

  // City filter
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    whereClauses.push(`city LIKE $${queryParams.length}`);
  }

  // Owner ID filter
  if (options.owner_id) {
    queryParams.push(options.owner_id);
    whereClauses.push(`owner_id = $${queryParams.length}`);
  }

  // Price filter
  if (options.minimum_price_per_night && options.maximum_price_per_night) {
    queryParams.push(options.minimum_price_per_night);
    whereClauses.push(`cost_per_night >= $${queryParams.length}`);

    queryParams.push(options.maximum_price_per_night);
    whereClauses.push(`cost_per_night <= $${queryParams.length}`);
  }

  // Add WHERE clause if there are filters
  if (whereClauses.length > 0) {
    queryString += " WHERE " + whereClauses.join(" AND ");
  }

  // Grouping
  queryString += ` GROUP BY properties.id`;

  // Rating filter
  if (options.minimum_rating) {
    queryParams.push(options.minimum_rating);
    queryString += ` HAVING AVG(property_reviews.rating) >= $${queryParams.length}`;
  }

  // Ordering and limit
  queryParams.push(limit);
  queryString += `
    ORDER BY cost_per_night
    LIMIT $${queryParams.length};
  `;

  // Debug log
  console.log("Final query:", queryString);
  console.log("With values:", queryParams);

  return pool.query(queryString, queryParams)
    .then(res => {
      return res.rows;
    })
    .catch(err => {
      console.error("Error running query:", err.message);
    });
};


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {

  const queryString = `
  INSERT INTO properties (
    owner_id, 
    title, 
    description, 
    thumbnail_photo_url, 
    cover_photo_url, 
    cost_per_night, 
    parking_spaces, 
    number_of_bathrooms, 
    number_of_bedrooms, 
    country, 
    street, 
    city, 
    province, 
    post_code)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
  RETURNING *
  `
   const values = [
    property.owner_id,
    property.title,
    property.description,
    property.thumbnail_photo_url,
    property.cover_photo_url,
    property.cost_per_night,
    property.parking_spaces,
    property.number_of_bathrooms,
    property.number_of_bedrooms,
    property.country,
    property.street,
    property.city,
    property.province,
    property.post_code,
  
  ];

  return pool.query(queryString, values)
    .then((res) => {
      console.log(res.rows)
      return res.rows
    })
    .catch((err) => {
      console.log(err)
    })
};

addProperty({
  owner_id: 1,
  title: 'Speed Lamp',
  description: 'Modern loft with natural light',
  thumbnail_photo_url: 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg?auto=compress&cs=tinysrgb&h=350',
  cover_photo_url: 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg',
  cost_per_night: 93061,
  parking_spaces: 6,
  number_of_bathrooms: 4,
  number_of_bedrooms: 8,
  country: 'Canada',
  street: '536 Namsub Highway',
  city: 'Sotboske',
  province: 'Quebec',
  post_code: 'H1A 2B3'
});


module.exports = {
  getAllProperties,
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  addProperty
}