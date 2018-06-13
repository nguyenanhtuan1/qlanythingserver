var mongoose = require('mongoose');
var bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

var express = require('express');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.raw(options));

mongoose.connect('mongodb://tkapp:tkapp123@ds139950.mlab.com:39950/qlenythingtk');
//tai khoan
var accountSchema = new mongoose.Schema({
	name:String,
	password:String
});

//san pham
var productSchema = new mongoose.Schema({
	name:String,
	photo:String,
	creator:String,
	unitProduct:String,
	unitWholesale:String,
	unitRetail:String,
	codeProduct:String,
	currency:String,
	pricePurchase:Number,
	priceWholesale:Number,
	priceRetail:Number,
	active:Boolean
});

var UserDetail = module.exports = mongoose.model('taiKhoans',accountSchema);
var ProductDetail = module.exports = mongoose.model('products',productSchema);

app.post('/login',function(req,res){
	UserDetail.findOne({'name': req.body.name}, function(err, data){
		if (err) {
			console.log(err);
		}else{
			console.log("name  found");
			if (data==null) {
				res.end(JSON.stringify(new ResultData(data,false,'Tài khoản không đúng')));
			}else{
				if (req.body.password!=data.password) {
					res.end(JSON.stringify(new ResultData(null,false,'mật khẩu không đúng với tài khoản')));
				}else{
					res.end(JSON.stringify(new ResultData(data,true,'')));
				}
			}
		}
	});
});

app.post('/register',function(req,res){
	UserDetail.findOne({'name': req.body.name}, function(err, data){
		if (err) {
			console.log(err);
		}else{
			if (data!=null) {
				res.end(JSON.stringify(new ResultData(null,false,'tài khoản này đã được sử dụng')));
			}else{
				var account = UserDetail(req.body);
				account.save(function (err,data) {
					if (err) {
						throw err;
					}
					res.end(JSON.stringify(new ResultData(data,true,'')));
				})
			}
		}
	});
});

app.post('/createProduct',function(req,res){
	var product = ProductDetail(req.body);
	product.save(function (err,data) {
		if (err) {
			throw err;
		}
		res.end(JSON.stringify(new ResultData(data,true,'')));
	})
});

app.post('/updateProduct/:id', function(req, res) {
    ProductDetail.update({_id: req.params.id}, req.body, function (err, result) {
           	if (err) {
    			res.end(JSON.stringify(new ResultData(null,false,'server err')));
    		}else{
       			 res.end(JSON.stringify(new ResultData(result,true,'')));
    		}
    });
});

app.get('/allProduct/:creator',function(req,res){
		ProductDetail.find({'creator' : req.params.creator},function(err,data){
		if (err) {
			throw err;
		}
		res.end(JSON.stringify(new ResultData(data,true,'')));
	});
});

function ResultData(results,success,error){
			this.results = results;
			this.success = success;
			this.erro = error
		 };

var options = {
  inflate: true,
  // limit: '1000kb',
  type: 'application/json'
};

app.listen(3000);