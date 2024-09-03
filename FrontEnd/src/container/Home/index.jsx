import { useState, useEffect, useRef } from 'react'
import { Icon, Pull } from 'zarm'
import dayjs from 'dayjs'
import BillItem from '@/components/BillItem'
import PopupType from '@/components/PopupType'
import PopupDate from '@/components/PopupDate'
import CustomIcon from '@/components/CustomIcon'
import PopupAddBill from '@/components/PopupAddBill'
import { REFRESH_STATE, LOAD_STATE } from '@/utils'
import axios from '@/utils/axios'

import s from './style.module.less'

const Home = () => {

  const [currentTime, setCurrentTime] = useState(dayjs().format('YYYY-MM'));
  const [page, setPage] = useState(1); // 分页
  const [list, setList] = useState([]); // 账单列表
  const [totalPage, setTotalPage] = useState(0); // 分页总数
  const [refreshing, setRefreshing] = useState(REFRESH_STATE.normal); // 下拉刷新状态
  const [loading, setLoading] = useState(LOAD_STATE.normal); // 上拉加载状态


  const typeRef = useRef()
  const monthRef = useRef();
  const addRef = useRef()
  const [currentSelect, setCurrentSelect] = useState({}); // 当前选中的账单类型

  const [totalExpense, setTotalExpense] = useState(0); // 总支出
  const [totalIncome, setTotalIncome] = useState(0); // 总收入

  useEffect(() => {
    getBillList() // 初始化
  }, [page, currentSelect, currentTime])
  // 获取账单
  const getBillList = async () => {
    axios.get('/bill/list', {
      params: {
        page,
        date:currentTime,
        type_id: currentSelect.id || 'all'
      }
    }).then(res => {
      const { data } = res
      if (page == 1) {
        setList(data.list)
      } else {
        setList(list.concat(data.list))
      }
      setTotalExpense(data.totalExpense.toFixed(2));
      setTotalIncome(data.totalIncome.toFixed(2));
      setTotalPage(data.totalPage)
      // 上滑加载状态
      setLoading(LOAD_STATE.success)
      setRefreshing(REFRESH_STATE.success)
    })
  }
  // 刷新数据
  const refreshData = () => {
    setRefreshing(REFRESH_STATE.loading)
    if (page != 1) {
      setPage(1);
    } else {
      getBillList();
    };
  }
  // 加载更多
  const loadData = () => {
    if (page < totalPage) {
      setLoading(LOAD_STATE.loading);
      setPage(page + 1);
    }
  }
  // 筛选类型
  const typeToggle = () => {
    typeRef.current && typeRef.current.show()
  }
  const typeSelect = (item) => {
    setRefreshing(REFRESH_STATE.loading);
    setPage(1);
    setCurrentSelect(item);
  }
  // 筛选月份
  const monthToggle = () => {
    monthRef.current && monthRef.current.show()
  };
  const selectMonth = (item) => {
    setRefreshing(REFRESH_STATE.loading);
    setPage(1);
    setCurrentTime(item)
  };
  // 增加账单
  const addToggle = () => {
    addRef.current && addRef.current.show()
  }

  return (
    <div className={s.home}>
      <div className={s.header}>
        <div className={s.dataWrap}>
          <span className={s.expense}>总支出：<b>¥ { totalExpense }</b></span>
          <span className={s.income}>总收入：<b>{ totalIncome }</b></span>
        </div>
        <div className={s.typeWrap}>
          <div className={s.left}>
            <div className={s.left} onClick={typeToggle}>
              <span className={s.title}>{currentSelect.name || '全部类型'} <Icon className={s.arrow} type="arrow-bottom" /></span>
            </div>
          </div>
          <div className={s.right}>
            <span className={s.time} onClick={monthToggle}>{currentTime}<Icon className={s.arrow} type="arrow-bottom" /></span>
          </div>
        </div>
      </div>
      <div className={s.contentWrap}>
        {
          list.length ? <Pull
            animationDuration={200}
            stayTime={400}
            refresh={{
              state: refreshing,
              handler: refreshData
            }}
            load={{
              state: loading,
              distance: 200,
              handler: loadData
            }}
          >
            {
              list.map((item, index) => <BillItem bill={item} key={index} />)
            }
          </Pull> : null
        }
      </div>
      <div className={s.add} onClick={addToggle}><CustomIcon type="add_bill" /></div>
      <PopupType ref={typeRef} onSelect={typeSelect} />
      <PopupDate ref={monthRef} mode="month" onSelect={selectMonth} />
      <PopupAddBill ref={addRef} onReload={refreshData} />
    </div>
  );
};

export default Home