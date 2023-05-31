class Runner {

    constructor(vidas) {
        this.personaje = document.getElementById("personaje");
        this.vidas = vidas;
    }

    // comprueba que el persona no haya perdido
    status(finalizo) {
        if(finalizo ){
            this.caida();
            this.vidas = 0;
        }
    }
    
    /*
     * elimina cualquier animancion que este realizando 
     * agrega la animancion de correr
    */
    correr() {
        this.clean();
        this.personaje.classList.add("correr"); 
    }


    /*
     * elimina cualquier animancion que este realizando 
     * agrega la animancion de perderVida
     * cuando finaliza la animacion realiza la animacion de correr
     */
    perderVida() {
        this.clean(); 
        this.personaje.classList.add("perderVida");
        this.personaje.addEventListener("animationend", () => {
            this.correr();
        });
    }

     /*
    * chequea que si el personaje esta corriendo y no esta muerto
     * elimina cualquier animancion que este realizando 
     * agrega la animancion de saltar
     * cuando finaliza la animacion realiza la animacion de correr
     */
    saltar() {
        if(this.personaje.classList.contains("correr") && !this.personaje.classList.contains("muerto")) {       
            this.clean(); 

            this.personaje.classList.add("saltar");
            this.personaje.addEventListener("animationend", () => {      
                    this.correr();
            });
        }
    }

    /*
    * chequea que si el personaje esta corriendo y no esta muerto
     * elimina cualquier animancion que este realizando 
     * agrega la animancion de agacharse
     * cuando finaliza la animacion realiza la animacion de correr
     */
    agacharse() {
        if(this.personaje.classList.contains("correr") && !this.personaje.classList.contains("muerto")) {       
            this.clean(); 

            this.personaje.classList.add("agacharse");
            this.personaje.addEventListener("animationend", () => {
                    this.correr();
            });
        }
    }

    /*
     * elimina cualquier animancion que este realizando 
     * agrega la animancion de caida
     * cuando finaliza la animacion realiza la animacion de muerto
     */
    caida() {
        this.clean(); 

        this.personaje.classList.add("caida");
        this.personaje.addEventListener("animationend", () => {
            this.muerto();
        });
    }

    // ejecuta anicaion de muerto (persoja que cae y desaparece) cuando finaliza la animacion se elimina el elemento del dom
    muerto(){
        this.clean(); 
        this.personaje.classList.add("muerto");
        this.personaje.addEventListener("animationend", () => {
            this.personaje.remove();
        });
    }

    /* elimino todas las animaciones que este realizando */
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