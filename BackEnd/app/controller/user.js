"use strict"

const defaultAvatar = "https://img.ixintu.com/download/jpg/20200901/3e9ce3813b7199ea9588eeb920f41208_512_512.jpg"

const Controller = require('egg').Controller

class UserController extends Controller {
    async register() {
        const { ctx } = this;
        const { username, password } = ctx.request.body;
        const userInfo = await ctx.service.user.getUserByName(username);
        if (userInfo && userInfo.id) {
            ctx.body = {
                code: 500,
                msg: '账户名已被注册，请重新输入',
                data: null
            }
            return;
        }
        const result = await ctx.service.user.register({
            username,
            password,
            signature: '',
            avatar: defaultAvatar
        });
        if (result) {
            ctx.body = {
                code: 200,
                msg: '注册成功',
                data: null
            }
        } else {
            ctx.body = {
                code: 500,
                msg: '注册失败',
                data: null
            }
        }
    }
    async login() {
        const { ctx, app } = this;
        const { username,password } = ctx.request.body;
        const userInfo = await ctx.service.user.getUserByName(username);

        if (!userInfo || !userInfo.id) {
            ctx.body = {
                code: 500,
                msg: '账号不存在',
                data: null
            }
            return
        }
        if (userInfo && password !== userInfo.password) {
            ctx.body = {
                code: 500,
                msg: '账号密码错误',
                data: null
            }
            return
        }

        const token = app.jwt.sign({
            id: userInfo.id,
            username: userInfo.username,
            exp: Math.floor(Date.now() / 1000) + (24 * 60 *60), // token 有效期为24h
        },app.config.jwt.secret);

        ctx.body = {
            code: 200,
            msg: '登录成功',
            data: {
                token
            },
        };
    }
    async test() {
        const { ctx, app } = this;
        const token = ctx.request.header.authorization;
        const decode = await app.jwt.verify(token, app.config.jwt.secret);
        ctx.body = {
            code: 200,
            msg: '获取成功',
            data: {
                ...decode
            }
        }
    }
    async updateUserInfo() {
        const { ctx, app } = this;
        const { signature = '', avatar = '' } = ctx.request.body;
        try {
            let user_id
            const token = ctx.request.header.authorization;
            const decode = await app.jwt.verify(token, app.config.jwt.secret);
            if (!decode) return;
            user_id = decode.id;

            const userInfo = await ctx.service.user.getUserByName(decode.username)
            const result = await ctx.service.user.updateUserInfo({
                ...userInfo,
                signature,
                avatar
            })
            ctx.body = {
                code: 200,
                msg: '修改成功',
                data: {
                    id: user_id,
                    signature,
                    username: userInfo.username,
                    avatar
                }
            }
        } catch (error) {
            // console.log(error);
            // ctx.body = {
            //     code: 500,
                
            // }
        }
    }
}

module.exports = UserController;