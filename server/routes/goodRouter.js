var express = require('express')
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require('../models/goods');
var User = require('../models/user')
mongoose.connect('mongodb://127.0.0.1:27017/mullstore');

//查询商品列表
router.get('/list', function(req, res, next) {
	// res.send('hello good list')
	let page = parseInt(req.param('page'));
	let pageSize = parseInt(req.param('pageSize'));
	let sort = req.param('sort') || 1;
	let skip = (page - 1) * pageSize;
	let priceLevel = req.param('priceLevel');
	let priceMin = 0,
		priceMax = 0;
	let params = {};
	if (priceLevel != 'all') {
		switch (priceLevel) {
			case '0':
				priceMin = 0;
				priceMax = 500;
				break;
			case '1':
				priceMin = 500;
				priceMax = 1000;
				break;
			case '2':
				priceMin = 1000;
				priceMax = 5000;
				break;
		}

		params = {
			salePrice: {
				$gt: priceMin,
				$lte: priceMax
			}
		}

	}
	let goodsModel = Goods.find(params).sort({'_id':-1}).skip(skip).limit(pageSize);
	goodsModel.sort({
		'salePrice': sort
	});
	goodsModel.exec(function(err, doc) {
		if (err) {
			res.json({
				status: 1,
				msg: err.message
			})
		} else {
			res.json({
				status: 0,
				msg: '',
				result: {
					count: doc.length,
					list: doc
				}
			})
		}
	})
})

//加入购物车
router.post('/addCart', function(req, res, next) {
	// userId = '100000077'
	var userId = req.cookies.userId,
		productId = req.body.productId;

	console.log(productId)
	User.findOne({
		userId: userId
	}, function(err, userDoc) {
		if (err) {
			res.json({
				status: '1',
				msg: err.message
			})
		} else {
			if (userDoc) {

				let goosdItem = '';
				userDoc.cartList.forEach((item) => {
					if (item.productId == productId) {
						goosdItem = item;
						item.productNum++;
					}
				})

				if (goosdItem) {
					userDoc.save(function(err2, doc2) {
						if (err2) {
							res.json({
								status: '1',
								msg: err2.message
							})
						} else {
							res.json({
								status: '0',
								msg: '',
								result: 'success'
							})
						}
					})
				} else {
					Goods.findOne({
						productId: productId
					}, function(err1, doc) {
						if (err1) {
							res.json({
								status: '1',
								msg: err1.message
							})
						} else {
							if (doc) {
								doc.productNum = 1;
								doc.checked = 1;
								userDoc.cartList.push(doc);
								userDoc.save(function(err2, doc2) {
									if (err2) {
										res.json({
											status: '1',
											msg: err2.message
										})
									} else {
										res.json({
											status: '0',
											msg: '',
											result: 'success'
										})
									}
								})
							}
						}
					})
				}


			}
		}
	})
})

module.exports = router;
