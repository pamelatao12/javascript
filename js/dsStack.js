class EventEmitter {
    constructor() {
        this._events = {};
    }
    // for adding event handler
    on(event, listener) {
        (this._events[event] || (this._events[event] = [])).push(listener);
        return this;
    }
    // for calling event handlers for specified event
    emit(event, arg) {
        (this._events[event] || []).slice().forEach(lsn => lsn(arg));
    }
}


/**
 * The Model - stores data, notifies observers about changes
 */
class Model extends EventEmitter {

    constructor() {
        super();
        this.array = [];
        this.size = 0;
        this.elemIndex;
    }

    push(object) {
        for (var i = this.size - 1; i >= 0; i--) {
            this.array[i + 1] = this.array[i];
        }
        this.array[0] = object;
        this.size++;
        this.emit('elementInserted');
        this.emit('updateSize', this.size);
    }

    pop() {
        // arraylist animation to only shift subsequent elements over one at a time
        for (var i = 0; i < this.size; i++) {
            this.array[i] = this.array[i + 1];
        }
        this.size--;
        this.emit('elementRemoved');
        this.emit('updateSize', this.size);
    }

    peek() {
        var element = this.array[0];
        this.emit('elementPeeked', element)
        return element;
    }

    getIndex(object) {
        for (var i = 0; i < this.array.length; i++) {
            if (this.array[i] == object) {
                return i + 1;
            }
        }
        return -1;
    }

    clear() {
        for (var i = 0; i < this.size; i++) {
            this.array[i] = undefined;
        }
        this.size = 0;
        this.emit('listCleared');
        this.emit('updateSize', this.size);
    }
}

class Controller {
    constructor(model, view) {
        this._model = model;
        this._view = view;
        view.on("addButtonClicked", () => this.addElement());
        view.on("removeButtonClicked", () => this.removeElement());
        view.on("peekButtonClicked", () => this.peekElement());
        view.on("indexOfButtonClicked", () => this.indexOfElement());
        view.on("clearButtonClicked", () => this.clearList());
    }

    addElement() {
        var element = this._view.getAddedElement();
        
        if (element == "") {
            this._view.showInvalidElement();
        } else {
            this._model.push(element);
        }
    }

    removeElement() {
        this._model.pop();
    }

    peekElement() {
        this._view.highlightElement();
    }

    indexOfElement() {
        var element = this._view.getIndexOfElement();
        var index = this._model.getIndex(element);
        this._view.returnIndexOf(index);
    }

    clearList() {
        this._model.clear();
    }

}


class View extends EventEmitter {

    constructor(model, elements) {
        super();
        this._model = model;
        this._elements = elements;

        model.on('elementInserted', () => this.insertNode());
        model.on('elementRemoved', () => this.removeNode());
        model.on('elementPeeked', () => this.highlightElement());
        model.on('updateSize', size => this.changeSize(size));
        model.on('listCleared', () => this.clearLL());

        elements.addButton.addEventListener("click", () => this.emit("addButtonClicked"));
        elements.removeButton.addEventListener("click", () => this.emit("removeButtonClicked"));
        elements.peekButton.addEventListener("click", () => this.emit("peekButtonClicked"));
        elements.indexButton.addEventListener("click", () => this.emit("indexOfButtonClicked"));
        elements.clearButton.addEventListener("click", () => this.emit("clearButtonClicked"));

        elements.addNav.addEventListener("click", () => this.addNavStyle())
        elements.removeNav.addEventListener("click", () => this.removeNavStyle());
        elements.containsNav.addEventListener("click", () => this.containsNavStyle());
        elements.indexNav.addEventListener("click", () => this.indexNavStyle());
        elements.sizeNav.addEventListener("click", () => this.sizeNavStyle());
        elements.clearNav.addEventListener("click", () => this.clearNavStyle());
    }

    insertNode() {
        if (this._model.size == 1) {
            this._elements.arrayElem.style.display = "block";
            this._elements.arrayElem.style.borderBottom = "1px solid #DB7093";
            this._elements.arrayElem.innerHTML = this.getAddedElement();
            // setTimeout(function(elements) {
            //     elements.arrayElem.style.right = "600px";
            // }, 500, this._elements);
        } else {
            const elems = document.getElementById("stackElements");
            const elements = document.getElementsByClassName("stackElems");
            var newElem = this._elements.arrayElem.cloneNode(true);
            newElem.style.display = "block";
            newElem.style.borderBottom = "none";
            newElem.innerHTML = this.getAddedElement();
            elems.insertBefore(newElem, elements[0]);
        }
    }

