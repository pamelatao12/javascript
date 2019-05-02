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
class HeapModel extends EventEmitter {

    constructor() {
        super();
        this.array = [];
        this.size = 0;
        this.elemIndex;
    }

    add(object) {
        // if (this.size + 1 == array.length) {
        //     var temp = [array.length * 2];
        //     for (int i = 0; i < size; i++) {
        //         temp[i] = array[i];
        //     }
        //     array = temp;
        // }
        this.array[this.size] = object;
        this.size++;
        this.bubbleUp(this.size - 1);
        this.emit('elementAdded', object);
        this.emit('updateSize', this.size);
    }

    bubbleUp(index) {
        var parent = Math.floor((index - 1) / 2);
        while (index > 0 && Number(this.array[index]) > Number(this.array[parent])) {
            this.swap(index, parent);
            index = parent;
            parent = Math.floor((index - 1) / 2);
        }
    }

    swap(index1, index2) {
        var temp = this.array[index1];
        this.array[index1] = this.array[index2];
        this.array[index2] = temp;
    }

    remove(object) {
        for (var i = 0; i < this.size; i++) {
            if (this.array[i] == object) {
                this.array[i] = this.array[this.size - 1];
                this.bubbleDown(i);
                this.size--;
                this.emit('elementRemoved', object);
                this.emit('updateSize', this.size);
                return true;
            }
        }
        return false;
    }

    bubbleDown(index) {
        var bigChild = this.maximum(index);
        while (bigChild != -1 && this.array[index] < this.array[bigChild]) {
            swap(index, bigChild);
            index = bigChild;
            bigChild = this.maximum(index);
        }
    }

    maximum(index) {
        var child1 = 2 * index + 1;
        var child2 = 2 * index + 2;
        if (child1 >= this.size && child2 >= this.size) {
            return -1;
        } else if (this.array[child1] > this.array[child2]) {
            return child2;
        } else {
            return child1;
        }
    }

    contains(object) {
        for (var i = 0; i < this.size; i++) {
            if (this.array[i] == object) {
                return true;
            }
        }
        return false;
    }

    clear() {
        this.array = [];
        this.size = 0;
        this.emit('heapCleared');
        this.emit('updateSize', this.size);
    }
}

class HeapController {
    constructor(model, view) {
        this._model = model;
        this._view = view;
        view.on("addButtonClicked", () => this.addElement());
        view.on("removeButtonClicked", () => this.removeElement());
        view.on("containsButtonClicked", () => this.containsElement());
        view.on("clearButtonClicked", () => this.clearTree());
    }

    addElement() {
        var element = this._view.getAddedElement();

        if (element == "" || this._model.contains(element)) {
            this._view.showInvalidElement();
        // checked if element is valid in model
        } else {
            this._view.hidePositionError();
            this._model.add(element);
        }
    }

