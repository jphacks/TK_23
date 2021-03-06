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

    codeAddress(currentUser.address, function(lat, lon){
	$("#userObjectId").val(currentUser.objectId);
	$("#geoLat").val(lat);
	$("#geoLon").val(lon);
    });
    
//    set("userObjectId", currentUser.objectId)
});

$(document).ready(function(){
    var currentUser = ncmb.User.getCurrentUser();

    $.ajax({
    	url: "/coupons",
    	type:'GET',
    	dataType: 'json',
    	data : {userObjectId : currentUser.objectId},
    	timeout:10000,
	
    	success: function(data) {

	    for(var i=0;i<data.length;i++){
		console.log(data[i]);

		$("#coupons").prepend('<div class="col-md-3 col-sm-6 col-xs-12"><table class="table table-bordered"><tr><td style="text-align:center;"><img alt="" style="width:100%;height:auto;" src="http://52.69.224.97:3000//uploads/'+data[i].imageName+'"/></td></tr><tr><td>'+data[i].message+'</td></tr><tr><td>'+currentUser.address+'</td></tr><tr><td><button class="btn btn-danger">削除</button></td></tr></table></div>');
	    }
	    
	    // console.log(data);
	    // for(var i=0;i<data.lenth;i++){
	    // 	console.log(data[i]);
	    // }
	    
    	},
    	error: function(XMLHttpRequest, textStatus, errorThrown) {
    	    alert("error");
    	}
    });
    
    // $.get( "/coupons?userObjectId="+currentUser.objectId, function( data ) {
    // 	console.log(data);
    // });
    

    /*
    var Coupon = ncmb.DataStore("coupon");

//    Coupon.equalTo("objectId", "EofbvjxgBnfB0DFB")
    Coupon.equalTo("userObjectId", currentUser.objectId)
//	.oder("createDate")
	.fetchAll()
	.then(function(results){
	    console.log(results);
	})
        .catch(function(err){
	    console.log(err);
	});;
    */
    
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
			console.log(latitude);

			func(latitude, longitude);
			break;
		    } else {
			alert("Geocode 取得に失敗しました reason: " + status);
		    }
		};
	    }
	});
    }
};
