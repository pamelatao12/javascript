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

// class Node {
//     constructor(left, right, value) {
//         this.left = left;
//         this.right = right;
//         this.val = value;
//     }
// }

/**
 * The Model - stores data, notifies observers about changes
 */
class HashMapModel extends EventEmitter {

    constructor() {
        super();
        this.map = {};
        this.size = 0;
    }

    add(key, value) {
        this.map.key = value;
        this.size++;
        this.emit('elementAdded', key, value);
        this.emit('updateSize', this.size);
    }

    remove(key) {
        delete this.map.key;
        this.emit('elementRemoved', key);
    }

    replace(key, value) {
        if ("key" in this.map) {   
            this.map.key = value;
        }
    }

    get(key) {
        return this.map.key;
    }

    contains(key) {
        return "key" in this.map;
    }

    clear() {
        this.map = {};
        this.size = 0;
        this.emit('mapCleared');
        this.emit('updateSize', this.size);
    }
}

class HashMapController {
    constructor(model, view) {
        this._model = model;
        this._view = view;
        view.on("addButtonClicked", () => this.addElement());
        view.on("removeButtonClicked", () => this.removeElement());
        view.on("replaceButtonClicked", () => this.replaceElement());
        view.on("clearButtonClicked", () => this.clearHeap());
    }

    addElement() {
        var key = this._view.getAddedElement();
        var value = this._view.getAddedValue();

        if (element == "") {
            this._view.showInvalidElement();
        // checked if element is valid in model
        } else {
            this._view.hidePositionError();
            this._model.add(key, value);
        }
    }

    removeElement() {
        var element = this._view.getRemovedElement();

        if (element == "") {
            this._view.removeError();
            return;
        } 

        if (this.root != null && this.contains(object) == false) {
            this._view.removeError();
            return;
        }
        this._view.hideRemoveError();
        this._model.remove(element);
    }

    replaceElement() {
        var key = this._view.getReplacedKey();
        var value = this._view.getReplacedValue();

        //TODO: check that replace inputs are valid

        this._model.replace(key, value);
    }

    clearHeap() {
        this._model.clear();
    }

}


class HashMapView extends EventEmitter {

    constructor(model, elements) {
        super();
        this._model = model;
        this._elements = elements;

        model.on('elementAdded', (key, value) => this.drawMap(key, value));
        model.on('elementAddedError', () => this.addError());
        model.on('elementRemovedError', () => this.removeError());
        model.on('elementRemoved', () => this.drawHeap());
        model.on('updateSize', size => this.changeSize(size));
        model.on('heapCleared', () => this.clear());

        elements.addButton.addEventListener("click", () => this.emit("addButtonClicked"));
        elements.removeButton.addEventListener("click", () => this.emit("removeButtonClicked"));
        elements.containsButton.addEventListener("click", () => this.find(this.getFindElement()));
        elements.getButton.addEventListener("click", () => this.get());
        elements.clearButton.addEventListener("click", () => this.emit("clearButtonClicked"));

        elements.addNav.addEventListener("click", () => this.addNavStyle());
        elements.removeNav.addEventListener("click", () => this.removeNavStyle());
        elements.replaceNav.addEventListener("click", () => this.replaceNavStyle());
        elements.containsNav.addEventListener("click", () => this.containsNavStyle());
        elements.getNav.addEventListener("click", () => this.getNavStyle());
        elements.sizeNav.addEventListener("click", () => this.sizeNavStyle());
        elements.clearNav.addEventListener("click", () => this.clearNavStyle());
    }

