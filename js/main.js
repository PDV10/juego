"use strict"
let menuPrincipal = document.querySelector(".menuPrincipal");
let menuGuia = document.querySelector(".menuGuia");
let menuFinal = document.querySelector(".menuFinal");

let btnJugar = document.querySelectorAll(".jugar");
btnJugar.forEach(btn => {
    btn.addEventListener("click", start)
});

let btnGuia = document.getElementById("guia").addEventListener("click",()=>{
    menuPrincipal.classList.add("esconder");
    menuGuia.classList.remove("esconder");
})

let btnInicio = document.querySelectorAll(".inicio");
btnInicio.forEach(btn => {
    btn.addEventListener("click",()=>{
        menuPrincipal.classList.remove("esconder");
        menuGuia.classList.add("esconder");
        menuFinal.classList.add("esconder");
    })
});


let contenedor = document.getElementById("contenedor");
let overlay = document.querySelector(".overlay");
let temporizador = document.querySelector("#span-temp");
let vidas;
let runner = null;
let timerMin ;
let timerSeg;
let contadorCoin = 0;
let enemigo ;

let audio = new Audio();
let musica = new Audio();
let efecto_Sonido = new Audio();

let objetoBonus = new Bonus(false);

let volume = document.getElementById("volume");

// intervalos
let game_loop;
let generador_De_elementos;
let generador_De_enemigos;
let check_Collision;
let temp;

volume.addEventListener("click", ()=>{
    let span_volume = document.getElementById("span-volume");
    if(span_volume.innerHTML == "volume_up"){
        span_volume.innerHTML = "volume_off"
    }else{
        span_volume.innerHTML = "volume_up"
    }
    audio.src= "../audio/menu.mp3"
    reproducir(audio);
})  

let btnMenu = document.querySelectorAll(".btnMenu");
btnMenu.forEach(btn => {
    btn.addEventListener("mouseover", ()=>{
        audio.src= "../audio/menu.mp3"
        reproducir(audio);
    })
});

function reproducir(audio) {
    audio.play();
} 

function start(){
    vidas = 1;
    timerMin = 4;
    timerSeg = 59;
    let div = document.createElement("div");
    div.setAttribute("id","personaje")
    div.classList.add("correr");
    contenedor.appendChild(div)

    let ContenedorVidas = document.getElementById("vidas")
    let divVidas = document.createElement("div");
    divVidas.classList.add("sumarVida");
    divVidas.classList.add("corazon");
    ContenedorVidas.appendChild(divVidas);
    
    runner = new Runner(vidas);
    
    enemigo = null;
    
    let span_volume = document.getElementById("span-volume");
    if(span_volume.innerHTML == "volume_up"){
        audio.src = "../audio/audio.mp3";
    }else{  
        audio.src = null;
    } 

    let menus = document.querySelectorAll(".menuGeneral");
    menus.forEach(menu => {
        menu.classList.add("esconder")
    });

    overlay.classList.remove("esconder");
    if(audio.src != null){
        reproducir(audio);
    }

    /* cada 50 milisegundos verifica estado del juego */
    game_loop = setInterval(gameLoop, 50);

    /* cada 2.5 segundo genera un enemigo aleatorio */
    generador_De_elementos = setInterval(generadorDeElementos, 2500); 
    
    /* temporizador */
    temp = setInterval(restarTemp, 1000);  
    
    setInterval(eliminarElementos,50) 
    
    check_Collision = setInterval(checkCollision,50) 
}

function terminarJuego(){
   
    overlay.classList.add("esconder");

    setTimeout(() => {
        menuFinal.classList.remove("esconder");
    }, 3000);

    clearInterval(game_loop);
    clearInterval(generador_De_elementos);
    clearInterval(check_Collision);
    clearInterval(temp);
    objetoBonus.eliminarCoins();
    obtenerPuntaje();
    temporizador.innerHTML = "5:00";
}


document.addEventListener('keydown', (e) => {
    if(runner != null){
        if(e.key == "ArrowUp"){
            runner.saltar();
        }
        if(e.key == "ArrowDown"){
            runner.agacharse();
        }
    }
});


/**
 * Chequear estado del runner 
 */
function gameLoop() {
    let estado = finalizo();
    runner.status(estado);
    if(estado){
        terminarJuego();
    }
   
}

function obtenerPuntaje(){
    let puntajeTotal = document.getElementById("puntajeTotal");
    puntajeTotal.innerHTML = "X"+contadorCoin;
    contadorCoin = 0;
}

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
                    if(contadorCoin == 0){
                        objetoBonus.mostarContadorCoin();
                    }
                    contadorCoin++;
                    objetoBonus.sumarCoin(contadorCoin);     
                    efecto_Sonido.src = "../audio/coin.mp3"
                    reproducir(efecto_Sonido);           
                }
                e.remove(); 
            }  
        }  
    }
}


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
        generarEnemigos(); 
    }else{
        generarEnemigos(); 
    }
}

function generarEnemigos() {
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

    if(valor >= 4 && vidas < 2 ){
        objetoBonus = new Bonus(true,"corazon",altura); 
    }else{
        objetoBonus = new Bonus(true,"coin",altura); 
    }
}
    
function restarTemp(){
    if(vidas > 0){
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
    if(timerMin == 0 && timerSeg == -1 || vidas == 0){
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
  
