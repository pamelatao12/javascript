function stackJS() {
    const stackModel = new StackModel(['node.js', 'react']);
    const stackView = new StackView(stackModel, {
        'size': document.getElementById("size"),
        'error' : document.getElementById("error"),
        'positionError' : document.getElementById("positionError"),
        'addNav' : document.getElementById("addNav"),
        'removeNav' : document.getElementById("removeNav"),
        'containsNav' : document.getElementById("containsNav"),
        'indexNav' : document.getElementById("indexNav"),
        'sizeNav' : document.getElementById("sizeNav"),
        'clearNav' : document.getElementById("clearNav"),

        'addButton': document.getElementById("addBtn"),
        'add': document.getElementById("add"),
        'removeButton': document.getElementById("removeBtn"),
        'peekButton' : document.getElementById("peekBtn"),
        'indexButton' : document.getElementById("indexBtn"),
        'clearButton' : document.getElementById("clearBtn"),
        'arrayElem' : document.getElementById("stackIndex"),
        
        'addAction' : document.getElementById("addAction"),
        'removeAction' : document.getElementById("removeAction"),
        'containsAction' : document.getElementById("containsAction"),
        'indexAction' : document.getElementById("indexAction"),
        'sizeAction' : document.getElementById("sizeAction"),
        'clearAction' : document.getElementById("clearAction"),
        

        'allElements' : document.getElementById("stackElements")
    });
    const controller = new StackController(stackModel, stackView);

}

function LLJS() {
    const model = new LLModel(['node.js', 'react']);
    const view = new LLView(model, {
        'size': document.getElementById("size"),
        'error' : document.getElementById("error"),
        'positionError' : document.getElementById("positionError"),
        'addNav' : document.getElementById("addNav"),
        'removeNav' : document.getElementById("removeNav"),
        'replaceNav' : document.getElementById("replaceNav"),
        'containsNav' : document.getElementById("containsNav"),
        'getNav' : document.getElementById("getNav"),
        'indexNav' : document.getElementById("indexNav"),
        'sizeNav' : document.getElementById("sizeNav"),
        'clearNav' : document.getElementById("clearNav"),

        'addButton': document.getElementById("addBtn"),
        'add': document.getElementById("add"),
        'removeButton': document.getElementById("removeBtn"),
        'containsButton' : document.getElementById("containsBtn"),
        'getButton' : document.getElementById("getBtn"),
        'indexButton' : document.getElementById("indexBtn"),
        'replaceButton': document.getElementById("replaceBtn"),
        'clearButton' : document.getElementById("clearBtn"),
        'arrayElem' : document.getElementById("index0"),
        'arrow' : document.getElementById("arrow0"),
        
        'addAction' : document.getElementById("addAction"),
        'removeAction' : document.getElementById("removeAction"),
        'containsAction' : document.getElementById("containsAction"),
        'getAction' : document.getElementById("getAction"),
        'indexAction' : document.getElementById("indexAction"),
        'setAction' : document.getElementById("setAction"),
        'sizeAction' : document.getElementById("sizeAction"),
        'clearAction' : document.getElementById("clearAction"),
        

        'allElements' : document.getElementById("elements")
    });
    const controller = new LLController(model, view);
}

function arrayListJS() {
    const model = new ArrayListModel(['node.js', 'react']);
    const view = new ArrayListView(model, {
        'createButton': document.getElementById("create"),
        'size': document.getElementById("size"),
        'error' : document.getElementById("error"),
        'positionError' : document.getElementById("positionError"),
        'addNav' : document.getElementById("addNav"),
        'removeNav' : document.getElementById("removeNav"),
        'replaceNav' : document.getElementById("replaceNav"),
        'containsNav' : document.getElementById("containsNav"),
        'getNav' : document.getElementById("getNav"),
        'indexNav' : document.getElementById("indexNav"),
        'sizeNav' : document.getElementById("sizeNav"),
        'clearNav' : document.getElementById("clearNav"),

        'addButton': document.getElementById("addBtn"),
        'add': document.getElementById("add"),
        'removeButton': document.getElementById("removeBtn"),
        'containsButton' : document.getElementById("containsBtn"),
        'getButton' : document.getElementById("getBtn"),
        'indexButton' : document.getElementById("indexBtn"),
        'replaceButton': document.getElementById("replaceBtn"),
        'clearButton' : document.getElementById("clearBtn"),
        'arrayElem' : document.getElementById("index0"),
        
        'addAction' : document.getElementById("addAction"),
        'removeAction' : document.getElementById("removeAction"),
        'containsAction' : document.getElementById("containsAction"),
        'getAction' : document.getElementById("getAction"),
        'indexAction' : document.getElementById("indexAction"),
        'setAction' : document.getElementById("setAction"),
        'sizeAction' : document.getElementById("sizeAction"),
        'clearAction' : document.getElementById("clearAction"),
        

        'allElements' : document.getElementById("elements")
    });
    const controller = new ArrayListController(model, view);
}

function arrayJS() {
    const model = new ArrayModel(['node.js', 'react']);
    const view = new ArrayView(model, {
        'createButton': document.getElementById("create"),
        'size': document.getElementById("size"),
        'error' : document.getElementById("error"),
        'positionError' : document.getElementById("positionError"),
        // 'dsCanvas': document.getElementById("dsCanvas"),
        // 'context': document.getElementById("dsCanvas").getContext("2d"),
        'addButton': document.getElementById("addBtn"),
        'add': document.getElementById("add"),
        'removeButton': document.getElementById("removeBtn"),
        'replaceButton': document.getElementById("replaceBtn"),
        'arrayElem' : document.getElementById("index0"),
        'addNav' : document.getElementById("addNav"),
        'removeNav' : document.getElementById("removeNav"),
        'replaceNav' : document.getElementById("replaceNav"),
        'addAction' : document.getElementById("addAction"),
        'removeAction' : document.getElementById("removeAction"),
        'replaceAction' : document.getElementById("replaceAction"),
        'allElements' : document.getElementById("elements")
    });
    const controller = new ArrayController(model, view);
}

window.onload = function() {
    arrayJS();
    arrayListJS();
    LLJS();
    stackJS();
}



