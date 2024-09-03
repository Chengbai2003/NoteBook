import { useState, useEffect } from 'react'
import axios from '@/utils/axios'
import { List, Button } from 'zarm'
import { useNavigate } from 'react-router-dom'
import s from './style.module.less';

const User = () => {
  const [user, setUser] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    getUserInfo()
  }, [])

  const getUserInfo = async () => {
    axios.get('/user/get_userinfo')
      .then(res => {
        setUser(res.data)
        // setAvatar(res.data.avatar)
      })
      .catch(err => {
        console.log(err)
      })
  }
  const logout = async () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return <div className={s.user}>
    <div className={s.head}>
      <div className={s.info}>
        <span>昵称：{user?.username || '--'}</span>
        <span>
          <img style={{ width: 30, height: 30, verticalAlign: '-10px' }} src="//s.yezgea02.com/1615973630132/geqian.png" alt="" />
          <b><b>{user.signature || '暂无个签'}</b></b>
        </span>
      </div>
      <img className={s.avatar} style={{ width: 60, height: 60, borderRadius: 8 }} src={user.avatar || ''} alt="" />
    </div>
    <div className={s.content}>
      <List>
        <List.Item
          hasArrow
          title="用户信息修改"
          onClick={() => navigate('/userinfo')}
          icon={<img style={{ width: 20, verticalAlign: '-7px' }} src="//s.yezgea02.com/1615974766264/gxqm.png" alt="" />}
        />
        <List.Item
          hasArrow
          title="重制密码"
          onClick={() => navigate('/account')}
          icon={<img style={{ width: 20, verticalAlign: '-7px' }} src="//s.yezgea02.com/1615974766264/zhaq.png" alt="" />}
        />
        <List.Item
          hasArrow
          title="关于我们"
          onClick={() => navigate('/about')}
          icon={<img style={{ width: 20, verticalAlign: '-7px' }} src="//s.yezgea02.com/1615975178434/lianxi.png" alt="" />}
        />
      </List>
    </div>
    <Button className={s.logout} block theme="danger" onClick={logout}>退出登录</Button>
  </div>
}

export default User