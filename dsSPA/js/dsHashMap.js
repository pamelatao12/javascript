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
        // var key = "key";
        this.map[key] = value;
        this.size++;
        this.emit('elementAdded', key);
        this.emit('updateSize', this.size);
    }

    remove(key) {
        delete this.map[key];
        this.size--;
        this.emit('elementRemoved', key);
        this.emit('updateSize', this.size);
    }

    replace(key, value) {
        if (key in this.map) {   
            this.map[key] = value;
        }
        this.emit('elementReplaced', key);
    }

    get(key) {
        return this.map[key];
    }

    contains(key) {
        return key in this.map;
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
        view.on("clearButtonClicked", () => this.clearMap());
    }

    addElement() {
        var key = this._view.getAddedElement();
        var value = this._view.getAddedValue();

        if (key == "" || value == "") {
            this._view.showInvalidElement();
        // checked if element is valid in model
        } else if (this._model.contains(Number(key))) {
            this._model.replace(key, value);
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

        if (this._model.contains(Number(element)) == false) {
            this._view.removeError();
            return;
        }
        this._view.hideRemoveError();
        this._model.remove(element);
    }

    replaceElement() {
        var key = this._view.getReplacedKey();
        var value = this._view.getReplacedValue();

        if (this._model.contains(Number(key)) == false || (key == "" || value =="")) {
            this._view.showReplaceError();
            return;
        } 
        //TODO: check that replace inputs are valid
        this._view.hideReplaceError();
        this._model.replace(key, value);
    }

    clearMap() {
        this._model.clear();
    }

}


class HashMapView extends EventEmitter {

    constructor(model, elements) {
        super();
        this._model = model;
        this._elements = elements;

        model.on('elementAdded', (key) => this.drawMap(key));
        model.on('elementAddedError', () => this.addError());
        model.on('elementRemovedError', () => this.removeError());
        model.on('elementRemoved', (key) => this.removeKey(key));
        model.on('elementReplaced', (key) => this.replaceValue(key));
        model.on('updateSize', size => this.changeSize(size));
        model.on('mapCleared', () => this.clear());

        elements.addButton.addEventListener("click", () => this.emit("addButtonClicked"));
        elements.removeButton.addEventListener("click", () => this.emit("removeButtonClicked"));
        elements.replaceButton.addEventListener("click", () => this.emit("replaceButtonClicked"));
        elements.containsButton.addEventListener("click", () => this.containsKey());
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

    drawMap(key) {
        // each mapping added is arrow pointing from index rectangle to new 
        // rectangle with key value pair
        var map = this._model.map;
        var num = Math.floor(Math.random() * 6);
        var bucket = document.getElementById("bucket" + num);
        var bucketElems = bucket.children;
        if (bucketElems[0].style.display == "none") {

            // block containing key:value
            bucketElems[0].style.display = "inline-block";
            bucketElems[0].style.position = "absolute";
            bucketElems[0].style.top = num * 46.5 + "px";
            bucketElems[0].style.left= "200px";
            bucketElems[0].id = key;
            bucketElems[0].innerHTML = key + " : " + map[Number(key)];
            connectDivsHM(bucket.id, key, "black", "arrow" + key);

            bucketElems[0].style.animationName = "flash";
            bucketElems[0].style.animationDuration = "1s";
            setTimeout(function () {
                bucketElems[0].style.animationName = "none";
            }, 1000);
        } else {
            var prevElem = bucketElems[bucketElems.length - 1];
            var newElem = bucketElems[0].cloneNode(true);
            newElem.id = key;
            newElem.innerHTML = key + " : " + map[Number(key)];
            newElem.style.display = "inline-block";
            newElem.style.position = "absolute";
            newElem.style.top = num * 46.5 + "px";

            var left = prevElem.style.left;
            left = Number(left.substring(0, left.length - 2));
            newElem.style.left= left + 150 + "px";
            bucket.appendChild(newElem);

            connectDivsHM(prevElem.id, key, "black", "arrow" + key);

            newElem.style.animationName = "flash";
            newElem.style.animationDuration = "1s";
            setTimeout(function () {
                newElem.style.animationName = "none";
            }, 1000);
        }
    }

    removeKey(key) {
        var map = this._model.map;
        var elem = document.getElementById(key);
        var parent = elem.parentElement;
        var bucketElems = parent.children;
        for (var i = 0; i < bucketElems.length; i++) {
            if (bucketElems[i].id == key) {
                document.getElementById("arrow" + elem.id).remove();
                for (var j = bucketElems.length - 1; j > i; j--) {
                    bucketElems[j].style.left = bucketElems[j - 1].style.left;
                    document.getElementById("arrow" + bucketElems[j].id).remove();
                    var diff = j - 1;
                    if (j - 1 < i || (j - 1 == 0 && i == 0)) {
                        connectDivsHM(parent.id, bucketElems[j - 1].id, "black", "arrow" + bucketElems[j].id);
                    } else {
                        connectDivsHM(bucketElems[j - 2].id, bucketElems[j - 1].id, "black", "arrow" + bucketElems[j].id);
                    }
                }
                elem.remove();
                break;
            }
        }
    }

    replaceValue(key) {
        var elem = document.getElementById(key);
        elem.innerHTML = key + " : " + this._model.map[Number(key)];
    }

    containsKey() {
        var node = document.getElementById(this.getContainsElement());
        if (node != null) {
            node.style.animationName = "peek";
            node.style.animationDuration = "1s";
            setTimeout(function () {
                node.style.animationName = "none";
            }, 1000);
        }
    }

    get() {
        var key = document.getElementById("HMget").value;
        var node = document.getElementById(key);
        if (node != null) {
            document.getElementById("HMgetResult").innerHTML = "Value: " + this._model.get(Number(key));
            node.style.animationName = "peek";
            node.style.animationDuration = "1s";
            setTimeout(function () {
                node.style.animationName = "none";
            }, 1000);
        } else {
            document.getElementById("HMgetResult").innerHTML = "*Key does not exist in map";
        }

    }

    addError() {
        document.getElementById("HMpositionError").style.display = "inline-block";
    }

    clear() {
        if (document.getElementById("svg-canvas") != null) {
            document.getElementById("svg-canvas").remove();
        }
        for (var i = 0; i <= 5; i++) {
            var elements = document.getElementById("bucket" + i).children;
            elements[0].style.display = "none";
            while (elements.length > 1) elements[1].remove();
        }
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

    getReplacedKey() {
        return document.getElementById("HMreplace").value;
    }

    getReplacedValue() {
        return document.getElementById("HMreplaceWith").value;
    }

    showReplaceError() {
        document.getElementById("HMreplaceError").innerHTML = "*Please enter a valid key and value";
    }

    hideReplaceError() {
        document.getElementById("HMreplaceError").innerHTML = "";
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
