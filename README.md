## shopstore
>- 商城管理系统，前台是vue + vue-router +vuex
>- 后台是node + mongodb 提供接口


## 项目运行
**`前台`**
``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```
**`后台`**
```bash
# 先启动mongodb 数据库 ，先导入 good.json 和 user.json 也可以自己增添数据
# 建议搭配可视化工具adminMongo
mongod --dbpath E:\mongodb
# server目录包含后台的所有处理逻辑 启动后台
node ./bin/www

```
## API(后台路由)设计
### 用户接口

- `/users/register   --post请求`  
```js
//注册接口
param = {
  userName: req.body.userName,
  userPwd: req.body.userPwd
}
// 数据库错误
res.json({
  status: "1",
  msg: err.message
});
// 用户名已存在情况
res.json({
  status: '22',
  msg: '用户名和密码已存在'
})
// 注册成功，构建用户信息
let newDoc = new User({
        userId,
        userName: param.userName,
        userPwd: param.userPwd,
        orderList: [],
        cartList: [],
        addressList: []
      })
	res.json({
      status: '0',
      msg: '',
      result: 'success'
    })
```
- `/users/login    --post请求`
```js
//登录接口
var param = {
  userName: req.body.userName,
  userPwd: req.body.userPwd
}
// 成功
res.json({
  status: '0',
  msg: '',
  result: {
    userName: doc.userName
  }
});
// 失败
res.json({
  status: '01',
  msg: '用户名或者密码错误',
  result: ''
})

```
- `/users/logout   --post`
```js
// 清楚cookie userId
res.cookie('userId', '', {
  path: '/',
  maxAge: -1
})
```
- `/users/checkLogin   --GET请求`
```js
//校验用户登录状态
if (req.cookies.userId) {
  res.json({
    status: '0',
    msg: '',
    result: {
      userName: req.cookies.userName
    }
  })
} else {
  res.json({
    status: '1',
    msg: '未登录',
    result: ''
  })
}
```
- `/users/cartList   --GET`
```js
//购物车数据加载
res.json({
  status: '0',
  msg: '',
  result: doc.cartList
})
```
- `/users/cartdel   --POST`
```js
//购物车删除商品
//params
userId = req.cookies.userId;
productId = req.body.productId;
res.json({
  status: '0',
  msg: '',
  result: 'succeess'
})
```
- `/users/cartedit  --POST`
```js
//购物车修改
// params
var userId = req.cookies.userId,
  productId = req.body.productId,
  productNum = req.body.productNum,
  checked = req.body.checked;

```
- `/users/editCheckAll  --POST`
```js
// 购物车全选
// params
var userId = req.cookies.userId,
checkAll = req.body.checkAll ? '1' : '0';
// 返回值
res.json({
  status: '0',
  msg: '',
  result: 'success'
})
```
- `/users/getCartCount    --GET`
```js
//购车商品数量
res.json({
  status: '0',
  msg: '',
  result: cartCount
})
```
- `/users/addressList  --GET //查询用户地址`
- `/users/setDefault   --POST //设置默认地址`
```js
// params
var userId = req.cookies.userId,
addressId = req.body.addressId;
```
- `/users/delAddress   --POST //删除地址`
```js
// params
var userId = req.cookies.userId,
  addressId = req.body.addressId;
```
- `/users/addAddress   --POST //添加地址`
```js
var param = {
  userName: req.body.userName,
  streetName: req.body.streetName,
  postCode: req.body.postCode,
  tel: req.body.tel
}
```
- `/users/payMent  --POST //确认订单`
```js
// params
var userId = req.cookies.userId,
  orderTotal = req.body.orderTotal,
  addressId = req.body.addressId;
```
- `/users/orderDetail   --GET`
```js
//根据订单id 查询订单信息
// params
var userId = req.cookies.userId,
  orderId = req.param('orderId');
```
### 商品信息
- `/goods/list  --GET //查询商品列表`
```js
// params
let page = parseInt(req.param('page'));
let pageSize = parseInt(req.param('pageSize'));
let sort = req.param('sort') || 1;
let skip = (page - 1) * pageSize;
let priceLevel = req.param('priceLevel');
```
- `/goods/addCart   --POST //加入购物车`
```js
// params
var userId = req.cookies.userId,
  productId = req.body.productId;
```

### 后台管理
- `/admin/list  --GET //获取数据列表`
```js
// params
let pageSize = parseInt(req.param('pageSize'));
let currentPage = parseInt(req.param('currentPage'));
```
- `/admin/search  --GET //编辑商品数据 先展示`
```js
// params
let id = req.param('id');
```
- `/admin/edit   --POST //编辑`
```js
let param = {
  productId: req.body.id,
  productName: req.body.name,
  salePrice: req.body.price,
  _id: req.body._id
}
```
- `/admin/del   --POST //删除商品`
```js
// params
let id = req.body.productId;
```
- `admin/add  --POST //添加商品`
```js
// formData 图片传输
var form = new formidable.IncomingForm();
  form.uploadDir = path.normalize(__dirname + './../../static'); //图片上传目录
let imgurl = req.query.img+'.png';
let param = {
  productId: req.query.productId,
  salePrice: req.query.price,
  productName: req.query.productName,
  productImage: imgurl,
  productUrl: ''
}
```
For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
