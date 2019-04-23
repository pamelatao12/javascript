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

class Node {
    constructor(left, right, value) {
        this.left = left;
        this.right = right;
        this.val = value;
    }
}

/**
 * The Model - stores data, notifies observers about changes
 */
class TreeModel extends EventEmitter {

    constructor() {
        super();
        this.root = null;
        this.size = 0;
        this.elemIndex;
    }

    add(object) {
        this.root = this.addHelper(this.root, object);

        this.size++;
        this.emit('elementAdded', object);
        this.emit('updateSize', this.size);
    }

    addHelper(root, element) {
        if (root == null) {
            return new Node(null, null, element);
        }

         
        if (Number(element) > Number(root.val)) { // if element > root
            root.right = this.addHelper(root.right, element);
        } else if (Number(element) < Number(root.val)) {
            root.left = this.addHelper(root.left, element);
        }

        return root;
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

class TreeController {
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

        if (element == "") {
            this._view.showInvalidElement();
        // } else if (this._model.getIndex(element) != -1) {
        //     this._view.showInvalidElement();
        // }
        } else {
            this._view.hidePositionError();
            this._model.add(element);
        }
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


class TreeView extends EventEmitter {

    constructor(model, elements) {
        super();
        this._model = model;
        this._elements = elements;
        this._index = 1;

        model.on('elementAdded', object => this.drawNode(object));
        model.on('elementInserted', index => this.insertNode(index));
        model.on('elementReplaced', index => this.replaceLL(index));
        model.on('elementRemoved', index => this.removeNode(index));
        model.on('elementGot', element => this.getResultElement(element));
        model.on('updateSize', size => this.changeSize(size));
        model.on('listCleared', () => this.clearLL());

        elements.addButton.addEventListener("click", () => this.emit("addButtonClicked"));
        elements.removeButton.addEventListener("click", () => this.emit("removeButtonClicked"));
        elements.containsButton.addEventListener("click", () => this.emit("containsButtonClicked"));
        elements.clearButton.addEventListener("click", () => this.emit("clearButtonClicked"));

        elements.addNav.addEventListener("click", () => this.addNavStyle())
        elements.removeNav.addEventListener("click", () => this.removeNavStyle());
        elements.containsNav.addEventListener("click", () => this.containsNavStyle());
        elements.sizeNav.addEventListener("click", () => this.sizeNavStyle());
        elements.clearNav.addEventListener("click", () => this.clearNavStyle());
        

    }

    drawNode(object) {
        var root = this._model.root;
        if (this._model.size == 1) {
            var firstElem = document.getElementById("TIndex0");
            firstElem.id = "index" + root.val;
            firstElem.style.display = "inline-block";
            firstElem.innerHTML = root.val;
            firstElem.style.color = "black";
            // add flash
        } else {
            var newElem = document.getElementsByClassName("TElems")[0].cloneNode(true);
            newElem.id = "index" + this.getAddedElement();
            newElem.innerHTML = this.getAddedElement();
            var parentVal = this.addHelper(root, this.getAddedElement(), root);
            var parElem = document.getElementById("index" + parentVal);
            if (Number(this.getAddedElement()) > Number(parentVal)) {
                var left = parElem.style.marginLeft;
                left = Number(left.substring(0, left.length - 2));
                left += 80;
            } else {
                var left = parElem.style.marginLeft;
                left = Number(left.substring(0, left.length - 2));
                left -= 80;
            }

            var top = parElem.style.marginTop;
                top = Number(top.substring(0, top.length - 2));
                top += 100;

            newElem.style.marginTop = top + "px";
            newElem.style.marginLeft = left + "px";
            this._elements.allElements.appendChild(newElem);
            connectDivs(parElem.id, newElem.id, "black");
        }
    }

    addHelper(root, element, parent) {
        if (Number(root.val) == Number(element)) {
            return parent.val;
        }

         
        if (Number(element) > Number(root.val)) { // if element > root
            // flash root
            return this.addHelper(root.right, element, root);
        } else if (Number(element) < Number(root.val)) {
            // flash root
            return this.addHelper(root.left, element, root);
        }

        // return root;
    }
            


    insertNode(index) {
        const elems = document.getElementById("Telements");
        const elements = document.getElementsByClassName("Telems");
        const arrows = document.getElementsByClassName("Tarrow");
        var newArrow = this._elements.arrow.cloneNode(true);
        newArrow.style = "opacity:1;display:inline-block";
        var newElem = this._elements.arrayElem.cloneNode(true);
        newElem.innerHTML = this.getAddedElement();
        elems.insertBefore(newElem, elements[index]);
        elems.insertBefore(newArrow, elements[index + 1]);
    }

    removeNode(index) {
        if (index == 0) {
            const arrows = document.getElementsByClassName("Tarrow");
            arrows[1].remove();
        } else {
            const arrows = document.getElementsByClassName("Tarrow");
        arrows[index].remove();
        }
        const elements = document.getElementsByClassName("Telems");
        elements[index].remove();
    }

    clearLL() {
        const elements = document.getElementsByClassName("Telems");
        elements[0].style.display = "none";
        while (elements.length > 1) elements[1].remove();

        const arrows = document.getElementsByClassName("Tarrow");
        while (arrows.length > 1) arrows[1].remove();
    }

    replaceLL(index) {
        const arrows = document.getElementsByClassName("Tarrow");
        const elements = document.getElementsByClassName("Telems");
        elements[index].remove();
        const elems = document.getElementById("Telements");
        var newElem = this._elements.arrayElem.cloneNode(true);
        newElem.innerHTML = this.getNewElement();
        elems.insertBefore(newElem, arrows[index + 1]);
    }

    //style nav bar buttons
    defaultNavStyles() {
        const btnElements = document.getElementsByClassName("TactionNavs");
        Array.prototype.forEach.call(btnElements, function (element) {
            element.style.backgroundColor = "slategray";
            element.style.color = "white";
        });
        const actionElements = document.getElementsByClassName("Tmethods");
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
        return document.getElementById("TenterIndex").value;
    }

    getReplacedIndex() {
        return document.getElementById("Tset").value;
    }

    getNewElement() {
        return document.getElementById("TreplaceWith").value;
    }

    getRemovedElement() {
        return document.getElementById("Tremove").value;
    }

    getRemovedIndex() {
        return document.getElementById("TremoveIndex").value;
    }

    getContainsElement() {
        return document.getElementById("Tcontains").value;
    }

    elementDoesNotExist() {
        document.getElementById("Tresult").innerHTML = "False!";
        document.getElementById("Tresult").style.fontWeight = "bolder";
    }

    elementExists() {
        document.getElementById("Tresult").innerHTML = "True!";
        document.getElementById("Tresult").style.fontWeight = "bolder";
    }

    resetElementResult() {
        document.getElementById("Tresult").innerHTML = "";
    }

    getGetElement() {
        return document.getElementById("TgetIndex").value;
    }

    getResultElement(element) {
        if (element == undefined) {
            document.getElementById("TgetResult").innerHTML = "*No element at specified index";
            document.getElementById("TgetResult").style.color = "red";
        } else {
            document.getElementById("TgetResult").style.color = "black";
            document.getElementById("TgetResult").innerHTML = "Element: " + element;
            document.getElementById("TgetResult").style.fontWeight = "bolder";
        }
    }

    resetGet() {
        document.getElementById("TgetResult").innerHTML = "";
    }

    getIndexOfElement() {
        return document.getElementById("TindexOf").value;
    }

    returnIndexOf(index) {
        document.getElementById("TindexOfResult").innerHTML = "Index of element: " + index;
        document.getElementById("TindexOfResult").style.fontWeight = "bolder";
    }

    getSizeInput() {
        if (this._elements.size.value == "") {
            return undefined;
        }
        return Number(this._elements.size.value);
    }

    changeSize(size) {
        document.getElementById("TsizeDisplay").innerHTML = size;
    }

    removeError() {
        document.getElementById("TremoveError").innerHTML = "*Please enter a valid index position";
        document.getElementById("TremoveError").style.display = "inline-block";
    }

    hideRemoveError() {
        document.getElementById("TremoveError").style.display = "none";
    }

    removeBothError() {
        document.getElementById("TremoveError").innerHTML = "*Only one input allowed";
        document.getElementById("TremoveError").style.display = "inline-block";
    }

    removeInvalidElement() {
        document.getElementById("TremoveError").innerHTML = "*Element not in list";
        document.getElementById("TremoveError").style.display = "inline-block";
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
        document.getElementById("TsetError").style.color = "red";
        document.getElementById("TsetError").innerHTML = " *Please enter a valid index position";
        document.getElementById("TsetError").style.display = "inline-block";
    }

    setElementError() {
        document.getElementById("TsetError").style.color = "red";
        document.getElementById("TsetError").innerHTML = " *Please enter a valid element";
        document.getElementById("TsetError").style.display = "inline-block";
    
    }

    hideSetError() {
        document.getElementById("TsetError").style.display = "none";
    }

}
