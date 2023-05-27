class Bonus {

    constructor(estado) {
    
        if(estado){
            this.div = document.createElement("div");
            this.div.classList.add("bonusCorazon");
            document.getElementById("contenedor").appendChild(this.div);
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
}