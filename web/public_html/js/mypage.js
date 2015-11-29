var apikey = "655099e79b56b4ca5a1429d184acd69f480738197c9ad755b5658a6f8db0571a";
var clientkey = "071d9fc038d795a9895b96545df65f43fe4b32781181d45649b1f6d39c717555";

var ncmb = null;

$(function() {
    ncmb = new NCMB(apikey, clientkey);
    var currentUser = ncmb.User.getCurrentUser();
    
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
    // XXX:submitに変更
    $("form#shop_form").submit(function(e){
        e.preventDefault();
	$("#addshop").prop('disabled', true);

	//var shop_name = $("#shop_name").val();
	//var shop_addr = $("#shop_addr").val();
	var shop_msg = $("#shop_msg").val();

	codeAddress(currentUser.address, function(geo){
	    //regShop(shop_name, shop_addr, geo);
	    regCoupon(geo, shop_msg);
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

    /**
     * クーポン登録
     *
     * @param {string} name 店舗名
     * @param {string} addr 住所
     * @param {geoObject} geo 住所ジオポイント
     */
    var regCoupon = function(geo, msg){
	console.log(geo);
	console.log(msg);
	
	shop.set("userObjectId", currentUser.objectId)
	    .set("geoPoint", geo)
	    .set("message", msg)
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
    };
    
    /**
     * ショップ登録
     *
     * @param {string} name 店舗名
     * @param {string} addr 住所
     * @param {geoObject} geo 住所ジオポイント
     */
    var regShop = function(name, addr, geo){
	console.log(name);
	console.log(addr);
	console.log(geo);
	
	shop.set("userObjectId", currentUser.objectId)
	    .set("geoPoint", geo)
	    .set("shopName", name)
	    .set("address", addr)
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
    };

    

    var codeAddress = function(address, func){
	var geocoder = new google.maps.Geocoder();
	var latitude = "",
	    longitude = "";
	var resflg = false;
	
	if (geocoder) {
	    geocoder.geocode({
		'address': address,
		'region': 'jp'
	    }, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {

		    for (var r in results) {
			if (results[r].geometry) {
			    var latlng = results[r].geometry.location;

			    latitude = latlng.lat();
			    longitude = latlng.lng();

			    var geo = new ncmb.GeoPoint(latitude, longitude);
			    
			    func(geo);
			    break;
			} else {
			    alert("Geocode 取得に失敗しました reason: " + status);
			}
		    };
		}
	    });
	}
	return new ncmb.GeoPoint(latitude, longitude);
    };


});