    drawMap(key, value) {
        // 8 hashtable rectangles
        // each mapping added is arrow pointing from index rectangle to new 
        // rectangle with key value pair

        var map = this._model.map;
        var num = Math.rand(0, 5);
        var bucket = document.getElementById("bucket" + num);
        var bucketElems = document.getElementsByClassName("bucketElems" + num);
        if (bucketElems.length == 1) {
            bucketElems[0].display = "inline-block";
            bucketElems[0].id = key;
            bucketElems[0].innerHTML = key + " : " + value;
        } else {
            var newElem = bucketElems[0].cloneNode(true);
            newElem.id = key;
            newElem.innerHTML = key + " : " + value;
            // TODO: position elems on page and connectDivs
        }


        // this.clear();
        // var heap = this._model.array;
        // this.isLeft = true;
        // for (var i = 0; i < this._model.size; i++) {
        //     if (i == 0) {
        //         var firstElem = document.getElementsByClassName("HMElems")[0];
        //         firstElem.id = "index" + heap[i];
        //         firstElem.style.display = "inline-block";
        //         firstElem.innerHTML = heap[i];
        //         firstElem.style.color = "black";
        //         if (heap[i] == element) {
        //             firstElem.style.animationName = "flash";
        //             firstElem.style.animationDuration = "1s";
        //             setTimeout(function () {
        //                 firstElem.style.animationName = "none";
        //             }, 1000);
        //         }

        //     } else {
        //         var newElem = document.getElementsByClassName("HMElems")[0].cloneNode(true);
        //         newElem.id = "index" + heap[i] + "v" + this.version;
        //         this.version++;
        //         newElem.innerHTML = heap[i];

        //         // this._height = 0;
        //         // console.log((i - 1) / 2);
        //         // var parentVal = heap[Math.floor((i - 1) / 2)];
        //         // var parElem = document.getElementById("index" + parentVal);

        //         var parElem = document.getElementsByClassName("HMElems")[Math.floor((i - 1) / 2)];
        //         var left = parElem.style.marginLeft;
        //         left = Number(left.substring(0, left.length - 2));

        //         var top = parElem.style.marginTop;
        //         top = Number(top.substring(0, top.length - 2));
        //         top += 100;

        //         this._height = top / 100;
        //         if (this.isLeft) {
        //             left -= 200 / this._height;
        //             this.isLeft = false;
        //         } else {
        //             left += 200 / this._height;
        //             this.isLeft = true;
        //         }
                
                

        //         newElem.style.marginTop = top + "px";
        //         newElem.style.marginLeft = left + "px";
        //         this._elements.allElements.appendChild(newElem);
        //         connectDivs(parElem.id, newElem.id, "black", heap[i]);
        //         if (heap[i] == element) {
        //             newElem.style.animationName = "flash";
        //             newElem.style.animationDuration = "1s";
        //             setTimeout(function () {
        //                 newElem.style.animationName = "none";
        //             }, 1000);
        //         }
        //     }
        // }
    }

    peek() {
        var node = document.getElementsByClassName("HMElems")[0];
        node.style.animationName = "peek";
        node.style.animationDuration = "1s";
        setTimeout(function () {
            node.style.animationName = "none";
        }, 1000);
    }

    find(element) {
        var node = document.getElementById("index" + element);
        if (node != null) {
            document.getElementById("HMcontainsResult").style.display = "none";
            
            //highlight node

            node.style.animationName = "peek";
            node.style.animationDuration = "1s";
            setTimeout(function () {
            node.style.animationName = "none";
        }, 1000);
            return true;
        } else {
            document.getElementById("HMcontainsResult").style.display = "inline-block";
            return false;
        }
    }

    addError() {
        document.getElementById("HMpositionError").style.display = "inline-block";
    }


    clear() {
        if (document.getElementById("svg-canvas") != null) {
            document.getElementById("svg-canvas").remove();
        }
        const elements = document.getElementsByClassName("HMElems");
        elements[0].style.display = "none";
        while (elements.length > 1) elements[1].remove();
    }

    //style nav bar buttons
    defaultNavStyles() {
        const btnElements = document.getElementsByClassName("HMactionNavs");
        Array.prototype.forEach.call(btnElements, function (element) {
            element.style.backgroundColor = "slategray";
            element.style.color = "white";
        });
        const actionElements = document.getElementsByClassName("HMmethods");
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
        this._elements.replaceAction.style.display = "block";
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

    getFindElement() {
        return document.getElementById("HMindexOf").value;
    }

    getAddedElement() {
        return this._elements.add.value;
    }

    getAddedValue() {
        return this._elements.addValue.value;
    }

    getRemovedElement() {
        return document.getElementById("HMremoveElem").value;
    }

    getContainsElement() {
        return document.getElementById("HMcontains").value;
    }

    elementDoesNotExist() {
        document.getElementById("HMcontainsResult").innerHTML = "False!";
        document.getElementById("HMcontainsResult").style.fontWeight = "bolder";
    }

    elementExists() {
        document.getElementById("HMcontainsResult").innerHTML = "True!";
        document.getElementById("HMcontainsResult").style.fontWeight = "bolder";
    }

    resetElementResult() {
        document.getElementById("HMcontainsResult").innerHTML = "";
    }

    changeSize(size) {
        document.getElementById("HMsizeDisplay").innerHTML = size;
    }

    removeError() {
        document.getElementById("HMremoveError").style.display = "inline-block";
    }

    hideRemoveError() {
        document.getElementById("TremoveError").style.display = "none";
    }

    hidePositionError() {
        this._elements.positionError.style.display = "none";
    }

    showInvalidElement() {
        this._elements.positionError.style.display = "inline-block";
        this._elements.positionError.innerHTML = "*Please enter a valid element";
    }

}
