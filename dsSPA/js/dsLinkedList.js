// class EventEmitter {
//     constructor() {
//         this._events = {};
//     }
//     // for adding event handler
//     on(event, listener) {
//         (this._events[event] || (this._events[event] = [])).push(listener);
//         return this;
//     }
//     // for calling event handlers for specified event
//     emit(event, arg) {
//         (this._events[event] || []).slice().forEach(lsn => lsn(arg));
//     }
// }


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
        this.index = 1;

        model.on('elementAdded', size => this.drawNode(size));
        model.on('elementInserted', index => this.insertNode(index));
        model.on('elementReplaced', index => this.replaceLL(index));
        model.on('elementRemoved', index => this.removeNode(index));
        model.on('elementGot', element => this.getResultElement(element));
        model.on('updateSize', size => this.changeSize(size));
        model.on('listCleared', () => this.clearLL());

        elements.LLaddButton.addEventListener("click", () => this.emit("addButtonClicked"));
        elements.LLremoveButton.addEventListener("click", () => this.emit("removeButtonClicked"));
        elements.LLcontainsButton.addEventListener("click", () => this.emit("containsButtonClicked"));
        elements.LLgetButton.addEventListener("click", () => this.emit("getButtonClicked"));
        elements.LLindexButton.addEventListener("click", () => this.emit("indexOfButtonClicked"));
        elements.LLclearButton.addEventListener("click", () => this.emit("clearButtonClicked"));
        elements.LLreplaceButton.addEventListener("click", () => this.emit("replaceButtonClicked"));


        elements.LLaddNav.addEventListener("click", () => this.addNavStyle())
        elements.LLremoveNav.addEventListener("click", () => this.removeNavStyle());
        elements.LLreplaceNav.addEventListener("click", () => this.replaceNavStyle());
        elements.LLcontainsNav.addEventListener("click", () => this.containsNavStyle());
        elements.LLgetNav.addEventListener("click", () => this.getNavStyle());
        elements.LLindexNav.addEventListener("click", () => this.indexNavStyle());
        elements.LLsizeNav.addEventListener("click", () => this.sizeNavStyle());
        elements.LLclearNav.addEventListener("click", () => this.clearNavStyle());
        

    }

    drawNode(size) {
        var array = this._model.array;
        var i = size;
        if (this._model.size == 1) {
            this._elements.LLarrayElem.style.display = "inline-block";
            this._elements.LLarrayElem.innerHTML = array[0];
            this._elements.LLarrayElem.style.color = "black";
        } else {
            var newArrow = this._elements.LLarrow.cloneNode(true);
            newArrow.style = "opacity:1;display:inline-block";
            this._elements.LLallElements.appendChild(newArrow);
            var newElem = this._elements.LLarrayElem.cloneNode(true);
            newElem.id = "LLindex" + this.index++;
            newElem.innerHTML = this.getAddedElement();
            this._elements.LLallElements.appendChild(newElem);
        }
    }

    insertNode(index) {
        const elems = document.getElementById("LLelements");
        const elements = document.getElementsByClassName("LLelems");
        const arrows = document.getElementsByClassName("LLarrow");
        var newArrow = this._elements.LLarrow.cloneNode(true);
        newArrow.style = "opacity:1;display:inline-block";
        var newElem = this._elements.LLarrayElem.cloneNode(true);
        newElem.id = "LLindex" + this.index++;
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
        const elems = document.getElementById("LLelements");
        var newElem = this._elements.LLarrayElem.cloneNode(true);
        newElem.innerHTML = this.getNewElement();
        elems.insertBefore(newElem, arrows[index + 1]);
    }

    //style nav bar buttons
    defaultNavStyles() {
        const btnElements = document.getElementsByClassName("LLactionNavs");
        Array.prototype.forEach.call(btnElements, function (element) {
            element.style.backgroundColor = "slategray";
            element.style.color = "white";
        });
        const actionElements = document.getElementsByClassName("LLmethods");
        Array.prototype.forEach.call(actionElements, function (action) {
            action.style.display = "none";
        });
    }

    addNavStyle() {
        this.defaultNavStyles();
        this._elements.LLaddAction.style.display = "block";
        this._elements.LLaddNav.style.backgroundColor = "snow";
        this._elements.LLaddNav.style.color = "black";
    }

    removeNavStyle() {
        this.defaultNavStyles();
        this._elements.LLremoveAction.style.display = "block";
        this._elements.LLremoveNav.style.backgroundColor = "snow";
        this._elements.LLremoveNav.style.color = "black";
    }

    replaceNavStyle() {
        this.defaultNavStyles();
        this._elements.LLsetAction.style.display = "block";
        this._elements.LLreplaceNav.style.backgroundColor = "snow";
        this._elements.LLreplaceNav.style.color = "black";
    }

    containsNavStyle() {
        this.defaultNavStyles();
        this._elements.LLcontainsAction.style.display = "block";
        this._elements.LLcontainsNav.style.backgroundColor = "snow";
        this._elements.LLcontainsNav.style.color = "black";
    }

    getNavStyle() {
        this.defaultNavStyles();
        this._elements.LLgetAction.style.display = "block";
        this._elements.LLgetNav.style.backgroundColor = "snow";
        this._elements.LLgetNav.style.color = "black";
    }

    indexNavStyle() {
        this.defaultNavStyles();
        this._elements.LLindexAction.style.display = "block";
        this._elements.LLindexNav.style.backgroundColor = "snow";
        this._elements.LLindexNav.style.color = "black";
    }

    sizeNavStyle() {
        this.defaultNavStyles();
        this._elements.LLsizeAction.style.display = "block";
        this._elements.LLsizeNav.style.backgroundColor = "snow";
        this._elements.LLsizeNav.style.color = "black";
    }

    clearNavStyle() {
        this.defaultNavStyles();
        this._elements.LLclearAction.style.display = "block";
        this._elements.LLclearNav.style.backgroundColor = "snow";
        this._elements.LLclearNav.style.color = "black";
    }
    // end style nav bar buttons


    getAddedElement() {
        return this._elements.LLadd.value;
    }

    getAddedIndex() {
        return document.getElementById("LLenterIndex").value;
    }

    getReplacedIndex() {
        return document.getElementById("LLset").value;
    }

    getNewElement() {
        return document.getElementById("LLreplaceWith").value;
    }

    getRemovedElement() {
        return document.getElementById("LLremove").value;
    }

    getRemovedIndex() {
        return document.getElementById("LLremoveIndex").value;
    }

    getContainsElement() {
        return document.getElementById("LLcontains").value;
    }

    elementDoesNotExist() {
        document.getElementById("LLresult").innerHTML = "False!";
        document.getElementById("LLresult").style.fontWeight = "bolder";
    }

    elementExists() {
        document.getElementById("LLresult").innerHTML = "True!";
        document.getElementById("LLresult").style.fontWeight = "bolder";
    }

    resetElementResult() {
        document.getElementById("LLresult").innerHTML = "";
    }

    getGetElement() {
        return document.getElementById("LLgetIndex").value;
    }

    getResultElement(element) {
        if (element == undefined) {
            document.getElementById("LLgetResult").innerHTML = "*No element at specified index";
            document.getElementById("LLgetResult").style.color = "red";
        } else {
            document.getElementById("LLgetResult").style.color = "black";
            document.getElementById("LLgetResult").innerHTML = "Element: " + element;
            document.getElementById("LLgetResult").style.fontWeight = "bolder";
        }
    }

    resetGet() {
        document.getElementById("LLgetResult").innerHTML = "";
    }

    getIndexOfElement() {
        return document.getElementById("LLindexOf").value;
    }

    returnIndexOf(index) {
        document.getElementById("LLindexOfResult").innerHTML = "Index of element: " + index;
        document.getElementById("LLindexOfResult").style.fontWeight = "bolder";
    }

    getSizeInput() {
        if (this._elements.LLsize.value == "") {
            return undefined;
        }
        return Number(this._elements.LLsize.value);
    }

    changeSize(size) {
        document.getElementById("LLsizeDisplay").innerHTML = size;
    }

    removeError() {
        document.getElementById("LLremoveError").innerHTML = "*Please enter a valid index position";
        document.getElementById("LLremoveError").style.display = "inline-block";
    }

    hideRemoveError() {
        document.getElementById("LLremoveError").style.display = "none";
    }

    removeBothError() {
        document.getElementById("LLremoveError").innerHTML = "*Only one input allowed";
        document.getElementById("LLremoveError").style.display = "inline-block";
    }

    removeInvalidElement() {
        document.getElementById("LLremoveError").innerHTML = "*Element not in list";
        document.getElementById("LLremoveError").style.display = "inline-block";
    }

    showPositionError() {
        this._elements.LLpositionError.innerHTML = "*Please enter a valid index position";
        this._elements.LLpositionError.style.display = "inline-block";
    }

    hidePositionError() {
        this._elements.LLpositionError.style.display = "none";
    }

    showInvalidElement() {
        this._elements.LLpositionError.style.display = "inline-block";
        this._elements.LLpositionError.innerHTML = "*Please enter a valid element";
    }

    setError() {
        document.getElementById("LLsetError").style.color = "red";
        document.getElementById("LLsetError").innerHTML = " *Please enter a valid index position";
        document.getElementById("LLsetError").style.display = "inline-block";
    }

    setElementError() {
        document.getElementById("LLsetError").style.color = "red";
        document.getElementById("LLsetError").innerHTML = " *Please enter a valid element";
        document.getElementById("LLsetError").style.display = "inline-block";
    
    }

    hideSetError() {
        document.getElementById("LLsetError").style.display = "none";
    }

}
