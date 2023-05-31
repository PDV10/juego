class Bonus {

    constructor(estado,bonus,altura) {
        // obtengo elementos del dom y inicializo variables con los valores que llegan por parametro
        this.contadorCoin = document.getElementById("multiplicadorCoin")
        this.contenedor =  document.getElementById("contenedor");
        this.vidas = document.getElementById("vidas");
        this.bonus = bonus;
        this.altura = altura;
        // si estado es true se muestran los bonus con los que interactua el personaje , y se los crea en una altura aleatoria que llega por parametro
        if(estado){
            // creo el div con la clase bonus general
            this.div = document.createElement("div");
            this.div.classList.add("bonus");
            this.div.style.bottom = this.altura+"%";
            // especifico si se crea un corazon o una coin (por defecto)
            switch (this.bonus) {
                case "corazon":
                    this.div.classList.add("bonusCorazon");
                    break;
            
                default:
                    this.div.classList.add("bonusCoin");
                    break;
            }
            // finalmente al contenedor le agrego el elemento que cree anteriormente 
           this.contenedor.appendChild(this.div);
        }
        
    }
  
    // agrego vidas al contador de vidas
    agregarVida(){
        // creo un elemento vida y se lo agrego al contenedor de vidas del overlay
        this.vida = document.createElement("div");
        this.vida.classList.add("corazon");
        this.vida.classList.add("sumarVida");
        this.vidas.appendChild(this.vida);
    }

    // quito la vida del contador de vidas del ovelay
    quitarVida(){
        // obtengo el ultimo elemento contenedor de vidas del overlay
        
        let ultimo = this.vidas.appendChild(this.vidas.lastElementChild);
        // quito la clase sumarvida y agrego quitarvida
        ultimo.classList.remove("sumarVida"); 
        ultimo.classList.add("quitarVida"); 
        
        // cuando termina la animacion del corazon desapareciendo lo elimino del dom
        setTimeout(function(){
            this.vidas.removeChild(ultimo); 
        },1000)
    }

    sumarCoin(valor){
        // creo la animacion de la moneda desplazandoce hasta el contador de coins (es un elemento nuevo, la moneda original se elimino al momento de tomarse)
        this.coin = document.createElement("div");
        this.coin.classList.add("desplazarCoin");
        this.contenedor.appendChild(this.coin);
        // cuando finaliza la animacion del desplazamiento se elimina el elemnto del dom
        setTimeout(()=>{
            this.contadorCoin.innerHTML = "x"+valor;
            this.coin.remove();
        },1300)
       
    }

    mostarContadorCoin(){
        // se muestra el contador de monedas cuando termina la animacion del desplazamiento de la moneda
        setTimeout(()=>{
            document.querySelector(".contenedorCoin").classList.remove("esconder");
        },1300)
    }

    eliminarCoins(){
        // esconde el contenedor de monedas y elimina el texto del span 
        document.querySelector(".contenedorCoin").classList.add("esconder");
        this.contadorCoin.innerHTML = "";
    }
}