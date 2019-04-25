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
        if (this.root != null && this.find(object) == object) {
            this.emit('elementAddedError', object);
            return;
        }
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

    remove(element) {
        this.removeHelper(this.root, element);
        // this.emit("elementRemoved", element);
    }

    removeHelper(root, element) {
        if (root == null) {
            return root;
        }

        if (Number(root.val) == Number(element)) {
            this.root = this.removeElement(root);
            this.size--;
        } else if (Number(root.val) > Number(element)) {
            root.left = this.removeHelper(root.left, element);
        } else if (Number(root.val) < Number(element)) {
            root.right = this.removeHelper(root.right, element);
        }
        return root;
    }

    removeElement(root) {
        if (root.left == null && root.right == null) {
            root = null;
        } else if (root.left == null) {
            root = root.right;
        } else if (root.right == null) {
            root = root.left;
        } else {
            var minElement = this.minimum(root.right);
            root.val = minElement.val;
            // have to remove minElement so lower nodes move up
            root.right = this.removeHelper(root.right, minElement.val);
        }
        return root;
    }

    minimum(root) {
        while (root.left != null) {
            root = root.left;
        }
        return root;
    }

    // remove(index) {
    //     // arraylist animation to only shift subsequent elements over one at a time
    //     this.elemIndex = index;
    //     if (this.elemIndex == -1) return; //element not in list

    //     for (var i = this.elemIndex; i < this.size; i++) {
    //         this.array[i] = this.array[i + 1];
    //     }
    //     this.size--;
    //     this.emit('elementRemoved', index);
    //     this.emit('updateSize', this.size);
    // }

    find(element) {
        var result = this.findHelper(this.root, element);
        return result;
    }

    findHelper(root, element) {
        if (root == null) {
            return null;
        }

        if (Number(root.val) == Number(element)) {
            return root.val;
        }
        return this.findHelper(Number(root.val) > Number(element) ? root.left : root.right, element);
    }

    clear() {
        this.root = null;
        this.size = 0;
        this.emit('treeCleared');
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
        view.on("clearButtonClicked", () => this.clearTree());
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
        var element = this._view.getRemovedElement();
        // if ((removeIndex != "" && element != "")) {
        //     this._view.removeBothError();
        //     return;
        // }

        if (element == "") {
            this._view.removeError();
            return;
        } 

        this._view.removeNode(element);
        // this._model.remove(element);
        // this._view.hideRemoveError();
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

    clearTree() {
        this._model.clear();
    }

}


class TreeView extends EventEmitter {

    constructor(model, elements) {
        super();
        this._model = model;
        this._elements = elements;
        this._height = 0;
        this._reHeight = 0;

        model.on('elementAdded', object => this.drawNode(object));
        model.on('elementAddedError', () => this.addError());
        model.on('elementReplaced', index => this.replaceLL(index));
        model.on('elementRemoved', element => this.removeNode(element));
        model.on('elementGot', element => this.getResultElement(element));
        model.on('updateSize', size => this.changeSize(size));
        model.on('treeCleared', () => this.clear());

        elements.addButton.addEventListener("click", () => this.emit("addButtonClicked"));
        elements.removeButton.addEventListener("click", () => this.emit("removeButtonClicked"));
        elements.containsButton.addEventListener("click", () => this.find(this.getFindElement()));
        elements.clearButton.addEventListener("click", () => this.emit("clearButtonClicked"));

        elements.addNav.addEventListener("click", () => this.addNavStyle())
        elements.removeNav.addEventListener("click", () => this.removeNavStyle());
        elements.containsNav.addEventListener("click", () => this.containsNavStyle());
        elements.sizeNav.addEventListener("click", () => this.sizeNavStyle());
        elements.clearNav.addEventListener("click", () => this.clearNavStyle());
    }

