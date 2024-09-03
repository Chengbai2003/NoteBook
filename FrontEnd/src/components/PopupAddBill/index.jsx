import { forwardRef, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Popup, Keyboard, Input, Toast } from 'zarm';
import s from './style.module.less';
import cx from 'classnames';
import dayjs from 'dayjs';
import PopupDate from '../PopupDate'
import CustomIcon from '@/components/CustomIcon';
import { ArrowDown } from '@zarm-design/icons';
import { typeMap } from '@/utils'
import axios from '@/utils/axios'

// eslint-disable-next-line react/display-name
const PopupAddBill = forwardRef(({ detail = null, onReload }, ref) => {
  const [show, setShow] = useState(false) // 内部控制弹窗显示隐藏。
  const [payType, setPayType] = useState('expense'); // 支出或收入类型
  const dateRef = useRef();
  const [date, setDate] = useState(new Date()); // 日期
  const [amount, setAmount] = useState(''); // 金额

  const [currentType, setCurrentType] = useState({}); // 当前选中账单类型
  const [expense, setExpense] = useState([]); // 支出类型数组
  const [income, setIncome] = useState([]); // 收入类型数组
  const [remark, setRemark] = useState(''); // 备注
  const [showRemark, setShowRemark] = useState(false); // 备注输入框展示控制

  const id = detail && detail.id; // 账单 id

  useEffect(() => {
    if(detail?.id) {
      setPayType(detail.pay_type == 1 ? 'expense' : 'income')
      setCurrentType({
        id: detail.type_id,
        name: detail.type_name
      })
      setRemark(detail.remark)
      setAmount(detail.amount)
      setDate(dayjs(Number(detail.date)).$d)
    }
  }, [detail])

  useEffect(() => {
    const fetchData = async () => {
      const { data: { list } } = await axios.get('/type/list');
      const _expense = list.filter(i => i.type == 1); // 支出类型
      const _income = list.filter(i => i.type == 2); // 收入类型
      setExpense(_expense);
      setIncome(_income);
        // 没有 id 的情况下，说明是新建账单。
      if (!id) {
        setCurrentType(_expense[0]);
      };
    }
    fetchData()
  }, []);

  // 通过 forwardRef 拿到外部传入的 ref，并添加属性，使得父组件可以通过 ref 控制子组件。
  if (ref) {
    ref.current = {
      show: () => {
        setShow(true);
      },
      close: () => {
        setShow(false);
      }
    }
  };
  const changeType = (type) => {
    setPayType(type);
  };
  const handleDatePop = () => {
    dateRef.current && dateRef.current.show()
  }
  const selectDate = (val) => {
    setDate(val);
  }
  const choseType = (item) => {
    setCurrentType(item)
  }
  const handleMoney = (val) => {
    let value = String(val)
    if (value === 'delete') {
      let _amount = amount.toString().slice(0, amount.length - 1)
      setAmount(_amount)
      return
    }
    if (value == 'ok') {
      addBill()
      return
    }
    // 当输入的值为 '.' 且 已经存在 '.'，则不让其继续字符串相加。
    if (value == '.' && amount.includes('.')) return
    // 小数点后保留两位，当超过两位时，不让其字符串继续相加。
    if (value != '.' && amount.includes('.') && amount && amount.split('.')[1].length >= 2) return
    // amount += value
    setAmount(amount + value)
  }

  const addBill = async () => {
    if(!amount) {
      Toast.show('请输入金额')
      return
    }
    const params = {
      amount: Number(amount).toFixed(2),
      type_id: currentType.id,
      type_name: currentType.name,
      date: dayjs(date).unix() * 1000,
      pay_type: payType == 'expense' ? 1 : 2,
      remark: remark || '',
    }
    if(id) {
      params.id = id
      const res = await axios.post('/bill/update', params)
      if(res.code != 200) return;
      Toast.show('修改成功')
    } else {
      const res = await axios.post('/bill/add', params)
      if(res.code != 200) return;
      setAmount('');
      setPayType('expense');
      setCurrentType(expense[0]);
      setDate(new Date());
      setRemark('')
      Toast.show('添加成功')
    }
    setShow(false);
    if(onReload) {
      onReload()
    }
  }


  return <Popup
    visible={show}
    direction="bottom"
    onMaskClick={() => setShow(false)}
    destroy={false}
    mountContainer={() => document.body}
  >
    <div className={s.addWrap}>
      {/* 右上角关闭弹窗 */}
      <header className={s.header}>
        <span className={s.close} onClick={() => setShow(false)}><CustomIcon type="close" /></span>
      </header>
      {/* 「收入」和「支出」类型切换 */}
      <div className={s.filter}>
        <div className={s.type}>
          <span onClick={() => changeType('expense')} className={cx({ [s.expense]: true, [s.active]: payType == 'expense' })}>支出</span>
          <span onClick={() => changeType('income')} className={cx({ [s.income]: true, [s.active]: payType == 'income' })}>收入</span>
        </div>
        <div
          className={s.time}
          onClick={handleDatePop}
        >{dayjs(date).format('MM-DD')} <ArrowDown className={s.arrow} /></div>
      </div>
      <div className={s.money}>
        <span className={s.sufix}>¥</span>
        <span className={cx(s.amount, s.animation)}>{amount}</span>
      </div>
      <div className={s.typeWarp}>
        <div className={s.typeBody}>
          {
            (payType == 'expense' ? expense : income).map(item => <div onClick={() => choseType(item)} key={item.id} className={s.typeItem}>
              {/* 收入和支出的字体颜色，以及背景颜色通过 payType 区分，并且设置高亮 */}
              <span className={cx({ [s.iconfontWrap]: true, [s.expense]: payType == 'expense', [s.income]: payType == 'income', [s.active]: currentType.id == item.id })}>
                <CustomIcon className={s.iconfont} type={typeMap[item.id].icon} />
              </span>
              <span>{item.name}</span>
            </div>)
          }
        </div>
      </div>
      <div className={s.remark}>
        {
          showRemark ? <Input
            autoHeight
            showLength
            maxLength={50}
            type="text"
            rows={3}
            value={remark}
            placeholder="请输入备注信息"
            onChange={(e) => setRemark(e.target.value)}
            onBlur={() => setShowRemark(false)}
          /> : <span onClick={() => setShowRemark(true)}>{remark || '添加备注'}</span>
        }
      </div>
      <Keyboard type="price" onKeyClick={(value) => handleMoney(value)} />
      <PopupDate ref={dateRef} onSelect={selectDate} />
    </div>
  </Popup>
})

PopupAddBill.propTypes = {
  onReload: PropTypes.func,
  detail: PropTypes.object
}

export default PopupAddBill