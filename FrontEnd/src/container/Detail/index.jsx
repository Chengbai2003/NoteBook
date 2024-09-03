import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PopupAddBill from '@/components/PopupAddBill';
import qs from 'query-string';
import dayjs from 'dayjs';
import cx from 'classnames';
import Header from '@/components/Header';
import CustomIcon from '@/components/CustomIcon';
import axios from '@/utils/axios';
import { typeMap } from '@/utils';
import { Modal, Toast } from 'zarm'

import s from './style.module.less';

const Detail = () => {
  const location = useLocation(); // 获取 locaton 实例，我们可以通过打印查看内部都有些什么内容。
  const navigate = useNavigate();
  const { id } = qs.parse(location.search);
  const [detail, setDetail] = useState({});
  const editRef = useRef();

  useEffect(() => {
    getDetail()
  }, []);

  const getDetail = async () => {
    const { data } = await axios.get(`/bill/detail?id=${id}`);
    setDetail(data);
  }
  const deleteDatail = () => {
    Modal.confirm({
      title: '删除',
      content: '确定要删除这条记录吗？',
      onAction: async () => {
        const res = await axios.post('/bill/delete',{ id });
        if (res.code === 200) {
          Toast.show('删除成功');
          navigate(-1);
        }
      }
    })
  }

  return <div className={s.detail}>
    <Header title='账单详情' />
    <div className={s.card}>
      <div className={s.type}>
        {/* 通过 pay_type 属性，判断是收入或指出，给出不同的颜色*/}
        <span className={cx({ [s.expense]: detail.pay_type == 1, [s.income]: detail.pay_type == 2 })}>
          {/* typeMap 是我们事先约定好的 icon 列表 */}
          <CustomIcon className={s.iconfont} type={detail.type_id ? typeMap[detail.type_id].icon : 1} />
        </span>
        <span>{ detail.type_name || '' }</span>
      </div>
      {
        detail.pay_type == 1
          ? <div className={cx(s.amount, s.expense)}>-{ detail.amount }</div>
          : <div className={cx(s.amount, s.incom)}>+{ detail.amount }</div>
      }
      <div className={s.info}>
        <div className={s.time}>
          <span>记录时间</span>
          <span>{dayjs(Number(detail.date)).format('YYYY-MM-DD HH:mm')}</span>
        </div>
        <div className={s.remark}>
          <span>备注</span>
          <span>{ detail.remark || '-' }</span>
        </div>
      </div>
      <div className={s.operation}>
        <span onClick={deleteDatail}><CustomIcon type='delete' />删除</span>
        <span onClick={() => editRef.current && editRef.current.show()}><CustomIcon type='edit' />编辑</span>
      </div>
      <PopupAddBill ref={editRef} detail={detail} onReload={getDetail} />
    </div>
  </div>
}

export default Detail