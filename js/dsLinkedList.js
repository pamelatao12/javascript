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
class LLModel extends EventEmitter {

    constructor() {
        super();
        this.array = [];
        this.size = 0;
        this.elemIndex;
    }

    addIndex(object, index) {
        for (var i = this.size - 1; i >= index; i--) {
            this.array[i + 1] = this.array[i];
        }
        this.array[index] = object;
        this.size++;
        this.emit('elementInserted', index);
        this.emit('updateSize', this.size);
    }

    add(object) {
        this.array[this.size] = object;
        this.size++;
        this.emit('elementAdded', this.size);
        this.emit('updateSize', this.size);
    }

    remove(index) {
        // arraylist animation to only shift subsequent elements over one at a time
        this.elemIndex = index;
        if (this.elemIndex == -1) return; //element not in list

        for (var i = this.elemIndex; i < this.size; i++) {
            this.array[i] = this.array[i + 1];
        }
        this.size--;
        this.emit('elementRemoved', index);
        this.emit('updateSize', this.size);
    }

    set(index, replaceObjectWith) {
        this.array[Number(index)] = replaceObjectWith;
        this.emit('elementReplaced', Number(index));
    }

    getIndex(object) {
        for (var i = 0; i < this.array.length; i++) {
            if (this.array[i] == object) {
                return i;
            }
        }
        return -1;
    }

