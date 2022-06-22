const MongoClient = require('mongodb').MongoClient;

//Ez a localis mongodb elérés, ez akkor fog működni ha te magad futtatod az adatbázist is
// const url = "mongodb://localhost:27017/";

//ez egy általam létrehozott adatbázis, hogy ne kelljen localba futtatnom :D
//szóval ha van localon adatbázisod, akkor tedd vissza fentebbi localost, de használhatod ezt is
const url = "mongodb+srv://Simon:asd@cluster0.tgzs7xi.mongodb.net/?retryWrites=true&w=majority";
const dbName = 'mydb'


//Ezzel a függvémmyel törölhetsz egy collection-t
//Az 1. paramétere a collection, a második egy meghívható függvény, ami akkor lesz meghívva, ha sikeresen töröltük a collectiont
const dropOurCollection = function (collectionName, callback) {

    //csatlakozunk a MongoClient segítségével a fentebb megadott url-re, azaz az adatbázisra
    MongoClient.connect(url, function (err, mongoClient) {

        //Ha nem sikerült a csatlakozás, akkor eldobjuk a hibát, és nem fut tovább a kód (kiírja a hibát a consolera)
        if (err) throw err;

        //Az adott adatbázis objektumát elkérjük a .db függvény segítségével
        const database = mongoClient.db(dbName);

        //az adatbázis kliensével kitörlöm a collectiont
        database.dropCollection(collectionName)

            //ha sikerült a törlés, akkor mindig a then() rész fog lefutni
            .then(result => {
                //ahol látsz ilyen callback függvény hívást, ott a másik fájlba hívunk vissza
                callback();
                console.log("Collection deleted!");
            })
            //ha problémába ütközünk törlés közben, akkor logolunk
            .catch(err => {
                console.log("Collection not deleted!");
                throw err;

            })

            //A finally rész minden esetben le fog futni, ahol általában a connectiont zárjuk le
            .finally(() => {
                mongoClient.close();
            });
    });
}


//Ezzel a függvénnyel ellenörizhetjük azt, hogy az adott collection létezik e
//1. paraméter a keresendő collection, a 2. az a függvény ami meg lesz hívva, ha létezik
// a 3. paraméter pedig szintén egy függvény, amit akkor fogunk hívni, ha nem lézetik az adott collection
const collectionExists = function (collectionName, exists, notExistsCallback) {
    MongoClient.connect(url, function (err, mongoClient) {
        if (err) throw err;

        const database = mongoClient.db(dbName);

        //a listCollections vissza adná a collectionöket, de mi ezt filtereljük name alapján
        database.listCollections({name: collectionName})
            .next(function (err, result) {
                mongoClient.close();

                //ha a result nem null, akkor bemegy, és meghívja a 2. paraméterként átadott függvémyt
                if (result) {
                    //ahol látsz ilyen callback függvény hívást, ott a másik fájlba hívunk vissza
                    exists();
                } else {
                    //egyébként meg a 3. paramétert
                    //ahol látsz ilyen callback függvény hívást, ott a másik fájlba hívunk vissza
                    notExistsCallback();
                }
            });
    });
}

//létre hoz egy collectiont az átadott név alapján, és ha sikerült, akkor meghívja a 2. paraméterként átadott függvényt
const createOurCollection = function (newCollectionName, callback) {
    MongoClient.connect(url, function (err, mongoClient) {
        if (err) throw err;

        const database = mongoClient.db(dbName);

        //elkészítünk egy collection-t, az átadott név alapján
        database.createCollection(newCollectionName)
            .then(result => {
                //ahol látsz ilyen callback függvény hívást, ott a másik fájlba hívunk vissza
                callback();
                console.log("Collection created!");
            })
            .catch(err => {
                console.log("Collection is already exists!");
            })
            .finally(() => {
                mongoClient.close();
            });
    });
}

//a collection nevét, és az entitás id-ját kérjük, és ha van ilyen elem a collectionben, akkor kiíratjuk az eredményt
//Ha nincs akkor azt hogy nincs
const find = function (collectionName, entityId) {
    MongoClient.connect(url, async function (err, mongoClient) {

        //ha nem sikerült a kapcsolódás akkor eldobjuk a hibát, és megjeleník a consolon
        if (err) throw err;

        //lekérjük magát az adatbázist
        const database = mongoClient.db(dbName);


        //az adatbázis megadott collectionjében keresünk 1db enititást id alapján
        database.collection(collectionName).findOne({_id: entityId})

            //A then részbe, akkor fog befutni, ha sikeres volt a művelet
            .then(result => {
                console.log('Found: ');
                console.log(result);
            })

            //A catch ágba akkor ha nem
            .catch(err => {
                console.log('There is no entity.');
            })

            //A finallyba pedig mind2 eset után bemegy
            .finally(() => {
                //mindig lezárjuk az adatbázis kommunikációt
                mongoClient.close();
            });

    });
}


//az adott collectionbe be "insertálunk egy objektumot (entity)
const create = function (collectionName, entity) {
    MongoClient.connect(url, function (err, mongoClient) {
        if (err) throw err;

        const database = mongoClient.db(dbName);


        //az adott collectionbe 1db entityt rakunk be (más függvénnyel egyszerre többet is lehet)
        database.collection(collectionName).insertOne(entity)
            .then(result => {
                console.log("Entity created");
            })
            .catch(err => {
                console.log("Something went wrong:");
                console.log(err);
            })
            .finally(() => {
                mongoClient.close();
            });
    });
}


//az adott collectionbe, az adott id alapján befrissítjük az adatokat ami a 3. paraméterbe adtunk át
const update = function (collectionName, entityId, newEntity) {
    MongoClient.connect(url, function (err, mongoClient) {
        if (err) throw err;

        const database = mongoClient.db(dbName);



        database.collection(collectionName).updateOne({_id: entityId}, newEntity)
            .then(result => {
                console.log("Entity updated");
            })
            .catch(err => {
                console.log("Something went wrong:");
                console.log(err);
            })
            .finally(() => {
                mongoClient.close();
            });
    });
}


//az adott collectionbe az adott id alapján törlünk egy entityt
const deleteF = function (collectionName, entityId) {
    MongoClient.connect(url, function (err, mongoClient) {
        if (err) throw err;

        const database = mongoClient.db(dbName);



        database.collection(collectionName).deleteOne({_id: entityId})
            .then(result => {
                console.log("Entity deleted");
            })
            .catch(err => {
                console.log("Something went wrong:");
                console.log(err);
            })
            .finally(() => {
                mongoClient.close();
            });
    });
}


//ki exportáljuk a függvényeinket, hogy a másik fájl is használni tudja azokat
module.exports = {createCollection: createOurCollection, create, update, find, deleteF, dropCollection: dropOurCollection, collectionExists};