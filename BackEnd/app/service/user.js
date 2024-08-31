'use strict';

const Service = require('egg').Service;

class UserService extends Service {
  async getUserByName(username) {
    const { app } = this;
    const result = await app.mysql.get('user', { username });
    return result;
  }
  async register(params) {
    const { app } = this;
    const result = await app.mysql.insert('user', params);
    return result;
  }
  async updateUserInfo(params) {
    const { ctx, app } = this;
    const result = await app.mysql.update(
      'user',
      {
        ...params, // 要修改的参数体
      },
      {
        id: params.id, // 直接通过id筛选
      }
    );
    return result;
  }
  async modifyPass(params) {
    const { ctx, app } = this;
    try {
      const result = await app.mysql.update('user', {
        ...params,
      }, {
        id: params.id,
      });
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

module.exports = UserService;