    removeNode() {
        if (this._model.size == 0) {
            this._elements.arrayElem.style.position = "none";
            this._elements.arrayElem.style.right = "";
            this._elements.arrayElem.style.animation = "none";
            this._elements.arrayElem.style.opacity = "";
            this._elements.arrayElem.style.transition = "none";

            this._elements.arrayElem.style.position = "relative";
            this._elements.arrayElem.style.right = "0px";
            this._elements.arrayElem.style.animation = "slide 2s forwards";
            this._elements.arrayElem.style.opacity = "0";
            this._elements.arrayElem.style.transition = "opacity 1s ease-in-out";

            setTimeout(function (elements) {
                elements.arrayElem.style.display = "none";
                elements.arrayElem.style.position = "";
                elements.arrayElem.style.right = "";
                elements.arrayElem.style.animation = "none";
                elements.arrayElem.style.opacity = "";
                elements.arrayElem.style.transition = "none";
            }, 1000, this._elements);
        } else {
            const elements = document.getElementsByClassName("stackElems");
            elements[0].style.position = "none";
            elements[0].style.right = "";
            elements[0].style.animation = "none";
            elements[0].style.opacity = "";
            elements[0].style.transition = "none";

            elements[0].style.position = "relative";
            elements[0].style.right = "0px";
            elements[0].style.animation = "slide 2s forwards";
            elements[0].style.opacity = "0";
            elements[0].style.transition = "opacity 1s ease-in-out";
            setTimeout(function(elements) {
                    elements[0].remove();
                }, 1000, elements);
        }
    }

    clearLL() {
        const elements = document.getElementsByClassName("stackElems");
        elements[elements.length - 1].style.display = "none";
        while (elements.length > 1) {
            elements[0].remove();
        }
    }

    highlightElement() {
        const elements = document.getElementsByClassName("stackElems");
        elements[0].style.animationName = "peek";
        elements[0].style.animationDuration = "1s";
        setTimeout(function () {
            elements[0].style.animationName = "none";
        }, 1000);
        // flash and then return to normal style
    }

    //style nav bar buttons
    defaultNavStyles() {
        const btnElements = document.getElementsByClassName("actionNavs");
        Array.prototype.forEach.call(btnElements, function (element) {
            element.style.backgroundColor = "slategray";
            element.style.color = "white";
        });
        const actionElements = document.getElementsByClassName("methods");
        Array.prototype.forEach.call(actionElements, function (action) {
            action.style.display = "none";
        });
    }

    addNavStyle() {
        this.defaultNavStyles();
        this._elements.addAction.style.display = "block";
        this._elements.addNav.style.backgroundColor = "snow";
        this._elements.addNav.style.color = "black";
    }

    removeNavStyle() {
        this.defaultNavStyles();
        this._elements.removeAction.style.display = "block";
        this._elements.removeNav.style.backgroundColor = "snow";
        this._elements.removeNav.style.color = "black";
    }

    containsNavStyle() {
        this.defaultNavStyles();
        this._elements.containsAction.style.display = "block";
        this._elements.containsNav.style.backgroundColor = "snow";
        this._elements.containsNav.style.color = "black";
    }

    indexNavStyle() {
        this.defaultNavStyles();
        this._elements.indexAction.style.display = "block";
        this._elements.indexNav.style.backgroundColor = "snow";
        this._elements.indexNav.style.color = "black";
    }

    sizeNavStyle() {
        this.defaultNavStyles();
        this._elements.sizeAction.style.display = "block";
        this._elements.sizeNav.style.backgroundColor = "snow";
        this._elements.sizeNav.style.color = "black";
    }

    clearNavStyle() {
        this.defaultNavStyles();
        this._elements.clearAction.style.display = "block";
        this._elements.clearNav.style.backgroundColor = "snow";
        this._elements.clearNav.style.color = "black";
    }
    // end style nav bar buttons


    getAddedElement() {
        return this._elements.add.value;
    }

    getIndexOfElement() {
        return document.getElementById("indexOf").value;
    }

    returnIndexOf(index) {
        document.getElementById("indexOfResult").innerHTML = "Index of element: " + index;
        document.getElementById("indexOfResult").style.fontWeight = "bolder";
    }

    getSizeInput() {
        if (this._elements.size.value == "") {
            return undefined;
        }
        return Number(this._elements.size.value);
    }

    changeSize(size) {
        document.getElementById("sizeDisplay").innerHTML = size;
    }

    showInvalidElement() {
        this._elements.positionError.style.display = "inline-block";
        this._elements.positionError.innerHTML = "*Please enter a valid element";
    }
}

window.onload = function() {
    const model = new Model(['node.js', 'react']);
    const view = new View(model, {
        'size': document.getElementById("size"),
        'error' : document.getElementById("error"),
        'positionError' : document.getElementById("positionError"),
        'addNav' : document.getElementById("addNav"),
        'removeNav' : document.getElementById("removeNav"),
        'containsNav' : document.getElementById("containsNav"),
        'indexNav' : document.getElementById("indexNav"),
        'sizeNav' : document.getElementById("sizeNav"),
        'clearNav' : document.getElementById("clearNav"),

        'addButton': document.getElementById("addBtn"),
        'add': document.getElementById("add"),
        'removeButton': document.getElementById("removeBtn"),
        'peekButton' : document.getElementById("peekBtn"),
        'indexButton' : document.getElementById("indexBtn"),
        'clearButton' : document.getElementById("clearBtn"),
        'arrayElem' : document.getElementById("stackIndex"),
        
        'addAction' : document.getElementById("addAction"),
        'removeAction' : document.getElementById("removeAction"),
        'containsAction' : document.getElementById("containsAction"),
        'indexAction' : document.getElementById("indexAction"),
        'sizeAction' : document.getElementById("sizeAction"),
        'clearAction' : document.getElementById("clearAction"),
        

        'allElements' : document.getElementById("stackElements")
    });
    const controller = new Controller(model, view);
}