/*Recibe el nombre del item y  el valor en formato json */

function setItem(nameItem,item){
    localStorage.setItem(nameItem, JSON.stringify(item));
}

/*Recibe el nombre del item y el valor en formato unico*/

function setOnlyItem(nameItem,item){
    localStorage.setItem(nameItem,String(item));
}

/*Recibe el nombre del item y obtenemos el valor en formato json */

function getItem(nameItem,item){
    return JSON.parse(localStorage.getItem(nameItem));
}

/*Recibe el nombre del item y y el valor en formato unico*/

function getOnlyItem(nameItem){
    return localStorage.getItem(nameItem);
}