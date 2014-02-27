/**
 * Test
 */
$(function(){
	function test() {
		// sound.typing();
		store.loginCheck(function(data) {
			console.info(data);
		});

		store.getUsrInfo(123, function(data) {
			console.info(data);
		});

		store.getBetInfo(function(data){
			console.info(data);
		});

		store.saveBet(null, function(data){
			console.info(data);
		});
	}

	function test2(){
		view.gogogo();
	}

	// test();
	// test2();
});