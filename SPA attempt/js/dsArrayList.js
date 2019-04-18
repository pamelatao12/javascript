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
class ArrayListModel extends EventEmitter {

    constructor() {
        super();
        this.array = [];
        this.size = 0;
        this.elemIndex;
    }

    addIndex(object, index) {
        // expand list if array.length is filled
        if (this.array.size + 1 == this.array.length) {
            this.array.length *= 2;
        }

        for (var i = this.size - 1; i >= index; i--) {
            this.array[i + 1] = this.array[i];
        }
        this.array[index] = object;
        this.size++;
        this.emit('elementInserted');
        this.emit('updateSize', this.size);
    }

    add(object) {
        // expand list if array.length is filled
        if (this.array.size + 1 == this.array.length) {
            this.array.length *= 2;
        }

        this.array[this.size] = object;
        this.size++;
        this.emit('elementAdded');
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
        this.emit('elementRemoved');
        this.emit('updateSize', this.size);
    }

    set(index, replaceObjectWith) {
        this.array[Number(index)] = replaceObjectWith;
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

    getArray() {
        return this.array;
    }

    getLength() {
        return this.array.length;
    }

    getElemIndex() {
    	return this.elemIndex;
    }
}

class ArrayListController {
    constructor(model, view) {
        this._model = model;
        this._view = view;
        view.on("createButtonClicked", () => this.createArray());
        view.on("addButtonClicked", () => this.addElement());
        view.on("replaceButtonClicked", () => this.replaceElement());
        view.on("removeButtonClicked", () => this.removeElement());
        view.on("containsButtonClicked", () => this.containsElement());
        view.on("getButtonClicked", () => this.getElement());
        view.on("indexOfButtonClicked", () => this.indexOfElement());
        view.on("clearButtonClicked", () => this.clearList());
    }

    createArray() {
        this._view.drawArray();
    }

