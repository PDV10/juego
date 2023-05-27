class Bonus {

    constructor(estado,bonus,altura) {
        this.bonus = bonus;
        this.altura = altura;
        this.contenedor =  document.getElementById("contenedor");
        if(estado){
            this.div = document.createElement("div");
            this.div.classList.add("bonus");
            this.div.style.bottom = this.altura+"%";
            if(this.bonus == "corazon"){
                this.div.classList.add("bonusCorazon");
            }else{
                this.div.classList.add("bonusCoin");
                
            }       
           this.contenedor.appendChild(this.div);
        }
    }
  

    agregarVida(){
        this.vida = document.createElement("div");
        this.vida.classList.add("corazon");
        this.vida.classList.add("sumarVida");
        document.getElementById("vidas").appendChild(this.vida);
    }

    quitarVida(){
        this.vidas = document.getElementById("vidas");
        let ultimo = this.vidas.appendChild(this.vidas.lastElementChild);
        ultimo.classList.remove("sumarVida"); 
        ultimo.classList.add("quitarVida"); 
   
        setTimeout(function(){
            document.getElementById("vidas").removeChild(ultimo); 
        },1000)
    }

    sumarCoin(valor){
        let contadorCoin = document.getElementById("multiplicadorCoin")
        this.coin = document.createElement("div");
        this.coin.classList.add("desplazarCoin");
        //obtengo el elemento que muestra el total de monedas
        this.contenedor.appendChild(this.coin);
        setTimeout(()=>{
            contadorCoin.innerHTML = "x"+valor;
            this.coin.classList.remove("desplazarCoin");
        },1300)
       
    }

    mostarContadorCoin(){
        // es muestra el contador de monedas cuando termina la animacion
        setTimeout(()=>{
            document.querySelector(".contenedorCoin").classList.remove("esconder");
        },1300)
    }
}