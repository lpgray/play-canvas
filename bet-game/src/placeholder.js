/**
 * Placeholders
 */
function ajax(url, callback) {
    $.ajax({
        url: url,
        success: callback,
        dataType: 'html'
    });
}
function checkLogon(callback){
	return ajax('json/loginCheck.json', callback);
};
function getUserInfo(custNum, callback){
	return ajax('json/getUserInfo.json', callback);
};
function getAllOddInfo(callback){
	return ajax('json/getBetInfo.json', callback);
};
function submitWagerInfo(data, callback){
    console.info('执行投注', data);
	return ajax('json/saveBet.json', callback);
};