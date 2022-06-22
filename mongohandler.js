const MongoClient = require('mongodb').MongoClient;
// const url = "mongodb://localhost:27017/";
const url = "mongodb+srv://Simon:asd@cluster0.tgzs7xi.mongodb.net/?retryWrites=true&w=majority";
const dbName = 'mydb'

const dropCollection = function (collectionName, callback) {
    MongoClient.connect(url, function (err, mongoClient) {
        if (err) throw err;

        const database = mongoClient.db(dbName);
        database.dropCollection(collectionName)
            .then(result => {
                //ahol látsz ilyen callback függvény hívást, ott a másik fájlba hívunk vissza
                callback();
                console.log("Collection deleted!");
            })
            .catch(err => {
                console.log("Collection is still exists!");
                throw err;

            })
            .finally(() => {
                mongoClient.close();
            });
    });
}


const collectionExists = function (collectionName, exists, notExistsCallback) {
    MongoClient.connect(url, function (err, mongoClient) {
        if (err) throw err;

        const database = mongoClient.db(dbName);
        database.listCollections({name: collectionName})
            .next(function (err, result) {
                mongoClient.close();
                if (result) {
                    //ahol látsz ilyen callback függvény hívást, ott a másik fájlba hívunk vissza
                    exists();
                } else {
                    //ahol látsz ilyen callback függvény hívást, ott a másik fájlba hívunk vissza
                    notExistsCallback();
                }
            });
    });
}

const createCollection = function (newCollectionName, callback) {
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

//a collection nevét, és az entitás id-ját kérjük, és ha van ilyen elem az adatbázisban, akkor kiíratjuk az eredményt
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

const create = function (collectionName, entity) {
    MongoClient.connect(url, function (err, mongoClient) {
        if (err) throw err;

        const database = mongoClient.db(dbName);


        //insertáljuk a megkapott entitást a collectionbe
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


const update = function (collectionName, entityId, newEntity) {
    MongoClient.connect(url, function (err, mongoClient) {
        if (err) throw err;

        const database = mongoClient.db(dbName);


        //id alapján frissítünk egy entitást a collectionben
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


const deleteF = function (collectionName, entityId) {
    MongoClient.connect(url, function (err, mongoClient) {
        if (err) throw err;

        const database = mongoClient.db(dbName);


        //id alapján törlünk egy entitást a collectionből
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
module.exports = {createCollection, create, update, find, deleteF, dropCollection, collectionExists};