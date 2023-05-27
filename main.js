"use strict"


let vidas = 1;
let runner = new Runner(vidas);

let audio = new Audio();
audio.src = "./audio/audio.mp3"
let enemigo = null;

let timerMin = 4;
let timerSeg = 59;
let objetoBonus = new Bonus(false);
let contadorCoin = 0;

// error
/* reproducir();
function reproducir() {
    audio.play();
} 
 */
document.addEventListener('keydown', (e) => {
    if(e.key == "ArrowUp"){
        runner.saltar();
    }
    if(e.key == "ArrowDown"){
        runner.agacharse();
    }
});

/* cada 50 milisegundos verifica estado del juego */
setInterval(gameLoop, 50);

/* cada 2.5 segundo genera un enemigo aleatorio */
 setInterval(generadorDeElementos, 2500); 

/* temporizador */
setInterval(temporizador, 1000);  

/**
 * Chequear estado del runner 
 */
function gameLoop() {
    runner.status(finalizo());
}

setInterval(checkCollision,50) 

function checkCollision() {
    const personaje = document.querySelector("#personaje").getBoundingClientRect(); 
    let enemigos = document.getElementsByClassName("EnemigoGeneral");
    let bonus = document.getElementsByClassName("bonus");

    for(let e of enemigos){
        if(e != null){
            const enemigo = e.getBoundingClientRect();

            if (personaje.right-50 > enemigo.left+50 && personaje.bottom > enemigo.top && enemigo.right-60 > personaje.left+60 && enemigo.bottom-50 > personaje.top) {
                    if(vidas > 0){
                        vidas--; 
                        objetoBonus.quitarVida();
                        if(vidas > 0){
                            runner.perderVida();
                        }
                    }               
                    e.remove();
            } 
        }  
    }

    for(let e of bonus){
        if(e != null){
            const bonus = e.getBoundingClientRect();
         
            if (personaje.right-40 > bonus.left+40 && bonus.right-40 > personaje.left+40 && bonus.bottom-10 > personaje.top+10 && personaje.bottom-50 > bonus.top-50) {
                if(e.className == "bonus bonusCorazon" ){
                    if(vidas < 2){
                        objetoBonus.agregarVida();
                        vidas++;
                    }
                   
                }
                if(e.className == "bonus bonusCoin"){
                    console.log("entro");
                    if(contadorCoin == 0){
                        objetoBonus.mostarContadorCoin();
                    }
                    contadorCoin++;
                    objetoBonus.sumarCoin(contadorCoin);                
                }
                e.remove(); 
            }  
        }  
    }
}

setInterval(eliminarElementos,50) 


function eliminarElementos() {
    let enemigos = document.getElementsByClassName("EnemigoGeneral");
    let bonus = document.getElementsByClassName("bonus");

    for(let e of enemigos){
        if(e != null){
            const elemento = e.getBoundingClientRect();
            if (elemento.right < 0) {        
                e.remove();
            } 
        }  
    }

    for(let e of bonus){
        if(e != null){
            const elemento = e.getBoundingClientRect();
            if (elemento.right < 0) {        
                e.remove();
            } 
        }  
    }
   
}

function generadorDeElementos(){
    let valor = Math.round(Math.random()* 5 ); 
    if(valor >= 3){
        generarBonus();
        generarEnemigo(); 
    }else{
        generarEnemigo(); 
    }
}

function generarEnemigo() {
    let valor = Math.round(Math.random()* 4 ); 
    if(valor >2){
        enemigo = new Enemigo("enemigoAuto");
    }else{
        enemigo = new Enemigo("enemigoHelicoptero"); 
    } 
}

function generarBonus(){
    let altura = generarNumeroAleatorio();
    let valor = Math.round(Math.random()* 5 ); 

    if(valor >= 4 && vidas < 3 ){
        objetoBonus = new Bonus(true,"corazon",altura); 
    }else{
        objetoBonus = new Bonus(true,"coin",altura); 
    }
}
    
function temporizador(){
    if(vidas > 0){
        let temporizador = document.querySelector("#span-temp");
        temporizador.innerHTML = timerMin +":"+timerSeg;
        timerSeg--;
        if(timerSeg == -1){
            if(finalizo()){
                vidas = 0;
                runner.caida();
            }
            timerSeg = 59;
            timerMin--; 
        }
    }
}

function finalizo(){
    if(timerMin == 0 && timerSeg == -1){
        return true;
    }else{
        return false;
    }
}

/**
 * genera numero aleatorio entre 0 y 50 excluyendo el rango entre 11 y 29;
 */
function generarNumeroAleatorio() {
    var r = Math.round(Math.random());
    if(r>0){
        return Math.floor(Math.random() * (50 - 35)) + 35;
    }else{
        return Math.floor(Math.random() * (10 - 0 + 1) );;
    }
  }
  
