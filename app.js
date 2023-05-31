
class Model {
    constructor(){
        this.elems=[
            {id: "1",time : "9.00",body : "Primo div",className : "container2",className2 : "container1"},
            {id: "2",time : "12.00",body : "Secondo div",className : "container4",className2 : "container3"},
            {id: "3",time : "15.00",body : "Terzo div",className : "container6",className2 : "container5"},
            {id: "4",time : "19.00",body : "Quarto div",className : "container8",className2 : "container7"},
        ]

        this.storage=[]

        for(var i=0; i<this.elems.length; i++){
            this.storage.push(this.elems[i])
        }
    }

    bindElemListChanged(callback) {
        this.onElemListChanged = callback
      }

    addTo(t, b){
        const el={
            id: this.elems.length>0 ? parseInt(this.elems[this.elems.length-1].id) +1 : 1,
            time: t,
            body: b,
            className: "container2",
            className2: "container1",
        }
        this.elems.push(el);

        this.onElemListChanged(this.elems) 
    }

    deleteElem(id){
        this.elems = this.elems.filter(el => el.id!=id)

        this.onElemListChanged(this.elems)

        console.log("elimina", id," ", this.elems);
    }

    resetElem(){

        this.elems = Object.assign(this.storage)

        this.onElemListChanged(this.elems);
        console.log("reset model");
    }
}


class View{
    constructor(){
        // root
        this.app = document.getElementById('root');
        this.reset =document.createElement('button')
        this.reset.className = "reset-button"
        this.reset.innerHTML = "Reset"
        this.add= document.createElement('button')
        this.add.innerHTML= "Aggiungi elemento"
        this.add.className = "reset-button"
        this.add.id="add";
        this.elemList=document.createElement('ul');
        this.app.append(this.reset,this.add,this.elemList);
    }

    createElement(type){
        const element= document.createElement(type);
        return element;
    }


    getElement(selector){
        const elem= document.querySelector(selector);
        return element;
    }

    displayElems(elems){
        // Rimuovo tutti i nodi
        while(this.elemList.firstChild){
            this.elemList.removeChild(this.elemList.firstChild);
        }

        // Show default message
        if (elems.length === 0) {
            const p = this.createElement('p')
            p.textContent = 'Nothing to do! Add a task?'
            this.elemList.append(p)
        }else{
            // creo i vari nodi
            console.log("Arrivo da qui");

            elems.forEach(el =>{
                const div= this.createElement("div");
                div.id=el.id;
                div.className=el.className;
                div.textContent=el.id;

                // Span
                const span=document.createElement('span');
                span.className="text-hour";
                span.textContent=el.time;

                // Div figlio
                const d=document.createElement('div');
                d.className=el.className2;
                d.textContent=el.body;

                // Bottone
                const button= document.createElement('button');
                button.className="delete-button";
                button.innerHTML= 'Rimuovi';

                d.append(button);

                div.append(span, d);

                this.elemList.appendChild(div);
            })
        }

        console.log(elems)
    }

    bindDeleteElem(handler) {
        this.elemList.addEventListener('click', event => {
            console.log(event);
            if (event.target.className == 'delete-button') {
                const id = parseInt(event.target.parentElement.parentElement.id)

                console.log(id)
    
                handler(id)
          }
        })
    }

    bindResetElem(handler){
        this.reset.addEventListener('click', event =>{
            console.log("Premuto reset")
            if(event.target.className =='reset-button') {
                handler();
            }
        })
    }

    bindAddElem(handler) {
        this.add.addEventListener('click', ()=>{
            console.log("premuto aggiungi elemento");
            handler();
        })
    }
    
}


class Controller {
    constructor(model, view) {
        this.model = model
        this.view = view

        // Explicit this binding
        this.model.bindElemListChanged(this.onElemListChanged)
        this.view.bindDeleteElem(this.handleDeleteElem)
        this.view.bindResetElem(this.handlerResetElem)
        this.view.bindAddElem(this.handlerAddElem)
    
        // Display initial elems
        this.onElemListChanged(this.model.elems)
    }
    
    onElemListChanged = elems => {
        this.view.displayElems(elems)
    }

    handleDeleteElem = (id) => {
        this.model.deleteElem(id)
    }

    handlerResetElem = () =>{
        this.model.resetElem();
    }

    handlerAddElem =() =>{
        this.model.addTo("00.00", "Nuovo container");
    }

}

const app = new Controller(new Model(), new View())

