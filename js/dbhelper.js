

/**
 * Common database helper functions.
 */

class DBHelper {

  /**
   * Fetch all restaurants.
   */
   
    static fetchRestaurants(callback) {
      fetch("http://localhost:1337/restaurants")
      .then(function(response){
         return response.json();
      })
      .then(function(response){
        callback(null,response);
        console.log('Sucess:',response);
      })
    }

   static fetchReviews(callback) {
      fetch("http://localhost:1337/reviews")
      .then(function(response){
         return response.json();
      })
      .then(function(response){
        console.log('Review:' ,response);
        callback(null,response);
        
      })
    }

static fetchReviewsByRestaurantId(id, callback) {
    // fetch all restaurants with proper error handling.
    DBHelper.fetchReviews((error, reviews) => {
      if (error) {
        callback(error, null);
      } else {
        //Yeni gelen yorumlar filter olmuyor.
        let review = reviews.filter(res => res.restaurant_id == getParameterByName('id'));
        console.log('yorumlar:' ,review);
        if (review) { // Got the restaurant
          callback(null, review);
        } else { // Restaurant does not exist in the database
          callback('Review does not exist', null);
        }
      }
    });
  }
  static PostReviewData(){
    const rest_id = parseInt(getParameterByName('id'));
    const uname = document.getElementById("uname").value;
    const rate = parseInt(document.getElementById("rate").value);
    const comment = document.getElementById("subject").value;
   console.log('şş:',rest_id);
   console.log('ş:', rate);
    const reviewData = {
      "restarant_id": rest_id,
      "name": uname,
      "rating": rate,
      "comments": comment
    }
    //alert(rest_id+","+uname+","+rate+","+comment);
    fetch('http://localhost:1337/reviews/?restaurant_id='+rest_id, {
    method: 'POST',
    mode: "cors", // no-cors, cors, *same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, same-origin, *omit
    body: JSON.stringify(reviewData),
    redirect: "follow", // manual, *follow, error
    referrer: "no-referrer", // no-referrer, *client
    headers: {
        'content-type': 'application/json; charset=utf-8',
      }
    }).then(response => response.json())
      .then(response => {
  
        console.log('PostedData:',response);
      })
      .catch(error => {
        console.log(error);
    });
      event.preventDefault();
  }
  static OfflinePostReviewData(){
    const rest_id = parseInt(getParameterByName('id'));
    const uname = document.getElementById("uname").value;
    const rate = parseInt(document.getElementById("rate").value);
    const comment = document.getElementById("subject").value;
    const reviewData = {
      "restarant_id": rest_id,
      "name": uname,
      "rating": rate,
      "comments": comment
    }

     alert(JSON.stringify(reviewData));
     event.preventDefault();
  }
  static fetchRestaurantById(id, callback) {
    // fetch all restaurants with proper error handling.
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        const restaurant = restaurants.find(r => r.id == id);
        if (restaurant) { // Got the restaurant
          console.log('Rest:',restaurant);  
          callback(null, restaurant);
        } else { // Restaurant does not exist in the database
          callback('Restaurant does not exist', null);
        }
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants
        if (cuisine != 'all') { // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != 'all') { // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        callback(null, results);
      }
    });
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood);
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
        callback(null, uniqueNeighborhoods);
      }
    });
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
        callback(null, uniqueCuisines);
      }
    });
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`);
  }

  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant) {
    return (`/img/${restaurant.id}.jpg`);
  }

  /**
   * Map marker for a restaurant.
   */
  static mapMarkerForRestaurant(restaurant, map) {
    // https://leafletjs.com/reference-1.3.0.html#marker  
    const marker = new L.marker([restaurant.latlng.lat, restaurant.latlng.lng],
      {title: restaurant.name,
      alt: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant)
      })
      marker.addTo(newMap);
    return marker;
  } 

}
