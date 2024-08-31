'use strict';

const Controller = require('egg').Controller;
const moment = require('moment');

class BillController extends Controller {
  async add() {
    const { ctx, app } = this;
    const { amount, type_id, type_name, date, pay_type, remark = '' } = ctx.request.body;
    if (!amount || !type_id || !type_name || !date || !pay_type) {
      ctx.body = {
        code: 400,
        msg: '参数错误',
        data: null,
      };
    }
    try {
      let user_id;
      const token = ctx.request.header.authorization;
      const decode = await app.jwt.verify(token, app.config.jwt.secret);
      if (!decode) return;
      user_id = decode.id;
      // 添加账单
      const result = await ctx.service.bill.add({
        amount,
        type_id,
        type_name,
        date,
        pay_type,
        remark,
        user_id,
      });
      ctx.body = {
        code: 200,
        msg: '请求成功',
        data: null,
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: '系统错误',
        data: null,
      };
    }

  }
  async list() {
    const { ctx, app } = this;
    const { date, page = 1, page_size = 10, type_id = 'all' } = ctx.query;
    try {
      let user_id;
      const token = ctx.request.header.authorization;
      const decode = await app.jwt.verify(token, app.config.jwt.secret);
      if (!decode) return;
      user_id = decode.id;
      const list = await ctx.service.bill.list(user_id);
      const _list = list.filter(item => {
        if (type_id != 'all') {
          return moment(Number(item.date)).format('YYYY-MM') == date && type_id == item.type_id;
        }
        return moment(Number(item.date)).format('YYYY-MM') == date;
      });
      // 格式化数据
      const listMap = _list.reduce((cur, item) => {
        const date = moment(Number(item.date)).format('YYYY-MM-DD');
        // 如果能在累加的数组中找到当前项日期 date，那么在数组中的加入当前项到 bills 数组
        if (cur && cur.length && cur.findIndex(item => item.date == date) > -1) {
          const index = cur.findIndex(item => item.date == date);
          cur[index].bills.push(item);
        }
        // 如果找不到就新建一项
        if (cur && cur.length && cur.findIndex(item => item.date == date) == -1) {
          cur.push({
            date,
            bills: [ item ],
          });
        }
        // 如果cur为空，则默认添加第一个账单项
        if (!cur.length) {
          cur.push({
            date,
            bills: [ item ],
          });
        }
        return cur;
      }, []).sort((a, b) => moment(b.date) - moment(a.date)); // 时间顺序为倒序，时间越新，在越上面
      // 分页处理
      const filterListMap = listMap.slice((page - 1) * page_size, page * page_size);
      // 计算当月总收入和支出
      const monList = list.filter(item => moment(Number(item.date)).format('YYYY-MM') == date);
      // 累计支出
      const totalExpense = monList.reduce((cur, item) => {
        if (item.pay_type == 1) {
          cur += Number(item.amount);
          return cur;
        }
        return cur;
      }, 0);
      // 累计收入
      const totalIncome = monList.reduce((cur, item) => {
        if (item.pay_type == 2) {
          cur += Number(item.amount);
          return cur;
        }
        return cur;
      }, 0);
      // 返回数据
      ctx.body = {
        code: 200,
        msg: '请求成功',
        data: {
          totalExpense,
          totalIncome,
          total: Math.ceil(listMap.length / page_size), // 总页数
          list: filterListMap || [], // 格式化，经过分页处理的数据
        },
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: '系统错误',
        data: null,
      };
    }
  }
  async detail() {
    const { ctx, app } = this;
    const { id = '' } = ctx.query;
    let user_id;
    const token = ctx.request.header.authorization;
    const decode = await app.jwt.verify(token, app.config.jwt.secret);
    if (!decode) return;
    user_id = decode.id;
    if (!id) {
      ctx.body = {
        code: 500,
        msg: '订单id不能为空',
        data: null,
      };
      return;
    }
    try {
      const detail = await ctx.service.bill.detail(id, user_id);
      ctx.body = {
        code: 200,
        msg: '请求成功',
        data: detail,
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: '系统错误',
        data: null,
      };
    }
  }
  async update() {
    const { ctx, app } = this;
    const { id, amount, type_id, type_name, date, pay_type, remark = '' } = ctx.request.body;
    if (!amount || !type_id || !type_name || !date || !pay_type) {
      ctx.body = {
        code: 400,
        msg: '参数错误',
        data: null,
      };
      return;
    }
    try {
      let user_id;
      const token = ctx.request.header.authorization;
      const decode = app.jwt.verify(token, app.config.jwt.secret);
      if (!decode) return;
      user_id = decode.id;
      const result = await ctx.service.bill.update({
        id,
        amount,
        type_id,
        type_name,
        date,
        pay_type,
        remark,
        user_id,
      });
      ctx.body = {
        code: 200,
        msg: '请求成功',
        data: null,
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: '系统错误',
        data: null,
      };
    }
  }
  async delete() {
    const { ctx, app } = this;
    const { id } = ctx.request.body;
    if (!id) {
      ctx.body = {
        code: 400,
        msg: '参数id缺失',
        data: null,
      };
      return;
    }
    try {
      let user_id;
      const token = ctx.request.header.authorization;
      const decode = app.jwt.verify(token, app.config.jwt.secret);
      if (!decode) return;
      user_id = decode.id;
      const result = await ctx.service.bill.delete(id, user_id);
      ctx.body = {
        code: 200,
        msg: '删除成功',
        data: null,
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: '系统错误',
        data: null,
      };
    }
  }
  async data() {
    const { ctx, app } = this;
    const { date = '' } = ctx.query;
    let user_id;
    const token = ctx.request.header.authorization;
    const decode = await app.jwt.verify(token, app.config.jwt.secret);
    if (!decode) return;
    user_id = decode.id;
    if (!date) {
      ctx.body = {
        code: 400,
        msg: 'date参数缺失',
        data: null,
      };
      return;
    }

    try {
      const result = await ctx.service.bill.list(user_id);
      const start = moment(date).startOf('month').unix() * 1000; // 月初
      const end = moment(date).endOf('month').unix() * 1000; // 月末
      const _data = result.filter(item => (Number(item.date) > start && Number(item.date) < end));
      // 总支出
      const total_expense = _data.reduce((sum, cur) => {
        if (cur.pay_type === 1) {
          sum += Number(cur.amount);
        }
        return sum;
      }, 0);
      const total_income = _data.reduce((sum, cur) => {
        if (cur.pay_type === 2) {
          sum += Number(cur.amount);
        }
        return sum;
      }, 0);
      let total_data = _data.reduce((arr, cur) => {
        const index = arr.findIndex(i => i.type_id == cur.type_id);
        if (index === -1) {
          arr.push({
            type_id: cur.type_id,
            type_name: cur.type_name,
            pay_type: cur.pay_type,
            number: Number(cur.amount),
          });
        }
        if (index > 1) {
          arr[index].number += Number(cur.amount);
        }
        return arr;
      }, []);
      total_data = total_data.map(item => {
        item.number = Number(Number(item.number).toFixed(2));
        return item;
      });
      ctx.body = {
        code: 200,
        msg: '请求成功',
        data: {
          total_expense: Number(total_expense).toFixed(2),
          total_income: Number(total_income).toFixed(2),
          total_data: total_data || [],
        },
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: '系统错误',
        data: null,
      };
    }
  }
}

module.exports = BillController;
