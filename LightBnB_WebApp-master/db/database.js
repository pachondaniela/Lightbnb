const {Pool} = require('pg');

const pool = new Pool({
  user: "development",
  password: "development",
  host: "localhost",
  database: "lightbnb",
});



/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */


const getAllProperties = function (options, limit = 10) {
  const queryString = `
    SELECT * FROM properties
    LIMIT $1
  `
  return pool.query(queryString, [limit])
    .then((res) => {
      console.log(res.rows);
      return res.rows
    })
    .catch((err) => {
      console.log(err.message);
    })
};




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


getAllReservations(5,10)
// // /// Properties

// /**
//  * Get all properties.
//  * @param {{}} options An object containing query options.
//  * @param {*} limit The number of results to return.
//  * @return {Promise<[{}]>}  A promise to the properties.
//  */


// const getAllProperties = function (options, limit = 10) {
//   const limitedProperties = {};
//   for (let i = 1; i <= limit; i++) {
//     limitedProperties[i] = properties[i];
//   }
//   return Promise.resolve(limitedProperties);
// };

// /**
//  * Add a property to the database
//  * @param {{}} property An object containing all of the property details.
//  * @return {Promise<{}>} A promise to the property.
//  */
// const addProperty = function (property) {
//   const propertyId = Object.keys(properties).length + 1;
//   property.id = propertyId;
//   properties[propertyId] = property;
//   return Promise.resolve(property);
// };

// module.exports = {
//   getUserWithEmail,
//   getUserWithId,
//   addUser,
//   getAllReservations,
//   getAllProperties,
//   addProperty,
// };

module.exports = {
  getAllProperties,
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations
}