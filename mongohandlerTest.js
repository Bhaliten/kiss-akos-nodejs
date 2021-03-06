

//Az egész lefutás a fájl alján fog kezdődni, ahol ellenőrizzük, hogy a collection létezik e már az adatbázisban
//A callback függvényeket át kell nézned, ahhoz hogy megértsd a működéseket

//behúzom a fájlomat
const mongohandler = require('./mongohandler');

//Ezekkel az adatokkal fogunk dolgozni
const collectionName = "CollectionASD23";

const entity = {_id: 1, 'name': 'Janos1', 'age': 21};
const entity2 = {_id: 2, 'name': 'Janos2', 'age': 21};
const entity3 = {_id: 3, 'name': 'Janos3', 'age': 21};

//ahogy láttam update-nél meg kell adni a $set után, hogy mit akarunk frissíteni
const newEntity = {$set: {'name': 'Agota1', 'age': 22}};


//Ha meghívod ezt a függvényt, akkor a program várakozik 1mp-et
async function waitOneSec() {
    await new Promise(resolve => setTimeout(resolve, 1000))
}

const crudCallback = async function () {

    //létre hozunk 3 entitást
    mongohandler.create(collectionName, entity);
    mongohandler.create(collectionName, entity2);
    mongohandler.create(collectionName, entity3);

    //várunk mindig 1-1mp-et, azért, hogy az async függvények le tudjanak futni addigra, mire elérünk a várakozás utánra
    await waitOneSec();
    mongohandler.find(collectionName, entity._id);

    await waitOneSec();
    mongohandler.update(collectionName, entity._id, newEntity);

    await waitOneSec();
    mongohandler.find(collectionName, entity._id);

    await waitOneSec();


    //töröljük az összes entitásunkat a collectionből
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