    addElement() {
	    var element = this._view.getAddedElement();
	    var index = this._view.getAddedIndex();

	    if (Number(index) > this._model.size) {
	    	this._view.showPositionError();
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


class ArrayListView extends EventEmitter {

    constructor(model, elements) {
        super();
        this._model = model;
        this._elements = elements;

        model.on('elementAdded', () => this.fillArray());
        model.on('elementInserted', () => this.insertArray());
        model.on('elementReplaced', () => this.fillArray());
        model.on('elementRemoved', () => this.fillArray());
        model.on('elementGot', element => this.getResultElement(element));
        model.on('updateSize', size => this.changeSize(size));
        model.on('listCleared', () => this.fillArray());

        elements.createButton.addEventListener("click", () => this.emit("createButtonClicked"));
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

    //style nav bar buttons
    defaultNavStyles() {
        const btnElements = document.getElementsByClassName("ALactionNavs");
        Array.prototype.forEach.call(btnElements, function (element) {
            element.style.backgroundColor = "slategray";
            element.style.color = "white";
        });
        const actionElements = document.getElementsByClassName("ALmethods");
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
    	return document.getElementById("ALenterIndex").value;
    }

    fillArray() {
    	var array = this._model.getArray();
    	for (var i = 0; i < this._model.getLength(); i++) {
    		var elemId = "ALindex" + i;
    		if (array[i] == undefined) {
    			document.getElementById(elemId).innerHTML = "";
    		} else {
    			document.getElementById(elemId).innerHTML = array[i];
    			document.getElementById(elemId).style.color = "black";
    		}
    	}
    }

    insertArray() {
        if (this.getAddedIndex() != "") {
            var array = this._model.getArray();
            var i = this._model.size - 1;
            this.insertTimeout(i);

            var elemId = "ALindex" + this.getAddedIndex();
            document.getElementById(elemId).innerHTML = array[this.getAddedIndex()];
            document.getElementById(elemId).style.color = "black";
        }
    }

    insertTimeout(i) {
        // BB HELP HELP HELP ON SETTIMEOUT
        if (i > this.getAddedIndex()) {
        
            var array = this._model.getArray();
            var elemId = "ALindex" + i;
            var pastElemId = "ALindex" + (i - 1);
            
            document.getElementById(elemId).innerHTML = array[i];
            document.getElementById(elemId).style.color = "black";
            document.getElementById(pastElemId).innerHTML = "";
            i--;
            setTimeout(this.insertTimeout(i), 5000);
        }
        
    }

    getReplacedIndex() {
    	return document.getElementById("ALset").value;
    }

    getNewElement() {
    	return document.getElementById("ALreplaceWith").value;
    }

    getRemovedElement() {
    	return document.getElementById("ALremove").value;
    }

    getRemovedIndex() {
        return document.getElementById("ALremoveIndex").value;
    }

    getContainsElement() {
        return document.getElementById("ALcontains").value;
    }

    elementDoesNotExist() {
        document.getElementById("ALresult").innerHTML = "False!";
        document.getElementById("ALresult").style.fontWeight = "bolder";
    }

    elementExists() {
        document.getElementById("ALresult").innerHTML = "True!";
        document.getElementById("ALresult").style.fontWeight = "bolder";
    }

    resetElementResult() {
        document.getElementById("ALresult").innerHTML = "";
    }

    getGetElement() {
        return document.getElementById("ALgetIndex").value;
    }

    getResultElement(element) {
        if (element == undefined) {
            document.getElementById("ALgetResult").innerHTML = "*No element at specified index";
            document.getElementById("ALgetResult").style.color = "red";
        } else {
            document.getElementById("ALgetResult").style.color = "black";
            document.getElementById("ALgetResult").innerHTML = "Element: " + element;
            document.getElementById("ALgetResult").style.fontWeight = "bolder";
        }
    }

    resetGet() {
        document.getElementById("ALgetResult").innerHTML = "";
    }

    getIndexOfElement() {
        return document.getElementById("ALindexOf").value;
    }

    returnIndexOf(index) {
        document.getElementById("ALindexOfResult").innerHTML = "Index of element: " + index;
        document.getElementById("ALindexOfResult").style.fontWeight = "bolder";
    }


    getSizeInput() {
    	if (this._elements.size.value == "") {
    		return undefined;
    	}
    	return Number(this._elements.size.value);
    }

    changeSize(size) {
        document.getElementById("ALsizeDisplay").innerHTML = size;
    }

    drawArray() {
    	//clear elems first
    	const elements = document.getElementsByClassName("ALelems");
		while (elements.length > 1) elements[1].remove();
		this._elements.arrayElem.innerHTML = "";

        var size = this.getSizeInput();
        if (size == 0) {
        	this.showError();
        } else if (size == undefined) {
            this.hideError();
            this._elements.arrayElem.style.display = "inline-block";
            for (var i = 1; i < 10; i++) {
                var newElem = this._elements.arrayElem.cloneNode(true);
                var newId = "ALindex" + i;
                newElem.id = newId;
                newElem.style.borderLeft = "none";
                this._elements.allElements.appendChild(newElem);
            }
        } else {
        	this.hideError();
        	this._elements.arrayElem.style.display = "inline-block";
	        for (var i = 1; i < size; i++) {
	        	var newElem = this._elements.arrayElem.cloneNode(true);
	        	var newId = "ALindex" + i;
	        	newElem.id = newId;
	        	this._elements.allElements.appendChild(newElem);
	        }
	    }
    }

    removeError() {
        document.getElementById("ALremoveError").innerHTML = "*Please enter a valid index position";
        document.getElementById("ALremoveError").style.display = "inline-block";
    }

    hideRemoveError() {
        document.getElementById("ALremoveError").style.display = "none";
    }

    removeBothError() {
        document.getElementById("ALremoveError").innerHTML = "*Only one input allowed";
        document.getElementById("ALremoveError").style.display = "inline-block";
    }

    removeInvalidElement() {
        document.getElementById("ALremoveError").innerHTML = "*Element not in list";
        document.getElementById("ALremoveError").style.display = "inline-block";
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

    setError() {
        document.getElementById("ALsetError").style.color = "red";
        document.getElementById("ALsetError").innerHTML = " *Please enter a valid index position";
        document.getElementById("ALsetError").style.display = "inline-block";
    }

    setElementError() {
        document.getElementById("ALsetError").style.color = "red";
        document.getElementById("ALsetError").innerHTML = " *Please enter a valid element";
        document.getElementById("ALsetError").style.display = "inline-block";
    
    }

    hideSetError() {
        document.getElementById("ALsetError").style.display = "none";
    }

}
