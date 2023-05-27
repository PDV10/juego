class Runner extends Personaje {

    constructor(vidas) {
        super();
        this.personaje = document.getElementById("personaje");
        this.vidas = vidas;
    }

    status(finalizo) {
        if(finalizo || vidas == 0 ){
            this.caida();
            vidas = null;
        }  
    }

    correr() {
        this.clean();
        this.personaje.classList.add("correr"); 
    }

    perderVida() {
        if(this.personaje.classList.contains("correr") || this.personaje.classList.contains("saltar") || this.personaje.classList.contains("agacharse")) {   
            this.clean(); 
            this.personaje.classList.add("perderVida");
            this.personaje.addEventListener("animationend", () => {
                this.correr();
            });
        }
    }

    saltar() {
        if(this.personaje.classList.contains("correr") && !this.personaje.classList.contains("muerto")) {       
            this.clean(); 

            this.personaje.classList.add("saltar");
            this.personaje.addEventListener("animationend", () => {
                if(vidas > 0){
                    this.correr();
                 }else{
                    this.caida();
                } 
            });
        }
    }

    agacharse() {
        if(this.personaje.classList.contains("correr") && !this.personaje.classList.contains("muerto")) {       
            this.clean(); 

            this.personaje.classList.add("agacharse");

            this.personaje.addEventListener("animationend", () => {
                if(vidas > 0){
                    this.correr();
                 }else{
                    this.caida();
                } 
            });
        }
    }

    caida() {
        if(this.personaje.classList.contains("correr") || this.personaje.classList.contains("saltar") || this.personaje.classList.contains("agacharse")) {       
            this.clean(); 

            this.personaje.classList.add("caida");
            this.personaje.addEventListener("animationend", () => {
                this.muerto();
            });
        }
    }

    muerto(){
        this.personaje.classList.add("muerto");
        this.personaje.addEventListener("animationend", () => {
            this.personaje.style.display = "none";
        });
    }


    clean() {
        this.personaje.classList.remove("correr"); 
        this.personaje.classList.remove("saltar");
        this.personaje.classList.remove("agacharse");
        this.personaje.classList.remove("caida");
        this.personaje.classList.remove("muerto");
        this.personaje.classList.remove("perderVida");
        this.personaje.removeEventListener("animationend", () => {}); 
    }
}