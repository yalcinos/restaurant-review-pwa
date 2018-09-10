let restaurant;
let review;
var newMap;

/**
 * Initialize map as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {  
  initMap();
});

/**
 * Initialize leaflet map
 */
initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {      
      self.newMap = L.map('map', {
        center: [restaurant.latlng.lat, restaurant.latlng.lng],
        zoom: 16,
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
      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.newMap);
    }
  });
  fetchReviewsFromURL((error,review) =>{
    if(error){console.error(error);
    }else
    console.log(review.name);
  })
}  
/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = (callback) => {
  if (self.restaurant) { // restaurant already fetched!
    callback(null, self.restaurant)
    return;
  }
  const id = getParameterByName('id');
  if (!id) { // no id found in URL
    error = 'No restaurant id in URL'
    callback(error, null);
  } else {
    DBHelper.fetchRestaurantById(id, (error, restaurant) => {
      self.restaurant = restaurant;
      if (!restaurant) {
        console.error(error);
        return;
      }
      
      fillRestaurantHTML();
      callback(null, restaurant)
    });
  }
}

fetchReviewsFromURL = (callback) => {
  if (self.review) { // restaurant already fetched!
    callback(null, self.review);
    return;
  }
  const id = getParameterByName('id');
  if (!id) { // no id found in URL
    error = 'No restaurant id in URL'
    callback(error, null);
  } else {
      DBHelper.fetchReviewsByRestaurantId(id,(error,review) =>{
        self.review = review;
        if(!review){
          console.error(error);
          return;
        }else
        fillReviewsHTML();
        callback(null,review);
      });
  }
}
/**
 * Create restaurant HTML  add it to the webpage
 */
fillRestaurantHTML = (restaurant = self.restaurant) => {
  var altArray=["An Image of Mission Chinese Food Restaurant","An Image of Emily Restaurant",
  "An Image of Kang Ho Dong Baekjeong Restaurant","An Image of Katz's Delicatessen Restaurant",
  "An Image of Roberta's Pizza Restaurant","An Image of Hometown BBQ Restaurant",
  "An Image of ImaSuperiority Burger Restaurant","An Image of The Dutch Restaurant","An Image of Mu Ramen Restaurant",
  "An Image of Casa Enrique Restaurant"];
  const name = document.getElementById('restaurant-name');
  name.innerHTML = restaurant.name;
  const address = document.getElementById('restaurant-address');
  address.innerHTML = restaurant.address;
  const cuisine = document.getElementById('restaurant-cuisine');
  cuisine.innerHTML = restaurant.cuisine_type;

/**
* Create media queries for making responsive images for diffrent devices
*/
const picture=document.getElementsByTagName("picture");

//create img tag and add attributes for responsiveness
const img=document.createElement("img");
img.id='restaurant-img';
img.className='restaurant-imgs';

//Add source attr to picture tag and make responsive images
const source1=document.getElementsByTagName("source");
const source2=document.createElement("source");
 source1[0].media="(min-width:1024px)";
 source2.media="(min-width:480px)";
 
 //Add images for every restaurant by restaurant id
 for(var i=1; i<=10; i++){
  if(restaurant.id==i){
  img.src = "images/"+i+"-500_small.jpg";
  source1[0].srcset=DBHelper.imageUrlForRestaurant(restaurant);
  img.setAttribute('alt',altArray[i-1]);
  source2.srcset="images/"+i+"-1000_medium.jpg";
  }
 }
 picture[0].appendChild(source2);
 picture[0].appendChild(img);

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }
}

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
  const hours = document.getElementById('restaurant-hours');
  for (let key in operatingHours) {
    const row = document.createElement('tr');
    row.tabIndex=0;

    const day = document.createElement('td');
    day.innerHTML = key;
    row.appendChild(day);

    const time = document.createElement('td');
    time.innerHTML = operatingHours[key];
    row.appendChild(time);
    hours.appendChild(row);
   
  }
  
}

/**
 * Create all reviews HTML and add them to the webpage.
 */

