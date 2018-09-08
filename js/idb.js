import idb from 'idb';


  const dbPromised = idb.open('restaurant-store', 1, upgradeDB => {
  switch (upgradeDB.oldVersion) {
    case 0:
      upgradeDB.createObjectStore('items', {keyPath:'id'});
  }
});
  dbPromised.then(db => {
        fetch("http://localhost:1337/restaurants/")
        .then(function(response){
         return response.json()
        })
        .then(function(jsonData){
          var tx = db.transaction("items", "readwrite");
          var store = tx.objectStore("items");
          console.log(jsonData);
          for(var i=0; i<jsonData.length; i++){
            store.put(jsonData[i]);
          }
            return tx.complete && store.getAll();
        });
}).then(result => {console.log("Done!")});

//Get Data from indexDB
  dbPromised.then(db => {return db.transaction("items")
                        .objectStore("items").get(1);
                      }).then(obj => console.log(obj.name,obj.is_favorite,obj.neighborhood));


//Post indexed data to page when user offline.
if(window.navigator.onLine){
  console.log('Online!');
}else{
  dbPromised.then(db =>{
    var tx = db.transaction("items","readonly");
    var store = tx.objectStore("items");
    return store.getAll();
  
  }).then(data => {fillRestaurantsHTML(data)});
}

