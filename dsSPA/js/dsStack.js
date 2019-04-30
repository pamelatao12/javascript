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
class StackModel extends EventEmitter {

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

class StackController {
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


class StackView extends EventEmitter {

    constructor(model, elements) {
        super();
        this._model = model;
        this._elements = elements;

        model.on('elementInserted', () => this.insertNode());
        model.on('elementRemoved', () => this.removeNode());
        model.on('elementPeeked', () => this.highlightElement());
        model.on('updateSize', size => this.changeSize(size));
        model.on('listCleared', () => this.clearLL());

        elements.SaddButton.addEventListener("click", () => this.emit("addButtonClicked"));
        elements.SremoveButton.addEventListener("click", () => this.emit("removeButtonClicked"));
        elements.SpeekButton.addEventListener("click", () => this.emit("peekButtonClicked"));
        elements.SindexButton.addEventListener("click", () => this.emit("indexOfButtonClicked"));
        elements.SclearButton.addEventListener("click", () => this.emit("clearButtonClicked"));

        elements.SaddNav.addEventListener("click", () => this.addNavStyle())
        elements.SremoveNav.addEventListener("click", () => this.removeNavStyle());
        elements.ScontainsNav.addEventListener("click", () => this.containsNavStyle());
        elements.SindexNav.addEventListener("click", () => this.indexNavStyle());
        elements.SsizeNav.addEventListener("click", () => this.sizeNavStyle());
        elements.SclearNav.addEventListener("click", () => this.clearNavStyle());
    }

    insertNode() {
        if (this._model.size == 1) {
            this._elements.SarrayElem.style.display = "block";
            this._elements.SarrayElem.style.borderBottom = "1px solid #DB7093";
            this._elements.SarrayElem.innerHTML = this.getAddedElement();

            this._elements.SarrayElem.style.animationName = "none";
            this._elements.SarrayElem.style.animationDuration = "";

            this._elements.SarrayElem.style.animationName = "flash";
            this._elements.SarrayElem.style.animationDuration = "1s";
        } else {
            const elems = document.getElementById("SstackElements");
            const elements = document.getElementsByClassName("SstackElems");
            var newElem = this._elements.SarrayElem.cloneNode(true);
            newElem.style.display = "block";
            newElem.style.borderBottom = "none";
            newElem.innerHTML = this.getAddedElement();
            newElem.style.animationName = "none";
            newElem.style.animationDuration = "";

            newElem.style.animationName = "flash";
            newElem.style.animationDuration = "1s";
            elems.insertBefore(newElem, elements[0]);
        }
    }

    removeNode() {
        if (this._model.size == 0) {
            this.resetElemStyles(this._elements.SarrayElem);
            this.setSlideAnimation(this._elements.SarrayElem);
            
            setTimeout(function (elements, view) {
                elements.SarrayElem.style.display = "none";
                view.resetElemStyles(elements.SarrayElem);
            }, 1000, this._elements, this);
        } else {
            const elements = document.getElementsByClassName("SstackElems");
            this.resetElemStyles(elements[0]);
            this.setSlideAnimation(elements[0]);

            setTimeout(function(elements) {
                    elements[0].remove();
                }, 1000, elements);
        }
    }

    clearLL() {
        const elements = document.getElementsByClassName("SstackElems");
        const stack = document.getElementById("SstackElements");

        stack.style.opacity = "0";
        stack.style.transition = "opacity 1s ease-in-out";

        setTimeout(function (elements, stack, view) {
            elements[elements.length - 1].style.display = "none";
            view.resetElemStyles(stack);
            while (elements.length > 1) {
                elements[0].remove();
            }
        }, 1000, elements, stack, this);
    }

    highlightElement() {
        const elements = document.getElementsByClassName("SstackElems");
        elements[0].style.animationName = "peek";
        elements[0].style.animationDuration = "1s";
        setTimeout(function () {
            elements[0].style.animationName = "none";
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

    setSlideAnimation(element) {
        element.style.position = "relative";
        element.style.right = "0px";
        element.style.animation = "slide 2s forwards";
        element.style.opacity = "0";
        element.style.transition = "opacity 1s ease-in-out";
    }

    //style nav bar buttons
    defaultNavStyles() {
        const btnElements = document.getElementsByClassName("SactionNavs");
        Array.prototype.forEach.call(btnElements, function (element) {
            element.style.backgroundColor = "slategray";
            element.style.color = "white";
        });
        const actionElements = document.getElementsByClassName("Smethods");
        Array.prototype.forEach.call(actionElements, function (action) {
            action.style.display = "none";
        });
    }

    addNavStyle() {
        this.defaultNavStyles();
        this._elements.SaddAction.style.display = "block";
        this._elements.SaddNav.style.backgroundColor = "snow";
        this._elements.SaddNav.style.color = "black";
    }

    removeNavStyle() {
        this.defaultNavStyles();
        this._elements.SremoveAction.style.display = "block";
        this._elements.SremoveNav.style.backgroundColor = "snow";
        this._elements.SremoveNav.style.color = "black";
    }

    containsNavStyle() {
        this.defaultNavStyles();
        this._elements.ScontainsAction.style.display = "block";
        this._elements.ScontainsNav.style.backgroundColor = "snow";
        this._elements.ScontainsNav.style.color = "black";
    }

    indexNavStyle() {
        this.defaultNavStyles();
        this._elements.SindexAction.style.display = "block";
        this._elements.SindexNav.style.backgroundColor = "snow";
        this._elements.SindexNav.style.color = "black";
    }

    sizeNavStyle() {
        this.defaultNavStyles();
        this._elements.SsizeAction.style.display = "block";
        this._elements.SsizeNav.style.backgroundColor = "snow";
        this._elements.SsizeNav.style.color = "black";
    }

    clearNavStyle() {
        this.defaultNavStyles();
        this._elements.SclearAction.style.display = "block";
        this._elements.SclearNav.style.backgroundColor = "snow";
        this._elements.SclearNav.style.color = "black";
    }
    // end style nav bar buttons


    getAddedElement() {
        return this._elements.Sadd.value;
    }

    getIndexOfElement() {
        return document.getElementById("SindexOf").value;
    }

    returnIndexOf(index) {
        document.getElementById("SindexOfResult").innerHTML = "Index of element: " + index;
        document.getElementById("SindexOfResult").style.fontWeight = "bolder";
    }

    getSizeInput() {
        if (this._elements.Ssize.value == "") {
            return undefined;
        }
        return Number(this._elements.Ssize.value);
    }

    changeSize(size) {
        document.getElementById("SsizeDisplay").innerHTML = size;
    }

    showInvalidElement() {
        this._elements.SpositionError.style.display = "inline-block";
        this._elements.SpositionError.innerHTML = "*Please enter a valid element";
    }
}