    removeElement() {
        var element = this._view.getRemovedElement();

        if (element == "") {
            this._view.removeError();
            return;
        } 

        if (this.root != null && this.contains(object) == object) {
            this._view.removeError();
            return;
        }

        // NEED TO STOP IT FROM GOING IF ELEMENT ALREADY EXISTS
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


class HeapView extends EventEmitter {

    constructor(model, elements) {
        super();
        this._model = model;
        this._elements = elements;
        this._height = 1;
        this.isLeft = true;
        this._reHeight = 0;

        model.on('elementAdded', () => this.drawHeap());
        model.on('elementAddedError', () => this.addError());
        model.on('elementRemovedError', () => this.removeError());
        model.on('elementRemoved', element => this.removeNode(element));
        model.on('updateSize', size => this.changeSize(size));
        model.on('treeCleared', () => this.clear());

        elements.addButton.addEventListener("click", () => this.emit("addButtonClicked"));
        elements.removeButton.addEventListener("click", () => this.emit("removeButtonClicked"));
        elements.containsButton.addEventListener("click", () => this.find(this.getFindElement()));
        elements.clearButton.addEventListener("click", () => this.emit("clearButtonClicked"));

        elements.addNav.addEventListener("click", () => this.addNavStyle())
        elements.removeNav.addEventListener("click", () => this.removeNavStyle());
        elements.containsNav.addEventListener("click", () => this.containsNavStyle());
        elements.peekNav.addEventListener("click", () => this.peekNavStyle());
        elements.sizeNav.addEventListener("click", () => this.sizeNavStyle());
        elements.clearNav.addEventListener("click", () => this.clearNavStyle());
    }

    drawHeap() {
        this.clear();
        var heap = this._model.array;
        this.isLeft = true;
        for (var i = 0; i < this._model.size; i++) {
            if (i == 0) {
                var firstElem = document.getElementsByClassName("HElems")[0];
                firstElem.id = "index" + heap[i];
                firstElem.style.display = "inline-block";
                firstElem.innerHTML = heap[i];
                firstElem.style.color = "black";
            } else {
                var newElem = document.getElementsByClassName("HElems")[0].cloneNode(true);
                newElem.id = "index" + heap[i];
                newElem.innerHTML = heap[i];

                // this._height = 0;
                // console.log((i - 1) / 2);
                var parentVal = heap[Math.floor((i - 1) / 2)];
                var parElem = document.getElementById("index" + parentVal);

                var left = parElem.style.marginLeft;
                left = Number(left.substring(0, left.length - 2));
                
                var top = parElem.style.marginTop;
                top = Number(top.substring(0, top.length - 2));
                top += 100;

                this._height = top / 100;
                if (this.isLeft) {
                    left -= 200 / this._height;
                    this.isLeft = false;
                } else {
                    left += 200 / this._height;
                    this.isLeft = true;
                }
                
                

                newElem.style.marginTop = top + "px";
                newElem.style.marginLeft = left + "px";
                this._elements.allElements.appendChild(newElem);
                connectDivs(parElem.id, newElem.id, "black", heap[i]);
            }
        }
    }



    drawNode(object) {
        document.getElementById("HpositionError").style.display = "none";
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
            var newElem = document.getElementsByClassName("HElems")[0].cloneNode(true);
            newElem.id = "index" + object;
            newElem.innerHTML = object;

            this._height = 0;
            var parentVal = this.addHelper(root, object, root);
            var parElem = document.getElementById("index" + parentVal);
            if (Number(object) > Number(parentVal)) {
                var left = parElem.style.marginLeft;
                left = Number(left.substring(0, left.length - 2));
                console.log(this._height);
                console.log(this._reHeight);
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
        document.getElementById("HremoveError").style.display = "none";
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
            this._reHeight = -5;
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
            this._reHeight = -5;
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
            // console.log("index" + rootVal);
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
            document.getElementById(root.left.val).remove(); // remove connector
            this.drawNode(root.left.val);
            
            document.getElementById("index" + root.right.val).remove();
            document.getElementById(root.right.val).remove(); // remove connector
            this.drawNode(root.right.val);
            this.drawSubTree(root.left);
            this.drawSubTree(root.right);
        } 

        if (root.left != null) {
            document.getElementById("index" + root.left.val).remove();
            document.getElementById(root.left.val).remove(); // remove connector
            this.drawNode(root.left.val);
            this.drawSubTree(root.left);
        }

        if (root.right != null) {
            document.getElementById("index" + root.right.val).remove();
            document.getElementById(root.right.val).remove(); // remove connector
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
            document.getElementById("HcontainsResult").style.display = "none";
            
            //highlight node

            node.style.animationName = "peek";
            node.style.animationDuration = "1s";
            setTimeout(function () {
            node.style.animationName = "none";
        }, 1000);
            return true;
        } else {
            document.getElementById("HcontainsResult").style.display = "inline-block";
            return false;
        }
    }

    addError() {
        document.getElementById("HpositionError").style.display = "inline-block";
    }


    clear() {
        if (document.getElementById("svg-canvas") != null) {
            document.getElementById("svg-canvas").remove();
        }
        const elements = document.getElementsByClassName("HElems");
        elements[0].style.display = "none";
        while (elements.length > 1) elements[1].remove();
    }

    //style nav bar buttons
    defaultNavStyles() {
        const btnElements = document.getElementsByClassName("HactionNavs");
        Array.prototype.forEach.call(btnElements, function (element) {
            element.style.backgroundColor = "slategray";
            element.style.color = "white";
        });
        const actionElements = document.getElementsByClassName("Hmethods");
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

    peekNavStyle() {
        this.defaultNavStyles();
        this._elements.peekAction.style.display = "block";
        this._elements.peekNav.style.backgroundColor = "snow";
        this._elements.peekNav.style.color = "black";
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
        return document.getElementById("HindexOf").value;
    }

    getAddedElement() {
        return this._elements.add.value;
    }

    getRemovedElement() {
        return document.getElementById("HremoveElem").value;
    }

    getContainsElement() {
        return document.getElementById("Hcontains").value;
    }

    elementDoesNotExist() {
        document.getElementById("Hresult").innerHTML = "False!";
        document.getElementById("Hresult").style.fontWeight = "bolder";
    }

    elementExists() {
        document.getElementById("Hresult").innerHTML = "True!";
        document.getElementById("Hresult").style.fontWeight = "bolder";
    }

    resetElementResult() {
        document.getElementById("Hresult").innerHTML = "";
    }

    changeSize(size) {
        document.getElementById("HsizeDisplay").innerHTML = size;
    }

    removeError() {
        document.getElementById("HremoveError").style.display = "inline-block";
    }

    // hideRemoveError() {
    //     document.getElementById("TremoveError").style.display = "none";
    // }

    hidePositionError() {
        this._elements.positionError.style.display = "none";
    }

    showInvalidElement() {
        this._elements.positionError.style.display = "inline-block";
        this._elements.positionError.innerHTML = "*Please enter a valid element";
    }

}