    drawNode(object) {
        document.getElementById("TpositionError").style.display = "none";
        var root = this._model.root;
        if (this._model.size == 1) {
            var firstElem = document.getElementsByClassName("TElems")[0];
            firstElem.id = "index" + root.val;
            firstElem.style.display = "inline-block";
            firstElem.innerHTML = root.val;
            firstElem.style.color = "black";
            // add flash
            firstElem.style.animationName = "none";
            firstElem.style.animationDuration = "";

            firstElem.style.animationName = "flash";
            firstElem.style.animationDuration = "1s";
        } else {
            var newElem = document.getElementsByClassName("TElems")[0].cloneNode(true);
            newElem.id = "index" + object;
            newElem.innerHTML = object;

            this._height = 0;
            var parentVal = this.addHelper(root, object, root);
            var parElem = document.getElementById("index" + parentVal);
            if (Number(object) > Number(parentVal)) {
                var left = parElem.style.marginLeft;
                left = Number(left.substring(0, left.length - 2));
                left += (200 / this._height) - this._reHeight;
            } else {
                var left = parElem.style.marginLeft;
                left = Number(left.substring(0, left.length - 2));
                left -= (200 / this._height) - this._reHeight;
            }

            var top = parElem.style.marginTop;
                top = Number(top.substring(0, top.length - 2));
                top += 100;

            newElem.style.marginTop = top + "px";
            newElem.style.marginLeft = left + "px";
            this._elements.allElements.appendChild(newElem);
            connectDivs(parElem.id, newElem.id, "black", object);
            newElem.style.animationName = "none";
            newElem.style.animationDuration = "";

            newElem.style.animationName = "flash";
            newElem.style.animationDuration = "1s";
        }
        var node = this._model.root;
    }

    addHelper(root, element, parent) {
        if (Number(root.val) == Number(element)) {
            return parent.val;
        }

         
        if (Number(element) > Number(root.val)) { // if element > root
            // flash root
            // var rootElem = document.getElementById("index" + root.val);
            // rootElem.style.animationName = "none";
            // rootElem.style.animationDuration = "";

            // rootElem.style.animationName = "flash";
            // rootElem.style.animationDuration = "1s";

            this._height++;
            return this.addHelper(root.right, element, root);
        } else if (Number(element) < Number(root.val)) {
            // flash root
            // var rootElem = document.getElementById("index" + root.val);
            // rootElem.style.animationName = "none";
            // rootElem.style.animationDuration = "";

            // rootElem.style.animationName = "flash";
            // rootElem.style.animationDuration = "1s";
            this._height++;
            return this.addHelper(root.left, element, root);
        }
    }

    removeNode(element) {
        var node = this._model.root;
        this.removeHelper(this._model.root, element, element);
        // this._reHeight = 0;
        // remove in model after so removing node from tree in view is not affected yet
        // this._model.remove(element);
    }

    removeHelper(root, element, modelRemoveElem) {
        if (root == null) {
            return root;
        }

        if (Number(root.val) == Number(element)) {
            this.removeElement(root, modelRemoveElem);
        } else if (Number(root.val) > Number(element)) {
            this.removeHelper(root.left, element, modelRemoveElem);
        } else if (Number(root.val) < Number(element)) {
            this.removeHelper(root.right, element, modelRemoveElem);
        }
    }

