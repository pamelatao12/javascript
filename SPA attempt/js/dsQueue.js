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
class QueueModel extends EventEmitter {

    constructor() {
        super();
        this.array = [];
        this.size = 0;
        this.elemIndex;
    }

    add(object) {
        for (var i = this.size - 1; i >= 0; i--) {
            this.array[i + 1] = this.array[i];
        }
        this.array[0] = object;
        this.size++;
        this.emit('elementInserted');
        this.emit('updateSize', this.size);
    }

    poll() {
        // arraylist animation to only shift subsequent elements over one at a time
        this.array.length--;
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
        this.array.length = 0;
        this.size = 0;
        this.emit('listCleared');
        this.emit('updateSize', this.size);
    }
}

class QueueController {
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
            this._model.add(element);
        }
    }

    removeElement() {
        this._model.poll();
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


class QueueView extends EventEmitter {

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
        elements.clearButton.addEventListener("click", () => this.emit("clearButtonClicked"));

        elements.addNav.addEventListener("click", () => this.addNavStyle())
        elements.removeNav.addEventListener("click", () => this.removeNavStyle());
        elements.containsNav.addEventListener("click", () => this.containsNavStyle());
        elements.sizeNav.addEventListener("click", () => this.sizeNavStyle());
        elements.clearNav.addEventListener("click", () => this.clearNavStyle());
    }

    insertNode() {
        if (this._model.size == 1) {
            const lastElem = document.getElementById("QIndex");
            lastElem.style.display = "inline-block";
            lastElem.style.borderRight = "1px solid #DB7093";
            lastElem.innerHTML = this.getAddedElement();

            lastElem.style.animationName = "none";
            lastElem.style.animationDuration = "";

            lastElem.style.animationName = "flash";
            lastElem.style.animationDuration = "1s";

            lastElem.style.position = "relative";
            lastElem.style.left = "-100px";
            lastElem.style.animation = "slideInFirst 1s forwards";
            // lastElem.style.opacity = "1";
            // lastElem.style.transition = "opacity 1s ease-in-out";


            lastElem.style.color = "black";
        } else {
            const elems = document.getElementById("QElements");
            const elements = document.getElementsByClassName("QElems");
            var newElem = elements[elements.length - 1].cloneNode(true);
            newElem.style.display = "inline-block";
            // newElem.style.borderRight = "none";
            newElem.innerHTML = this.getAddedElement();
            newElem.style.animationName = "none";
            newElem.style.animationDuration = "";

            newElem.style.animationName = "flash";
            newElem.style.animationDuration = "1s";

            newElem.style.position = "relative";
            newElem.style.left = "-100px";
            newElem.style.animation = "slideIn 1s forwards";


            newElem.style.color = "black";
            elems.insertBefore(newElem, elements[0]);

            setTimeout(function (element) {
                element.style.borderRight = "none";
            }, 1000, newElem);
        }
    }

    removeNode() {
        if (this._model.size == 0) {
            const lastElem = document.getElementById("QIndex");
            this.resetElemStylesSlideIn(lastElem);
            this.setSlideAnimation(lastElem);
            
            setTimeout(function (element, view) {
                element.style.display = "none";
                view.resetElemStyles(element);
            }, 1000, lastElem, this);
        } else {
            const elements = document.getElementsByClassName("QElems");
            this.resetElemStylesSlideIn(elements[elements.length - 1]);
            this.setSlideAnimation(elements[elements.length - 1]);
            elements[elements.length - 2].style.borderRight = "1px solid #DB7093";

            setTimeout(function(elements) {
                    elements[elements.length - 1].remove();
                }, 1000, elements);
        }
    }

    clearLL() {
        const elements = document.getElementsByClassName("QElems");
        const queue = document.getElementById("QElements");

        queue.style.opacity = "0";
        queue.style.transition = "opacity 1s ease-in-out";

        setTimeout(function (elements, queue, view) {
            elements[elements.length - 1].style.display = "none";
            view.resetElemStyles(queue);
            while (elements.length > 1) {
                elements[0].remove();
            }
        }, 1000, elements, queue, this);
    }

    highlightElement() {
        const elements = document.getElementsByClassName("QElems");
        this.resetElemStylesSlideIn(elements[elements.length - 1]);
        elements[elements.length - 1].style.animationName = "peek";
        elements[elements.length - 1].style.animationDuration = "1s";
        setTimeout(function () {
            elements[elements.length - 1].style.animationName = "none";
        }, 1000);
        // flash and then return to normal style
    }

    resetElemStyles(element) {
        element.style.position = "";
        element.style.right = "";
        element.style.animation = "none";
        element.style.opacity = "";
        element.style.transition = "none";
    }

    resetElemStylesSlideIn(element) {
        element.style.right = "";
        element.style.left = "";
        element.style.animation = "none";
        element.style.opacity = "";
        element.style.transition = "none";
    }

    setSlideAnimation(element) {
        element.style.position = "relative";
        element.style.right = "0px";
        element.style.animation = "slide 2s forwards";
        element.style.opacity = "0";
        element.style.transition = "opacity 1s ease-in-out";
    }

    //style nav bar buttons
    defaultNavStyles() {
        const btnElements = document.getElementsByClassName("QactionNavs");
        Array.prototype.forEach.call(btnElements, function (element) {
            element.style.backgroundColor = "slategray";
            element.style.color = "white";
        });
        const actionElements = document.getElementsByClassName("Qmethods");
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
        return document.getElementById("QindexOf").value;
    }

    returnIndexOf(index) {
        document.getElementById("QindexOfResult").innerHTML = "Index of element: " + index;
        document.getElementById("QindexOfResult").style.fontWeight = "bolder";
    }

    getSizeInput() {
        if (this._elements.size.value == "") {
            return undefined;
        }
        return Number(this._elements.size.value);
    }

    changeSize(size) {
        document.getElementById("QsizeDisplay").innerHTML = size;
    }

    showInvalidElement() {
        this._elements.positionError.style.display = "inline-block";
        this._elements.positionError.innerHTML = "*Please enter a valid element";
    }
}

