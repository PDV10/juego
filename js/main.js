"use strict"
/* obtengo los elementos del dom que utilizo en repetidas funciones  */
let menuPrincipal = document.querySelector(".menuPrincipal");
let menuGuia = document.querySelector(".menuGuia");
let menuFinal = document.querySelector(".menuFinal");
let contenedor = document.getElementById("contenedor");
let overlay = document.querySelector(".overlay");
let temporizador = document.querySelector("#span-temp");

// creo las variables utilizadas durante el juego sin inicializar
let VIDAS_MAX = 2; //constante
let vidas_actuales;
let timerMin ;
let timerSeg;
let enemigo ;
let runner = null;
let contadorCoin = 0;
let generacionElementos;

let audio = new Audio();
let efecto_Sonido = new Audio();

let objetoBonus = new Bonus(false);

// creo las variables de intervalos sin inicializar
let game_loop;
let generador_De_elementos;
let generador_De_enemigos;
let check_Collision;
let temp;
let eliminar_elementos;

/* modifico el elemento span dentro del boton de control de la musica del juego (intercambia el icono) */
let volume = document.getElementById("volume");
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

/* btn-guia y btn-inicio muestran y/o esconden los diferentes menus (principal, guia y final) */

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

/* reproducir sonido cuando paso por encima de los botones del menu */ 
let btnMenu = document.querySelectorAll(".btnMenu");
btnMenu.forEach(btn => {
    btn.addEventListener("mouseover", ()=>{
        audio.src= "../audio/menu.mp3"
        reproducir(audio);
    })
});

/* si se presiona el boton jugar (menu princial/ menu inicio) o el boton volver a jugar (menu final) comienza el juego*/
let btnJugar = document.querySelectorAll(".jugar");
btnJugar.forEach(btn => {
    btn.addEventListener("click", start)
});

/* comienzo del juego */ 
function start(){
    // inicializo las variables de vida y temporizador, y creo al personaje
    vidas_actuales = 1;
    timerMin = 4;
    timerSeg = 59;
    generacionElementos = 3000;
    let div = document.createElement("div");
    div.setAttribute("id","personaje")
    div.classList.add("correr");
    contenedor.appendChild(div)

    // al contenedor de vidas le creo un hijo que muestra las vidas que tiene el jugar al comienzo de partida
    let ContenedorVidas = document.getElementById("vidas")
    let divVidas = document.createElement("div");
    divVidas.classList.add("sumarVida");
    divVidas.classList.add("corazon");
    ContenedorVidas.appendChild(divVidas);
    
    // instancio al personaje, y seteo al enemigo en null
    runner = new Runner(vidas_actuales);
    enemigo = null;
    
    // creo funcionalidad de elegir jugar con o sin musica
    let span_volume = document.getElementById("span-volume");
    if(span_volume.innerHTML == "volume_up"){
        audio.src = "../audio/musica.mp3";
    }else{  
        audio.src = null;
    } 

    // escondo todos los menus
    let menus = document.querySelectorAll(".menuGeneral");
    menus.forEach(menu => {
        menu.classList.add("esconder")
    });

    // muestro el overlay
    overlay.classList.remove("esconder");

    // reproduzco la musica si el jugador lo eligio
    if(audio.src != null){
        reproducir(audio);
    }

    // creo los intervalos que se usan en todo el juego
    generador_De_elementos = setInterval(generadorDeElementos, generacionElementos); 
    eliminar_elementos = setInterval(eliminarElementos,50) 
    check_Collision = setInterval(checkCollision,50) 
    game_loop = setInterval(gameLoop, 50);
    temp = setInterval(restarTemp, 1000);  
    setInterval(aumentarVelocidadDeGeneracion,30000)
  
}

/* funcionalidad que se realiza cuando el juego finaliza */
function terminarJuego(){
   // se esconde el overlay
    overlay.classList.add("esconder");

    // se muestra el menu final cuando me aseguro que el personaje fue eliminado (espero que termine la animacion y que se existan 2 personajes simultaneamente)
    setTimeout(() => {
        menuFinal.classList.remove("esconder");
    }, 3100);

    // finalizo los intervalos, obtengo el puntaje obtenido , y reseteo tanto el contador como el temporizador
    clearInterval(game_loop);
    clearInterval(generador_De_elementos);
    clearInterval(check_Collision);
    clearInterval(temp);
    obtenerPuntaje();
    objetoBonus.eliminarCoins();
    contadorCoin = 0;
    temporizador.innerHTML = "5:00";
}

/* movimiento del persona si presiona la tecla arriba salta , si presiona la tecla abajo se agacha */
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

/* Chequear estado del runner y de la partida*/
function gameLoop() {
    let estado = finalizo();
    runner.status(estado);
    if(estado){
        audio.src ="../audio/muerte.mp3"
        reproducir(audio);
        terminarJuego();
    }
    
}

/* funcionalidad de estar tiempo de generacion de elementos cada 30segundos */
function aumentarVelocidadDeGeneracion(){
    // mientras que el juego siga en curso y el tiempo no puede ser menor a 1500 (debido a que se hace injugable cuando la partida esta muy avanzada)
    if(!finalizo() && generacionElementos >=1500){
        generacionElementos = generacionElementos - 250;
        clearInterval(generador_De_elementos)
        generador_De_elementos = setInterval(generadorDeElementos, generacionElementos); 
    }
}

/* actualizo el contador de monedas en el menu de fin del juego*/
function obtenerPuntaje(){
    let puntajeTotal = document.getElementById("puntajeTotal");
    puntajeTotal.innerHTML = "X"+contadorCoin;
}