    removeElement(root, modelRemoveElem) {
        if (root.left == null && root.right == null) {
            // root = null;
            this._model.remove(modelRemoveElem);
            var line = document.getElementById(root.val);
            line.remove();
            document.getElementById("index" + root.val).remove();
        } else if (root.left == null) {
            // root = root.right;
            var right = document.getElementById("index" + root.right.val);
            var line = document.getElementById(root.right.val);
            document.getElementById("index" + root.val).innerHTML = right.innerHTML;
            document.getElementById("index" + root.val).id = "index" + right.innerHTML;
            right.remove();
            line.remove();


            this._model.remove(modelRemoveElem);
            this._reHeight = 100;
            this.drawSubTree(root.right);
        } else if (root.right == null) {
            // root = root.left;
            var left = document.getElementById("index" + root.left.val);
            var line = document.getElementById(root.left.val);
            // var ogTop = document.getElementById("index" + root.val).style.marginTop;
            // var ogLeft = document.getElementById("index" + root.val).style.marginLeft;
            document.getElementById("index" + root.val).innerHTML = left.innerHTML;
            document.getElementById("index" + root.val).id = "index" + left.innerHTML;
            line.remove();
            left.remove();
            this._model.remove(modelRemoveElem);
            this._reHeight = 100;
            this.drawSubTree(root.left);
        } else {
            var minElement = this.minimum(root.right);
            var rootVal = root.val;
            var minVal = minElement.val;
            var node = document.getElementById("index" + minElement.val);
            // node.remove();
            // this._model.remove(root.val);
            // root.val = minElement.val;
            // have to remove minElement so lower nodes move up
            this.removeHelper(root.right, minElement.val, modelRemoveElem);
            console.log("index" + rootVal);
            // if (document.getElementById("index" + rootVal) != null) {
                document.getElementById("index" + rootVal).innerHTML = minElement.val;
                document.getElementById("index" + rootVal).id = "index" + minElement.val;
            // }
        }
        // return root;
    }

    minimum(root) {
        while (root.left != null) {
            root = root.left;
        }
        return root;
    }

    drawSubTree(root) {
        if (root.right == null && root.left == null) {
            return;
        } 
        if (root.left != null && root.right != null) {
            document.getElementById("index" + root.left.val).remove();
            this.drawNode(root.left.val);
            
            document.getElementById("index" + root.right.val).remove();
            this.drawNode(root.right.val);
            this.drawSubTree(root.left);
            this.drawSubTree(root.right);
        } 

        if (root.left != null) {
            document.getElementById("index" + root.left.val).remove();
            this.drawNode(root.left.val);
            this.drawSubTree(root.left);
        }

        if (root.right != null) {
            document.getElementById("index" + root.right.val).remove();
            this.drawNode(root.right.val);
            this.drawSubTree(root.right);
        }

        // if (root.left == null && root.right == null) {
        //     this.drawNode(root);
        //     return;  
        // }
        // // remove div with root.left

        // this.drawSubTree(root.left);
        // this.drawSubTree(root.right);
    }

    // removeNode(index) {
    //     if (index == 0) {
    //         const arrows = document.getElementsByClassName("Tarrow");
    //         arrows[1].remove();
    //     } else {
    //         const arrows = document.getElementsByClassName("Tarrow");
    //     arrows[index].remove();
    //     }
    //     const elements = document.getElementsByClassName("TElems");
    //     elements[index].remove();
    // }

    find(element) {
        var node = document.getElementById("index" + element);
        if (node != null) {
            document.getElementById("TcontainsResult").style.display = "none";
            
            //highlight node

            node.style.animationName = "peek";
            node.style.animationDuration = "1s";
            setTimeout(function () {
            node.style.animationName = "none";
        }, 1000);
            return true;
        } else {
            document.getElementById("TcontainsResult").style.display = "inline-block";
            return false;
        }
    }

    addError() {
        document.getElementById("TpositionError").style.display = "inline-block";
    }


    clear() {
        document.getElementById("svg-canvas").remove();
        const elements = document.getElementsByClassName("TElems");
        elements[0].style.display = "none";
        while (elements.length > 1) elements[1].remove();
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

    getFindElement() {
        return document.getElementById("TindexOf").value;
    }

    getAddedElement() {
        return this._elements.add.value;
    }

    getAddedIndex() {
        return document.getElementById("TenterIndex").value;
    }

    // getReplacedIndex() {
    //     return document.getElementById("Tset").value;
    // }

    getNewElement() {
        return document.getElementById("TreplaceWith").value;
    }

    getRemovedElement() {
        return document.getElementById("TremoveElem").value;
    }

    // getRemovedIndex() {
    //     return document.getElementById("TremoveIndex").value;
    // }

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

    // removeError() {
    //     document.getElementById("TremoveError").innerHTML = "*Please enter a valid index position";
    //     document.getElementById("TremoveError").style.display = "inline-block";
    // }

    // hideRemoveError() {
    //     document.getElementById("TremoveError").style.display = "none";
    // }

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
