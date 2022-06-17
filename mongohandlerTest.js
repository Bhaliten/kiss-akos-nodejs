//behúzom a fájlomat
const mongohandler = require('./mongohandler');

//Ezekkel az adatokkal fogunk dolgozni
const collectionName = "CollectionASD23";

const entity = {_id: 1, 'name': 'Janos1', 'age': 21};
const entity2 = {_id: 2, 'name': 'Janos2', 'age': 21};
const entity3 = {_id: 3, 'name': 'Janos3', 'age': 21};
const newEntity = {$set: {'name': 'Agota1', 'age': 22}};

const crudCallback = function () {
//ha minden oké, és létezik a collection, akkor fog ez a függvény meghívódni, és elvégezni a CRUD művelteket az entitásokkaé
    mongohandler.create(collectionName, entity);
    mongohandler.create(collectionName, entity2);
    mongohandler.create(collectionName, entity3);

    mongohandler.find(collectionName, entity._id);
    mongohandler.update(collectionName, entity._id, newEntity);
    mongohandler.find(collectionName, entity._id);


    mongohandler.deleteF(collectionName, entity._id);
    mongohandler.deleteF(collectionName, entity2._id);
    mongohandler.deleteF(collectionName, entity3._id);
};

const createCollectionCallback = function () {

    // létre hozzuk a collectiont, és ha sikeres, akkor meghívódik a crudCallback
    mongohandler.createCollection(collectionName, crudCallback);
}
const existsCallback = function () {
    //ha létezik már az indításnál egy collection, azt törölni fogjuk
    mongohandler.dropCollection(collectionName, createCollectionCallback);
}

const notExistsCallback = function () {
    //ha nem létezik a collection, akkor fog ez a függvény meghívódni, majd ha sikeresen létre jött a collection
    //akkor meghívódik a crudCallback függvény
    mongohandler.createCollection(collectionName, crudCallback);
}


//Itt kezdődik a minden
//a collectionExists meg fogja vizsgálni azt, hogy az adott collectiont létre kell-e hozni, vagy sem az alapján, hogy
//létezik-e már
//ha létezik, akkor existsCallback függvény fog meghívodni fentébb, ha nem létezik akkor a notExistsCallback
mongohandler.collectionExists(collectionName, existsCallback, notExistsCallback);



