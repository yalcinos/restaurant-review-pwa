let restaurants,
  neighborhoods,
  cuisines
var newMap
var markers = []
let countFav = 1;
//this "ct" for adding id to favouritebuttons.
let ct = 1;
/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
  initMap();
  fetchNeighborhoods();
  fetchCuisines();
});

/**
 * Fetch all neighborhoods and set their HTML.
 */
fetchNeighborhoods = () => {
  DBHelper.fetchNeighborhoods((error, neighborhoods) => {
    if (error) { // Got an error
      console.error(error);
    } else {
      self.neighborhoods = neighborhoods;
      fillNeighborhoodsHTML();
    }
  });
}

/**
 * Set neighborhoods HTML.
 */
fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {
  const select = document.getElementById('neighborhoods-select');
  neighborhoods.forEach(neighborhood => {
    const option = document.createElement('option');
    option.innerHTML = neighborhood;
    option.value = neighborhood;
    select.append(option);
  });
}

/**
 * Fetch all cuisines and set their HTML.
 */
fetchCuisines = () => {
  DBHelper.fetchCuisines((error, cuisines) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.cuisines = cuisines;
      fillCuisinesHTML();
    }
  });
}

/**
 * Set cuisines HTML.
 */
fillCuisinesHTML = (cuisines = self.cuisines) => {
  const select = document.getElementById('cuisines-select');

  cuisines.forEach(cuisine => {
    const option = document.createElement('option');
    option.innerHTML = cuisine;
    option.value = cuisine;
    select.append(option);
  });
}

/**
 * Initialize leaflet map, called from HTML.
 */
initMap = () => {
  self.newMap = L.map('map', {
        center: [40.722216, -73.987501],
        zoom: 12,
        scrollWheelZoom: false
      });
  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}', {
    mapboxToken: 'pk.eyJ1IjoieWFsY2lub3MiLCJhIjoiY2ppYzJ2Nms0MDM0MTN3cGliaGhycnlmayJ9.VnwaAAVaCBS2TOyJ3M_6BQ',
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
      '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox.streets'
  }).addTo(newMap);

  updateRestaurants();
}
/**
 * Update page and map for current restaurants.
 */
updateRestaurants = () => {
  const cSelect = document.getElementById('cuisines-select');
  const nSelect = document.getElementById('neighborhoods-select');

  const cIndex = cSelect.selectedIndex;
  const nIndex = nSelect.selectedIndex;

  const cuisine = cSelect[cIndex].value;
  const neighborhood = nSelect[nIndex].value;

  DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error, restaurants) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      resetRestaurants(restaurants);
      fillRestaurantsHTML();
    }
  })
}

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
resetRestaurants = (restaurants) => {
  // Remove all restaurants
  self.restaurants = [];
  const ul = document.getElementById('restaurants-list');
  ul.innerHTML = '';

  // Remove all map markers
  self.markers.forEach(m => m.setMap(null));
  self.markers = [];
  self.restaurants = restaurants;
}

/**
 * Create all restaurants HTML and add them to the webpage.
 */
fillRestaurantsHTML = (restaurants = self.restaurants) => {
  const ul = document.getElementById('restaurants-list');
  restaurants.forEach(restaurant => {
    ul.append(createRestaurantHTML(restaurant));
  });
  //indexDB cursor ile bütün datalar cekilecek ve forEach yapılacak.
  //ul.append(createRestaurantHTML(restaurants));
  addMarkersToMap();
}

/**
 * Create restaurant HTML.
 * Add responsive images to list.
 */
createRestaurantHTML = (restaurant) => {
  var altArray=["An Image of Mission Chinese Food Restaurant","An Image of Emily Restaurant",
  "An Image of Kang Ho Dong Baekjeong Restaurant","An Image of Katz's Delicatessen Restaurant",
  "An Image of Roberta's Pizza Restaurant","An Image of Hometown BBQ Restaurant",
  "An Image of ImaSuperiority Burger Restaurant","An Image of The Dutch Restaurant","An Image of Mu Ramen Restaurant",
  "An Image of Casa Enrique Restaurant"];
  const li = document.createElement('li');
  const picture = document.createElement('picture');
  const source1=document.createElement("source");
  const source2=document.createElement("source");
  const image = document.createElement('img');

  image.className = 'restaurant-imgs';
  source1.media="(min-width:1024px)";
  source2.media="(min-width:480px)";

 for(var i=1; i<=10; i++){
  if(restaurant.id==i){
    image.id='restaurant'+i+'-img';
    image.src = "images/"+i+"-500_small.jpg";
    source1.srcset=DBHelper.imageUrlForRestaurant(restaurant);
    source2.srcset="images/"+i+"-1000_medium.jpg";
    image.alt=altArray[i-1];
  }
 }
  li.append(picture);
  picture.append(source1);
  picture.append(source2);
  picture.append(image);
  
  
  const name = document.createElement('h2');
  name.innerHTML = restaurant.name;
  li.append(name);

  const neighborhood = document.createElement('p');
  neighborhood.innerHTML = restaurant.neighborhood;
  li.append(neighborhood);

  const address = document.createElement('p');
  address.innerHTML = restaurant.address;
  li.append(address);

  const more = document.createElement('a');
  more.innerHTML = 'View Details';
  more.href = DBHelper.urlForRestaurant(restaurant);
  li.append(more);

  const favdiv=document.createElement("div");
  const divHearth=document.createElement('img');
  //--Adding id to favicons
  divHearth.className="fav-icon";
  divHearth.setAttribute("id" , ct);
  ct++;
  //--end 

  //default value of favorite
   //get fav-button when site is get up.
  if(restaurant.is_favorite === "true"){
    divHearth.src= "img/like.svg";
    divHearth.alt="Favorite-Button";
  }else
    divHearth.src="img/heart.svg";
     divHearth.align="right";
     divHearth.alt="Favorite-Button";
     
  divHearth.addEventListener("click", function(){
    if(countFav == 1){
        divHearth.src= "img/like.svg";
        countFav = 0;
        console.log(restaurant.id);
        for(let i=1; i<=10; i++){
          if(restaurant.id == i){
              fetch('http://localhost:1337/restaurants/'+i+'/?is_favorite=true', {method: 'PUT'})
              .then(function(response){
              return response.json();
              })
          }
        }
        
    }else {
      divHearth.src="img/heart.svg";
      countFav = 1;
      for(let i=1 ; i<=10; i++){
        if(restaurant.id == i){
            fetch('http://localhost:1337/restaurants/'+i+'/?is_favorite=false', {method: 'PUT'})
            .then(function(response){
              return response.json();
              }) 
        }
      }
  }
 });
  favdiv.appendChild(divHearth);
  li.append(favdiv);

  return li
}

/**
 * Add markers for current restaurants to the map.
 */
addMarkersToMap = (restaurants = self.restaurants) => {
  restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.newMap);
    marker.on("click", onClick);
    function onClick() {
      window.location.href = marker.options.url;
    }
  });
} 