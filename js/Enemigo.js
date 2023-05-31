class Enemigo {


    constructor(tipoEnemigo) {
        // creo un div con la clase del tipo de enemigo que llega por parametro y lo agrego al dom
        this.tipoEnemigo = tipoEnemigo;
        this.enemigo = document.createElement("div");
        this.enemigo.classList.add(this.tipoEnemigo);
        this.enemigo.classList.add("EnemigoGeneral");
        document.getElementById("contenedor").appendChild(this.enemigo);
    }
    
    status() {
        super.status();
    }

}