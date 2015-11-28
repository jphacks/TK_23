var apikey = "655099e79b56b4ca5a1429d184acd69f480738197c9ad755b5658a6f8db0571a";
var clientkey = "071d9fc038d795a9895b96545df65f43fe4b32781181d45649b1f6d39c717555";

var ncmb = null;

$(function() {
    ncmb = new NCMB(apikey, clientkey);
    var currentUser = ncmb.User.getCurrentUser();
    
    console.log(currentUser);
    if (currentUser) {
        console.log("ログイン中のユーザー: " + currentUser.get("userName"));
    } else {
        alert("ログインしてください！");
        location.href = "./index.html";
    }
});

$(document).ready(function(){
    var currentUser = ncmb.User.getCurrentUser();
    var Shop = ncmb.DataStore("shop");
    var shop = new Shop();

    // ショップ追加処理
    $("#addshop").click(function(e){
        e.preventDefault();
	$("#addshop").prop('disabled', true);
	

	var shop_name = $("#shop_name").val();
	//var shop_addr = $("#shop_addr").val();

	shop.set("userObjectId", currentUser.objectId)
	    .set("shopName", shop_name)
	    //.set("geoPoint ", shop_addr)
	    .save()
	    .then(function(res){
		$("#shop_name").val("");
		$("#shop_addr").val("");
		
		alert("保存完了");
		location.href = "./mypage.html";
	    })
	    .catch(function(err){
		console.log(err);

		alert("error");
		$("#addshop").prop('disabled', false);
	    });
    });
    
    // ログアウト処理
    $("#logout").click(function(e) {
        e.preventDefault();
        currentUser.logout()
	    .then(function(data) {
		// ログイン後処理
		alert("ログアウトしました！");
		location.href = "./index.html";
            })
	    .catch(function(err) {
		// エラー処理
		console.log(err);
		//alert(err);
            });
    });

});