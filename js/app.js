'use strict';

(function() {
	function init() {
		var router = new Router([
			new Route('home', 'home.html', true),
			new Route('array', 'dsArray.html'),
			new Route('arrayList', 'dsArrayList.html'),
			new Route('linkedList', 'dsLinkedList.html'),
			new Route('stack', 'dsStack.html')
			]);
	}
	init();
}());