    get(index) {
        this.emit('elementGot', this.array[index]);
        return this.array[index];
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

class LLController {
    constructor(model, view) {
        this._model = model;
        this._view = view;
        view.on("addButtonClicked", () => this.addElement());
        view.on("replaceButtonClicked", () => this.replaceElement());
        view.on("removeButtonClicked", () => this.removeElement());
        view.on("containsButtonClicked", () => this.containsElement());
        view.on("getButtonClicked", () => this.getElement());
        view.on("indexOfButtonClicked", () => this.indexOfElement());
        view.on("clearButtonClicked", () => this.clearList());
    }

    addElement() {
        var element = this._view.getAddedElement();
        var index = this._view.getAddedIndex();

        if (Number(index) > this._model.size) {
            this._view.showPositionError();
        } else if (element == "") {
            this._view.showInvalidElement();
        } else if (index == "") {
            this._view.hidePositionError();
            this._model.add(element);
        } else {
            this._view.hidePositionError();
            this._model.addIndex(element, Number(index));
        }
    }

    replaceElement() {
        var index = this._view.getReplacedIndex();
        var newElement = this._view.getNewElement();
        if (index >= this._model.size || index == "") {
            this._view.setError();
            return;
        } 

        if (newElement == "") {
            this._view.setElementError();
            return;
        }
        this._view.hideSetError();
        this._model.set(index, newElement);
    }

    removeElement() {
        var removeIndex = this._view.getRemovedIndex();
        var element = this._view.getRemovedElement();
        if ((removeIndex != "" && element != "")) {
            this._view.removeBothError();
            return;
        }

        if ((removeIndex == "" && element == "") ||
            (Number(removeIndex) >= this._model.size)) {
            this._view.removeError();
            return;
        } 
        

        if (this._model.getIndex(element) == -1 && removeIndex == "") {
            this._view.removeInvalidElement();
            return;
        }

        if (element != "") {
           removeIndex = this._model.getIndex(element);
        }
        this._view.hideRemoveError();
        this._model.remove(Number(removeIndex));
    }

    containsElement() {
        this._view.resetElementResult();
        var element = this._view.getContainsElement();
        if (element == "") {
            this._view.resetElementResult();
        } else if (this._model.getIndex(element) == -1) {
            this._view.elementDoesNotExist();
        } else {
            this._view.elementExists();
        }
    }

    getElement() {
        var index = this._view.getGetElement();
        this._view.resetGet();
        this._model.get(index);
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


class LLView extends EventEmitter {

    constructor(model, elements) {
        super();
        this._model = model;
        this._elements = elements;

        model.on('elementAdded', size => this.drawNode(size));
        model.on('elementInserted', index => this.insertNode(index));
        model.on('elementReplaced', index => this.replaceLL(index));
        model.on('elementRemoved', index => this.removeNode(index));
        model.on('elementGot', element => this.getResultElement(element));
        model.on('updateSize', size => this.changeSize(size));
        model.on('listCleared', () => this.clearLL());

        elements.addButton.addEventListener("click", () => this.emit("addButtonClicked"));
        elements.removeButton.addEventListener("click", () => this.emit("removeButtonClicked"));
        elements.containsButton.addEventListener("click", () => this.emit("containsButtonClicked"));
        elements.getButton.addEventListener("click", () => this.emit("getButtonClicked"));
        elements.indexButton.addEventListener("click", () => this.emit("indexOfButtonClicked"));
        elements.clearButton.addEventListener("click", () => this.emit("clearButtonClicked"));
        elements.replaceButton.addEventListener("click", () => this.emit("replaceButtonClicked"));


        elements.addNav.addEventListener("click", () => this.addNavStyle())
        elements.removeNav.addEventListener("click", () => this.removeNavStyle());
        elements.replaceNav.addEventListener("click", () => this.replaceNavStyle());
        elements.containsNav.addEventListener("click", () => this.containsNavStyle());
        elements.getNav.addEventListener("click", () => this.getNavStyle());
        elements.indexNav.addEventListener("click", () => this.indexNavStyle());
        elements.sizeNav.addEventListener("click", () => this.sizeNavStyle());
        elements.clearNav.addEventListener("click", () => this.clearNavStyle());
        

    }

    drawNode(size) {
        var array = this._model.array;
        var i = size;
        if (this._model.size == 1) {
            this._elements.arrayElem.style.display = "inline-block";
            this._elements.arrayElem.innerHTML = array[0];
            this._elements.arrayElem.style.color = "black";
        } else {
            var newArrow = this._elements.arrow.cloneNode(true);
            newArrow.style = "opacity:1;display:inline-block";
            this._elements.allElements.appendChild(newArrow);
            var newElem = this._elements.arrayElem.cloneNode(true);
            newElem.innerHTML = this.getAddedElement();
            this._elements.allElements.appendChild(newElem);
        }
    }

    insertNode(index) {
        const elems = document.getElementById("elements");
        const elements = document.getElementsByClassName("LLelems");
        const arrows = document.getElementsByClassName("arrow");
        var newArrow = this._elements.arrow.cloneNode(true);
        newArrow.style = "opacity:1;display:inline-block";
        var newElem = this._elements.arrayElem.cloneNode(true);
        newElem.innerHTML = this.getAddedElement();
        elems.insertBefore(newElem, elements[index]);
        elems.insertBefore(newArrow, elements[index + 1]);
    }

    removeNode(index) {
        if (index == 0) {
            const arrows = document.getElementsByClassName("LLarrow");
            arrows[1].remove();
        } else {
            const arrows = document.getElementsByClassName("LLarrow");
        arrows[index].remove();
        }
        const elements = document.getElementsByClassName("LLelems");
        elements[index].remove();
    }

    clearLL() {
        const elements = document.getElementsByClassName("LLelems");
        elements[0].style.display = "none";
        while (elements.length > 1) elements[1].remove();

        const arrows = document.getElementsByClassName("LLarrow");
        while (arrows.length > 1) arrows[1].remove();
    }

    replaceLL(index) {
        const arrows = document.getElementsByClassName("LLarrow");
        const elements = document.getElementsByClassName("LLelems");
        elements[index].remove();
        const elems = document.getElementById("elements");
        var newElem = this._elements.arrayElem.cloneNode(true);
        newElem.innerHTML = this.getNewElement();
        elems.insertBefore(newElem, arrows[index + 1]);
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

    replaceNavStyle() {
        this.defaultNavStyles();
        this._elements.setAction.style.display = "block";
        this._elements.replaceNav.style.backgroundColor = "snow";
        this._elements.replaceNav.style.color = "black";
    }

    containsNavStyle() {
        this.defaultNavStyles();
        this._elements.containsAction.style.display = "block";
        this._elements.containsNav.style.backgroundColor = "snow";
        this._elements.containsNav.style.color = "black";
    }

    getNavStyle() {
        this.defaultNavStyles();
        this._elements.getAction.style.display = "block";
        this._elements.getNav.style.backgroundColor = "snow";
        this._elements.getNav.style.color = "black";
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

    getAddedIndex() {
        return document.getElementById("enterIndex").value;
    }

    getReplacedIndex() {
        return document.getElementById("set").value;
    }

    getNewElement() {
        return document.getElementById("replaceWith").value;
    }

    getRemovedElement() {
        return document.getElementById("remove").value;
    }

    getRemovedIndex() {
        return document.getElementById("removeIndex").value;
    }

    getContainsElement() {
        return document.getElementById("contains").value;
    }

    elementDoesNotExist() {
        document.getElementById("result").innerHTML = "False!";
        document.getElementById("result").style.fontWeight = "bolder";
    }

    elementExists() {
        document.getElementById("result").innerHTML = "True!";
        document.getElementById("result").style.fontWeight = "bolder";
    }

    resetElementResult() {
        document.getElementById("result").innerHTML = "";
    }

    getGetElement() {
        return document.getElementById("getIndex").value;
    }

    getResultElement(element) {
        if (element == undefined) {
            document.getElementById("getResult").innerHTML = "*No element at specified index";
            document.getElementById("getResult").style.color = "red";
        } else {
            document.getElementById("getResult").style.color = "black";
            document.getElementById("getResult").innerHTML = "Element: " + element;
            document.getElementById("getResult").style.fontWeight = "bolder";
        }
    }

    resetGet() {
        document.getElementById("getResult").innerHTML = "";
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

    removeError() {
        document.getElementById("removeError").innerHTML = "*Please enter a valid index position";
        document.getElementById("removeError").style.display = "inline-block";
    }

    hideRemoveError() {
        document.getElementById("removeError").style.display = "none";
    }

    removeBothError() {
        document.getElementById("removeError").innerHTML = "*Only one input allowed";
        document.getElementById("removeError").style.display = "inline-block";
    }

    removeInvalidElement() {
        document.getElementById("removeError").innerHTML = "*Element not in list";
        document.getElementById("removeError").style.display = "inline-block";
    }

    showPositionError() {
        this._elements.positionError.innerHTML = "*Please enter a valid index position";
        this._elements.positionError.style.display = "inline-block";
    }

    hidePositionError() {
        this._elements.positionError.style.display = "none";
    }

    showInvalidElement() {
        this._elements.positionError.style.display = "inline-block";
        this._elements.positionError.innerHTML = "*Please enter a valid element";
    }

    setError() {
        document.getElementById("setError").style.color = "red";
        document.getElementById("setError").innerHTML = " *Please enter a valid index position";
        document.getElementById("setError").style.display = "inline-block";
    }

    setElementError() {
        document.getElementById("setError").style.color = "red";
        document.getElementById("setError").innerHTML = " *Please enter a valid element";
        document.getElementById("setError").style.display = "inline-block";
    
    }

    hideSetError() {
        document.getElementById("setError").style.display = "none";
    }

}

window.onload = function() {
    const model = new LLModel(['node.js', 'react']);
    const view = new LLView(model, {
        'size': document.getElementById("size"),
        'error' : document.getElementById("error"),
        'positionError' : document.getElementById("positionError"),
        'addNav' : document.getElementById("addNav"),
        'removeNav' : document.getElementById("removeNav"),
        'replaceNav' : document.getElementById("replaceNav"),
        'containsNav' : document.getElementById("containsNav"),
        'getNav' : document.getElementById("getNav"),
        'indexNav' : document.getElementById("indexNav"),
        'sizeNav' : document.getElementById("sizeNav"),
        'clearNav' : document.getElementById("clearNav"),

        'addButton': document.getElementById("addBtn"),
        'add': document.getElementById("add"),
        'removeButton': document.getElementById("removeBtn"),
        'containsButton' : document.getElementById("containsBtn"),
        'getButton' : document.getElementById("getBtn"),
        'indexButton' : document.getElementById("indexBtn"),
        'replaceButton': document.getElementById("replaceBtn"),
        'clearButton' : document.getElementById("clearBtn"),
        'arrayElem' : document.getElementById("index0"),
        'arrow' : document.getElementById("arrow0"),
        
        'addAction' : document.getElementById("addAction"),
        'removeAction' : document.getElementById("removeAction"),
        'containsAction' : document.getElementById("containsAction"),
        'getAction' : document.getElementById("getAction"),
        'indexAction' : document.getElementById("indexAction"),
        'setAction' : document.getElementById("setAction"),
        'sizeAction' : document.getElementById("sizeAction"),
        'clearAction' : document.getElementById("clearAction"),
        

        'allElements' : document.getElementById("elements")
    });
    const controller = new LLController(model, view);
}