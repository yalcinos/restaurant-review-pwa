import idb from 'idb';

  const dbPromised = idb.open('restaurant-store', 1, upgradeDB => {
  switch (upgradeDB.oldVersion) {
    case 0:
      upgradeDB.createObjectStore('items', {keyPath:'id'});
  }
});
/**
 *Put data which is fetched to indexDB.
 */
  dbPromised.then(db => {
        fetch("http://localhost:1337/restaurants/")
        .then(response => {
         return response.json()
        })
        .then(jsonData => {
          var tx = db.transaction("items", "readwrite");
          var store = tx.objectStore("items");
          console.log(jsonData);
          for(var i=0; i<jsonData.length; i++){
            store.put(jsonData[i]);
          }
            return tx.complete && store.getAll();
        });
}).then(result => {console.log("Done!")});

/**
 *Retrieve data from indexDB when user is offline.
 */
if(window.navigator.onLine){
  console.log('Online!');
}else{
  dbPromised.then(db =>{
    var tx = db.transaction("items","readonly");
    var store = tx.objectStore("items");
    return store.getAll();
  
  }).then(data => {fillRestaurantsHTML(data)});
}

