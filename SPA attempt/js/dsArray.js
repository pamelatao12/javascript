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
class ArrayModel extends EventEmitter {

    constructor() {
        super();
        this.array = [];
        // this.length = 0;
        this.elemIndex;
    }

    add(object, index) {
        this.array[index] = object;
        this.emit('elementAdded');
    }

    remove(object) {
        // arraylist animation to only shift subsequent elements over one at a time
        this.elemIndex = this.getIndex(object);
        this.array[this.elemIndex] = undefined;
        this.emit('elementRemoved');
    }

    set(object, replaceObjectWith) {
        this.elemIndex = this.getIndex(object);
        this.array[this.elemIndex] = replaceObjectWith;
        this.emit('elementReplaced');
    }

    getIndex(object) {
        for (var i = 0; i < this.array.length; i++) {
            if (this.array[i] == object) {
                return i;
            }
        }
        return -1;
    }

    clearArray() {
        this.array.length = 0;
    }

    getArray() {
        return this.array;
    }

    getSize() {
        return this.array.length;
    }

    getElemIndex() {
    	return this.elemIndex;
    }
}

class ArrayController {
    constructor(model, view) {
        this._model = model;
        this._view = view;
        view.on("createButtonClicked", () => this.createArray());
        view.on("addButtonClicked", () => this.addElement());
        view.on("replaceButtonClicked", () => this.replaceElement());
        view.on("removeButtonClicked", () => this.removeElement());
    }

    createArray() {
        this._model.clearArray();
        this._view.drawArray();
    }

    addElement() {
	    var element = this._view.getAddedElement();
	    var index = this._view.getAddedIndex();

	    if (index == "" || index >= this._view.getSizeInput()) {
	    	this._view.showPositionError();
	    } else {
	    	this._view.hidePositionError();
	    	this._model.add(element, Number(index));
	    }
    }

    replaceElement() {
    	var element = this._view.getReplacedElement();
    	var newElement = this._view.getNewElement();
    	this._model.set(element, newElement);
    }

    removeElement() {
    	var element = this._view.getRemovedElement();
    	this._model.remove(element);
    }

}


class ArrayView extends EventEmitter {

    constructor(model, elements) {
        super();
        this._model = model;
        this._elements = elements;

        model.on('elementAdded', () => this.fillArray());
        model.on('elementReplaced', () => this.fillArray());
        model.on('elementRemoved', () => this.fillArray());

        elements.createButton.addEventListener("click", () => this.emit("createButtonClicked"));
        elements.addButton.addEventListener("click", () => this.emit("addButtonClicked"));
        elements.removeButton.addEventListener("click", () => this.emit("removeButtonClicked"));
        elements.replaceButton.addEventListener("click", () => this.emit("replaceButtonClicked"));


        elements.addNav.addEventListener("click", () => this.addNavStyle())
        elements.removeNav.addEventListener("click", () => this.removeNavStyle());
        elements.replaceNav.addEventListener("click", () => this.replaceNavStyle());


        

    }

    addNavStyle() {
    	this._elements.addAction.style.display = "block";
    	this._elements.removeAction.style.display = "none";
    	this._elements.replaceAction.style.display = "none";

    	this._elements.addNav.style.backgroundColor = "snow";
    	this._elements.addNav.style.color = "black";

    	this._elements.removeNav.style.backgroundColor = "slategray";
    	this._elements.removeNav.style.color = "white";
    	this._elements.replaceNav.style.backgroundColor = "slategray";
    	this._elements.replaceNav.style.color = "white";
    }

    removeNavStyle() {
		this._elements.addAction.style.display = "none";
    	this._elements.removeAction.style.display = "block";
    	this._elements.replaceAction.style.display = "none";

    	this._elements.removeNav.style.backgroundColor = "snow";
    	this._elements.removeNav.style.color = "black";

    	this._elements.addNav.style.backgroundColor = "slategray";
    	this._elements.addNav.style.color = "white";
    	this._elements.replaceNav.style.backgroundColor = "slategray";
    	this._elements.replaceNav.style.color = "white";
    }

    replaceNavStyle() {
    	this._elements.addAction.style.display = "none";
    	this._elements.removeAction.style.display = "none";
    	this._elements.replaceAction.style.display = "block";

    	this._elements.replaceNav.style.backgroundColor = "snow";
    	this._elements.replaceNav.style.color = "black";

    	this._elements.addNav.style.backgroundColor = "slategray";
    	this._elements.addNav.style.color = "white";
    	this._elements.removeNav.style.backgroundColor = "slategray";
    	this._elements.removeNav.style.color = "white";
    }

    getAddedElement() {
        return this._elements.add.value;
    }

    getAddedIndex() {
    	return document.getElementById("AenterIndex").value;
    }

    fillArray() {
    	var array = this._model.getArray();
    	for (var i = 0; i < this._model.getSize(); i++) {
    		var elemId = "Aindex" + i;
    		if (array[i] == undefined) {
    			document.getElementById(elemId).innerHTML = "";
    		} else {
    			document.getElementById(elemId).innerHTML = "<span id='AhoverIndex" + i + "' style='display:none' onmouseover='mouseOver(" + elemId + ", AhoverIndex" + i + ")' onmouseout='mouseOut(AhoverIndex" + i + "," + elemId + ")'>Index " + i + "</span>" + array[i];
    			document.getElementById(elemId).style.color = "black";
    		}
    	}
        
    }

    getReplacedElement() {
    	return document.getElementById("Areplace").value;
    }

    getNewElement() {
    	return document.getElementById("AreplaceWith").value;
    }

    getRemovedElement() {
    	return document.getElementById("Aremove").value;
    }

    getSizeInput() {
    	if (this._elements.size.value == "") {
    		return undefined;
    	}
    	return Number(this._elements.size.value);
    }

    drawArray() {
    	//clear elems first
    	const elements = document.getElementsByClassName("Aelems");
		while (elements.length > 1) elements[1].remove();
		this._elements.arrayElem.innerHTML = "";

        var size = this.getSizeInput();
        if (size == undefined || size == 0) {
        	this.showError();
        } else {
        	this.hideError();
        	this._elements.arrayElem.style.display = "inline-block";
	        for (var i = 1; i < size; i++) {
	        	var newElem = this._elements.arrayElem.cloneNode(true);
	        	var newId = "Aindex" + i;
	        	newElem.id = newId;
                newElem.style.borderLeft = "none";
	        	this._elements.allElements.appendChild(newElem);
	        }
	    }
    }

    showError() {
    	this._elements.error.style.display = "inline-block";
    }

    hideError() {
    	this._elements.error.style.display = "none";
    }

    showPositionError() {
    	this._elements.positionError.style.display = "inline-block";
    }

    hidePositionError() {
    	this._elements.positionError.style.display = "none";
    }
}