fillReviewsHTML = (reviews = self.review) => {
  const container = document.getElementById('reviews-container');
  const title = document.createElement('h2');
  const reviewButton = document.createElement('button');
  const modal = document.getElementById('myModal');
  const span = document.getElementsByClassName("close")[0];
  const restidInput = document.getElementById('resid');

  // When the user clicks the button, open the modal 
reviewButton.onclick = function() {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

/**
Creates review button
*/
  restidInput.value = getParameterByName('id');
  reviewButton.id = 'reviews-button';
  reviewButton.innerHTML = 'Add Review';
  title.innerHTML = 'Reviews';
  container.appendChild(title);
  container.appendChild(reviewButton);

  if (!reviews) {
    const noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    container.appendChild(noReviews);
    return;
  }
  const ul = document.getElementById('reviews-list');
  console.log(typeof reviews);
  reviews.forEach(review => {
    ul.appendChild(createReviewHTML(review));
  });
  container.appendChild(ul);
}

/**
 * Create review HTML and add it to the webpage.
 */
createReviewHTML = (review) => {
  const li = document.createElement('li');
  const name = document.createElement('p');
  name.innerHTML = review.name;
  name.classList.add("comment-username");
  li.appendChild(name);

  const date = document.createElement('div');
  date.innerHTML = review.date;
  date.classList.add("reviews-date");
  name.appendChild(date);

/**
*Add color style for rating score
*/
  const rating = document.createElement('p');
  rating.innerHTML = `Rating: ${review.rating}`;
  if(review.rating===5){
    rating.style.background="#269900";
  }
  else if(review.rating===4){
    rating.style.background="#39e600";
  }
  else if(review.rating===3){
  rating.style.background="#e67300";
  }
  else
    rating.style.background="#e60000";
  rating.style.width="70px";
  rating.style.color="white";
  rating.style.borderRadius="5px";
  rating.style.marginLeft="10px";
  rating.style.fontWeight="bold";
  
  li.appendChild(rating);

  const comments = document.createElement('p');
  comments.innerHTML = review.comments;
  li.appendChild(comments);

  return li;
}
/**
 Check clicked button and browser online status then submit data to api.
*/
const rewButton = document.getElementById("submitReview");
 rewButton.addEventListener("click",function(){
      if(window.navigator.onLine){
        DBHelper.PostReviewData();
      }
      else{
        console.log('offline');
        
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
    var data = JSON.stringify(reviewData);
      addToLocalStorage(data);
      event.preventDefault();
      }

      location.href="http://localhost:8000/restaurant.html?id="+getParameterByName('id');
    })

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
fillBreadcrumb = (restaurant=self.restaurant) => {
  const breadcrumb = document.getElementById('breadcrumb');
  const li = document.createElement('li');
  li.innerHTML = restaurant.name;
  breadcrumb.appendChild(li);
}

/**
 * Get a parameter by name from page URL.
 */
getParameterByName = (name, url) => {
  if (!url)
    url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results)
    return null;
  if (!results[2])
    return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

//Add review to Local Storage.
addToLocalStorage = (reviewData) =>{
    const rest_id = parseInt(getParameterByName('id'));
    localStorage.setItem("reviewData",reviewData);
}

//Prevent duplicate data issue when user try to reconnect multiple time.
removeLocalStorageData = () => {
  localStorage.removeItem("reviewData");
}

//When user is online.Fetch data from localstorage to server and delete localstorage.
window.addEventListener("online",(event)=>{
    const rest_id = parseInt(getParameterByName('id'));
    let reviewDataFromLS = JSON.parse(localStorage.getItem("reviewData"));
    fetch('http://localhost:1337/reviews/?restaurant_id='+rest_id, {
    method: 'POST',
    mode: "cors", // no-cors, cors, *same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, same-origin, *omit
    body: JSON.stringify(reviewDataFromLS),
    redirect: "follow", // manual, *follow, error
    referrer: "no-referrer", // no-referrer, *client
    headers: {
        'content-type': 'application/json; charset=utf-8',
      }
    }).then(response => response.json())
      .then(response => {
  
        console.log('LocalStorageData:',response);
        removeLocalStorageData();
      })
      .catch(error => {
        console.log(error);
    });
  });
