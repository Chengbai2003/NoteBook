import { useState } from 'react';
import { List, Input, Button, Checkbox, Toast } from 'zarm'
import 'zarm/dist/zarm.min.css';
import CustomIcon from '@/components/CustomIcon'
import s from "./style.module.less";
import axios from '@/utils/axios'
import cx from 'classnames'
import { useNavigate } from 'react-router-dom'


const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [agree, setAgree] = useState(false)
  const [type, setType] = useState('login');

  const navigate = useNavigate()

  const onSubmit = async () => {
    if (!username) {
      Toast.show('请输入账号')
      return
    }
    if (!password) {
      Toast.show('请输入密码')
      return
    }
    try {
      if (type == 'login') {
        // 执行登录接口，获取 token
        const { data } = await axios.post('/user/login', {
          username,
          password
        });
        // 将 token 写入 localStorage
        localStorage.setItem('token', data.token);
        window.location.href = '/'
      } else {
        if (!agree) {
          Toast.show('请同意条款')
          return
        }
        const res = await axios.post('/user/register', {
          username: username,
          password: password
        })
        if(res.code == 200) {
          Toast.show('注册成功')
          setType('login')
        } else {
          Toast.show(res.msg)
        }
      }
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className={s.auth}>
      <div className={s.head} />
      <div className={s.tab}>
        <span className={cx({ [s.active]: type == 'login'})} onClick={() => setType('login')}>登录</span>
        <span className={cx({ [s.active]: type == 'register'})} onClick={() => setType('register')}>注册</span>
      </div>
      <List className={s.form}>
        <List.Item prefix={<CustomIcon type="user" />}>
          <Input
            clearable
            type="text"
            placeholder="请输入账号"
            onChange={e => setUsername(e.target.value)}
          />
        </List.Item>
        <List.Item prefix={<CustomIcon type="password " />}>
          <Input
            clearable
            type="password"
            placeholder="请输入密码"
            onChange={e => setPassword(e.target.value)}
          />
        </List.Item>
      </List>
      <div className={s.operation}>
        {
          type == 'register' ? <div className={s.agree}>
          <Checkbox onChange={e => setAgree(e.target.checked)} />
          
          <label className="text-light">阅读并同意<a>《在线账单手札条款》</a></label>
        </div> : null
        }
        <Button theme="primary" block onClick={onSubmit}>{type == 'login' ? '登录' : '注册'}</Button>
      </div>
    </div>
  )
}

export default Login;