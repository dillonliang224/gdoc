# apidoc插件

## 安装

## 使用
1. 获取http请求的返回结果
```json
{
    "code": 0,
    "result": {
        "id": 1000,
        "name": "dillon",
        "avatar": "http://image.dillonliang.cn/blog/blog-header.jpg"
    }
}
```

把上面的json贴到需要生成日志的地方，选中json右击，选中gdoc即可，会生成如下apidoc。
```json
/**
 * @api {get} /user/info 用户账户信息
 * @apiName 
 * @apiGroup 
 * @apiVersion 0.1.0
 * @apiDescription 
 * @apiPermission User
 *
 * @apiUse PublicParam
 *
 * @apiParamExample {json} Request-Example:
 * Here is a request example.
 *
 * @apiSuccess {Number} code
 * @apiSuccess {Object} result
 * @apiSuccess {Number} result.id
 * @apiSuccess {String} result.name
 * @apiSuccess {String} result.avatar
 *
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *     "code": 0
 *     "result": {
 *         "id": 1000
 *         "name": "dillon"
 *         "avatar": "http://image.dillonliang.cn/blog/blog-header.jpg"
 *     }
 * }
 *
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 401 TOKEN_INVALID
 * {
 * 	  "ecode": -101,
 *     "message": '无效token',
 * }
 */
```

## 本地开发相关

打包，生成的.vsix文件直接安装就行
```sh
vsce package
```

参考demo: https://github.com/mre/vscode-snippet/blob/master/src/extension.ts

## github发布

1. 本地更新package.json里的version
2. 提交代码并打tag(同version)
3. travis自动构建.vsix文件到release界面
4. 更新release界面的日志（可选）