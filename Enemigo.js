class Enemigo extends Personaje {


    constructor(tipoEnemigo) {
        super();
        
        this.tipoEnemigo = tipoEnemigo;
        this.enemigo = document.createElement("div");
        this.enemigo.classList.add(tipoEnemigo);
        this.enemigo.classList.add("EnemigoGeneral");
        document.getElementById("contenedor").appendChild(this.enemigo);
    }
    
    status() {
        super.status();
    }

}