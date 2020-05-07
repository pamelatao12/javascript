function cancelBubble(e){
console.log("canceled");
    e.cancelBubble = true;
    // if(e.stopPropagation)
     e.stopPropagation();
}