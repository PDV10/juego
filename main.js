"use strict"


let vidas = 1;
let runner = new Runner(vidas);

let audio = new Audio();
audio.src = "./audio/audio.mp3"
let enemigo = null;

let timerMin = 4;
let timerSeg = 59;
let bonusCorazon = new Bonus(false);

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
   runner.status();
}

setInterval(checkCollision,50) 

function checkCollision() {
    const personaje = document.querySelector("#personaje").getBoundingClientRect(); 
    let enemigos = document.getElementsByClassName("EnemigoGeneral");
    let bonus = document.getElementsByClassName("bonusCorazon");

    for(let e of enemigos){
        if(e != null){
            const enemigo = e.getBoundingClientRect();

            if (personaje.right-50 > enemigo.left+50 && personaje.bottom > enemigo.top && enemigo.right-60 > personaje.left+60 && enemigo.bottom-50 > personaje.top) {
                    if(vidas > 0){
                        vidas--; 
                        bonusCorazon.quitarVida();
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

            if (personaje.right-40 > bonus.left+40 && bonus.right-40 > personaje.left+40 && bonus.bottom-10 > personaje.top+10) {
                if(e.className == "bonusCorazon"){
                    if(vidas < 3){
                        bonusCorazon.agregarVida();
                        vidas++;
                    }
                } 
                    e.remove();
            } 
        }  
    }
}

function generadorDeElementos(){
    let valor = Math.round(Math.random()* 15 ); 
    let valor2 = Math.round(Math.random()* 1 ); 
    if(valor > 13){
        generarBonus();
        generarEnemigo(valor2); 
    }else{
        generarEnemigo(valor2); 
    }
}

function generarEnemigo(valor) {
    if(valor > 0){
        enemigo = new Enemigo("enemigoAuto");
    }else{
        enemigo = new Enemigo("enemigoHelicoptero"); 
    } 
}

function generarBonus(){
    if(vidas < 3){
        bonusCorazon = new Bonus(true); 
    }
}

function temporizador(){
    if(vidas > 0){
        let temporizador = document.querySelector("#span-temp");
        temporizador.innerHTML = timerMin +":"+timerSeg;
        timerSeg--;
        if(timerSeg == -1){
            if(timerMin == 0){
                vida = 0;
                runner.caida();
            }
            timerSeg = 59;
            timerMin--; 
        }
    }
}