/* funcion encagarda de chequear si el personaje colisiono ya sea con un enemigo o con un bonus */
function checkCollision() {
    //obtengo los datos (hitbox) del personaje y los elementos de enemigos y bonus
    const personaje = document.querySelector("#personaje").getBoundingClientRect(); 
    let enemigos = document.getElementsByClassName("EnemigoGeneral");
    let bonus = document.getElementsByClassName("bonus");

    // recorro los enemigos y los bonus
    for(let e of enemigos){
        if(e != null){
            // obtengo los datos del enemigo o del bonus 
            const enemigo = e.getBoundingClientRect();

            // compruebo si se estan colisionando (si alguna parte de la hitbox del personaje esta dentro de la hitbox del enemigo/bonus)
            if (personaje.right-50 > enemigo.left+50 && personaje.bottom > enemigo.top && enemigo.right-60 > personaje.left+60 && enemigo.bottom-50 > personaje.top) {
                        // resto una vida y la elimino del overlay                 
                        vidas_actuales--; 
                        objetoBonus.quitarVida();
                        if(vidas_actuales > 0){
                            // si el personaje sigue por lo menos con una vida realiza la animacion de perder una vida
                            runner.perderVida();
                            efecto_Sonido.src = "../audio/perderVida.mp3"
                        }
                    // reproduzco efecto de sonido y elimina el elemento del dom    
                    
                    reproducir(efecto_Sonido)          
                    e.remove();
            } 
        }  
    }

    for(let e of bonus){
        if(e != null){
            const bonus = e.getBoundingClientRect();
         
            if (personaje.right-40 > bonus.left+40 && bonus.right-40 > personaje.left+40 && bonus.bottom-10 > personaje.top+10 && personaje.bottom-50 > bonus.top-50) {
               
               /* verifico el tipo de bonus con el que colision*/
                switch (e.className) {
                    case "bonus bonusCorazon":  
                    // establezco un limite de vidas maximas
                        if(vidas_actuales < VIDAS_MAX){
                            // agrego una vida extra si no se alcanzo el limite
                            objetoBonus.agregarVida();
                            vidas_actuales++;
                            efecto_Sonido.src = "../audio/1up.mp3"
                        } 
                        break;

                    case "bonus bonusCoin":
                        if(contadorCoin == 0){
                            // si es la primera moneda que se agarra activo el contador de coins (luego de que termine la animacion)
                            objetoBonus.mostarContadorCoin();
                        }
                        // aumento y actualizo el contador de coins y agrego el efecto de sonido de que se tomo la moneda
                        contadorCoin++;
                        objetoBonus.sumarCoin(contadorCoin);     
                        efecto_Sonido.src = "../audio/coin.mp3"
                        break;
                }   
               
                reproducir(efecto_Sonido)
                e.remove(); 
            }  
        }  
    }
}

/* 
    obtengo todos los elementos generados ya sea enemigo o bonus
    y si el objeto existe lo elimino una vez que sale de la pantalla 
*/
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

    // se corta el intervalo de eliminar elementos cuando no queden elementos para eliminar en el dom 
    if(enemigos.length == 0 && bonus.length == 0){
        clearInterval(eliminar_elementos);
    }
}

/* funcion encargada de generar ya sea enemigos como bonus de forma aleatoria dando prioridad a los enemigos */
function generadorDeElementos(){
    let valor = Math.round(Math.random()* 5 ); 
    if(valor >= 3){
        generarBonus();
        generarEnemigos(); 
    }else{
        generarEnemigos(); 
    }
}

/* funcion encargada de generar un enemigo u otro de forma aleatoria */ 
function generarEnemigos() {
    let valor = Math.round(Math.random()* 4 ); 
    if(valor >2){
        enemigo = new Enemigo("enemigoAuto");
    }else{
        enemigo = new Enemigo("enemigoHelicoptero"); 
    } 
}

/* funcion encargada de generar vidas o monedas aleatoriamente dando prioridad a las monedas, y tambien genera la altura a la que van a aparecer estos dentro de un rango */
function generarBonus(){
    let altura = generarNumeroAleatorio();
    let valor = Math.round(Math.random()* 5 ); 

    if(valor >= 3 && vidas_actuales < 2 ){
        objetoBonus = new Bonus(true,"corazon",altura); 
    }else{
        objetoBonus = new Bonus(true,"coin",altura); 
    }
}

/* descuenta el tiempo segundo a segundo si el jugador tiene vidas */
function restarTemp(){
    if(vidas_actuales > 0){
        temporizador.innerHTML = timerMin +":"+timerSeg;
        timerSeg--;
        if(timerSeg == -1){
            if(finalizo()){
                vidas_actuales = 0;
                runner.caida();
            }
            timerSeg = 59;
            timerMin--; 
        }
    }
}

/* verica si se acabo el tiempo o si el jugador se quedo sin vidas*/
function finalizo(){
    if(timerMin == 0 && timerSeg == -1 || vidas_actuales == 0){
        return true;
    }else{
        return false;
    }
}

/* genera numero aleatorio entre 0 y 50 excluyendo el rango entre 4 y 34 (en este rango el jugador puede obtener los bonus solo corriendo (lo obligo a saltar o agacharse) ) */
function generarNumeroAleatorio() {
    var r = Math.round(Math.random());
    if(r>0){
        return Math.floor(Math.random() * (50 - 35)) + 35;
    }else{
        return Math.floor(Math.random() * (3 - 0 + 1) );;
    }
}

/* reproduce musica y sonidos del juego */
function reproducir(audio) {
    audio.play();
} 