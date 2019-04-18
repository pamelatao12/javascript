function stackJS() {
    const stackModel = new StackModel(['node.js', 'react']);
    const stackView = new StackView(stackModel, {
        'Ssize': document.getElementById("Ssize"),
        'Serror' : document.getElementById("Serror"),
        'SpositionError' : document.getElementById("SpositionError"),
        'SaddNav' : document.getElementById("SaddNav"),
        'SremoveNav' : document.getElementById("SremoveNav"),
        'ScontainsNav' : document.getElementById("ScontainsNav"),
        'SindexNav' : document.getElementById("SindexNav"),
        'SsizeNav' : document.getElementById("SsizeNav"),
        'SclearNav' : document.getElementById("SclearNav"),

        'SaddButton': document.getElementById("SaddBtn"),
        'Sadd': document.getElementById("Sadd"),
        'SremoveButton': document.getElementById("SremoveBtn"),
        'SpeekButton' : document.getElementById("SpeekBtn"),
        'SindexButton' : document.getElementById("SindexBtn"),
        'SclearButton' : document.getElementById("SclearBtn"),
        'SarrayElem' : document.getElementById("SstackIndex"),
        
        'SaddAction' : document.getElementById("SaddAction"),
        'SremoveAction' : document.getElementById("SremoveAction"),
        'ScontainsAction' : document.getElementById("ScontainsAction"),
        'SindexAction' : document.getElementById("SindexAction"),
        'SsizeAction' : document.getElementById("SsizeAction"),
        'SclearAction' : document.getElementById("SclearAction"),
        

        'SallElements' : document.getElementById("SstackElements")
    });
    const controller = new StackController(stackModel, stackView);

}

function LLJS() {
    const model = new LLModel(['node.js', 'react']);
    const view = new LLView(model, {
        'LLsize': document.getElementById("LLsize"),
        'LLerror' : document.getElementById("LLerror"),
        'LLpositionError' : document.getElementById("LLpositionError"),
        'LLaddNav' : document.getElementById("LLaddNav"),
        'LLremoveNav' : document.getElementById("LLremoveNav"),
        'LLreplaceNav' : document.getElementById("LLreplaceNav"),
        'LLcontainsNav' : document.getElementById("LLcontainsNav"),
        'LLgetNav' : document.getElementById("LLgetNav"),
        'LLindexNav' : document.getElementById("LLindexNav"),
        'LLsizeNav' : document.getElementById("LLsizeNav"),
        'LLclearNav' : document.getElementById("LLclearNav"),

        'LLaddButton': document.getElementById("LLaddBtn"),
        'LLadd': document.getElementById("LLadd"),
        'LLremoveButton': document.getElementById("LLremoveBtn"),
        'LLcontainsButton' : document.getElementById("LLcontainsBtn"),
        'LLgetButton' : document.getElementById("LLgetBtn"),
        'LLindexButton' : document.getElementById("LLindexBtn"),
        'LLreplaceButton': document.getElementById("LLreplaceBtn"),
        'LLclearButton' : document.getElementById("LLclearBtn"),
        'LLarrayElem' : document.getElementById("LLindex0"),
        'LLarrow' : document.getElementById("LLarrow0"),
        
        'LLaddAction' : document.getElementById("LLaddAction"),
        'LLremoveAction' : document.getElementById("LLremoveAction"),
        'LLcontainsAction' : document.getElementById("LLcontainsAction"),
        'LLgetAction' : document.getElementById("LLgetAction"),
        'LLindexAction' : document.getElementById("LLindexAction"),
        'LLsetAction' : document.getElementById("LLsetAction"),
        'LLsizeAction' : document.getElementById("LLsizeAction"),
        'LLclearAction' : document.getElementById("LLclearAction"),
        

        'LLallElements' : document.getElementById("LLelements")
    });
    const controller = new LLController(model, view);
}

function arrayListJS() {
    const model = new ArrayListModel(['node.js', 'react']);
    const view = new ArrayListView(model, {
        'createButton': document.getElementById("ALcreate"),
        'size': document.getElementById("ALsize"),
        'error' : document.getElementById("ALerror"),
        'positionError' : document.getElementById("ALpositionError"),
        'addNav' : document.getElementById("ALaddNav"),
        'removeNav' : document.getElementById("ALremoveNav"),
        'replaceNav' : document.getElementById("ALreplaceNav"),
        'containsNav' : document.getElementById("ALcontainsNav"),
        'getNav' : document.getElementById("ALgetNav"),
        'indexNav' : document.getElementById("ALindexNav"),
        'sizeNav' : document.getElementById("ALsizeNav"),
        'clearNav' : document.getElementById("ALclearNav"),

        'addButton': document.getElementById("ALaddBtn"),
        'add': document.getElementById("ALadd"),
        'removeButton': document.getElementById("ALremoveBtn"),
        'containsButton' : document.getElementById("ALcontainsBtn"),
        'getButton' : document.getElementById("ALgetBtn"),
        'indexButton' : document.getElementById("ALindexBtn"),
        'replaceButton': document.getElementById("ALreplaceBtn"),
        'clearButton' : document.getElementById("ALclearBtn"),
        'arrayElem' : document.getElementById("ALindex0"),
        
        'addAction' : document.getElementById("ALaddAction"),
        'removeAction' : document.getElementById("ALremoveAction"),
        'containsAction' : document.getElementById("ALcontainsAction"),
        'getAction' : document.getElementById("ALgetAction"),
        'indexAction' : document.getElementById("ALindexAction"),
        'setAction' : document.getElementById("ALsetAction"),
        'sizeAction' : document.getElementById("ALsizeAction"),
        'clearAction' : document.getElementById("ALclearAction"),
        

        'allElements' : document.getElementById("ALelements")
    });
    const controller = new ArrayListController(model, view);
}

function arrayJS() {
    const model = new ArrayModel(['node.js', 'react']);
    const view = new ArrayView(model, {
        'createButton': document.getElementById("Acreate"),
        'size': document.getElementById("Asize"),
        'error' : document.getElementById("Aerror"),
        'positionError' : document.getElementById("ApositionError"),
        'addButton': document.getElementById("AaddBtn"),
        'add': document.getElementById("Aadd"),
        'removeButton': document.getElementById("AremoveBtn"),
        'replaceButton': document.getElementById("AreplaceBtn"),
        'arrayElem' : document.getElementById("Aindex0"),
        'addNav' : document.getElementById("AaddNav"),
        'removeNav' : document.getElementById("AremoveNav"),
        'replaceNav' : document.getElementById("AreplaceNav"),
        'addAction' : document.getElementById("AaddAction"),
        'removeAction' : document.getElementById("AremoveAction"),
        'replaceAction' : document.getElementById("AreplaceAction"),
        'allElements' : document.getElementById("Aelements")
    });
    const controller = new ArrayController(model, view);
}

window.onload = function() {
    arrayJS();
    arrayListJS();
    LLJS();
    stackJS();
    setUpDropdown();
}



