import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { List } from 'zarm';
import { useNavigate } from 'react-router-dom'
import CustomIcon from '../CustomIcon';
import { typeMap } from '@/utils';

import s from './style.module.less';

const BillItem = ({ bill }) => {
  const [income, setIncome] = useState(0); // 收入
  const [expense, setExpense] = useState(0); // 支出
  const navigate = useNavigate(); // 路由实例
  useEffect(() => {
    if (bill && Array.isArray(bill.bills)) {
      const _income = bill.bills.filter(i => i.pay_type === 2).reduce((curr, item) => {
        curr += Number(item.amount);
        return curr;
      }, 0);
      setIncome(_income);

      const _expense = bill.bills.filter(i => i.pay_type === 1).reduce((curr, item) => {
        curr += Number(item.amount);
        return curr;
      }, 0);
      setExpense(_expense);
    }
  }, [bill?.bills]);

  const goToDetail = (item) => {
    navigate(`/detail?id=${item.id}`);
  };
  return (
    <div className={s.item}>
      <div className={s.headerDate}>
        <div className={s.date}>{bill?.date}</div>
        <div className={s.money}>
          <span>
            <img src="//s.yezgea02.com/1615953405599/zhi%402x.png" alt="支" />
            <span>¥{expense.toFixed(2)}</span>
          </span>
          <span>
            <img src="//s.yezgea02.com/1615953405599/shou%402x.png" alt="收" />
            <span>¥{income.toFixed(2)}</span>
          </span>
        </div>
      </div>
      <List>
        {bill?.bills &&
          bill.bills.map(item => (
            <List.Item
              className={s.bill}
              key={item.id}
              onClick={() => goToDetail(item)}
              prefix={
                <CustomIcon
                  className={s.itemIcon}
                  type={item.type_id ? typeMap[item.type_id]?.icon.toString() : 'catering'}
                />
              }
              title={
                <>
                  <span>{item.type_name}</span>
                </>
              }
              description={
                <span style={{ color: item.pay_type === 2 ? 'red' : '#39be77' }}>
                  {`${item.pay_type === 1 ? '-' : '+'}${item.amount}`}
                </span>
              }
              help={<div>{dayjs(Number(item.date)).format('HH:mm')} {item.remark ? `| ${item.remark}` : ''}</div>}
            />
          ))}
      </List>
    </div>
  );
};

BillItem.propTypes = {
  bill: PropTypes.object
};

export default BillItem;