import { useEffect, useState } from 'react';
import { Button, FilePicker, Input, Toast } from 'zarm';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import axios from '@/utils/axios';
import { imgUrlTrans } from '@/utils'
import s from './style.module.less';

const UserInfo = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState({}); // 用户
  const [avatar, setAvatar] = useState(''); // 头像
  const [signature, setSignature] = useState(''); // 个签
  const token = localStorage.getItem('token'); // 登录令牌

  useEffect(() => {
    getUserInfo();
  }, [])

  const getUserInfo = async () => {
    axios.get('/user/get_userinfo').then(res => {
      setUser(res.data)
      setAvatar(imgUrlTrans(res.data.avatar))
      setSignature(res.data.signature)
    }).catch(err => {
      console.log(err)
    })
  }
  const handleSelect = (file) => {
    console.log('file', file)
    if (file && file.file.size > 200 * 1024) {
      Toast.show('上传头像不得超过 200 KB！！')
      return
    }
    let formData = new FormData()
    formData.append('file', file.file)
    axios({
      method: 'post',
      url: '/upload',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': token
      }
    }).then(res => {
      setAvatar(imgUrlTrans(`http://127.0.0.1:7001${res.data}`))
    })

    
  }
  const save = async () => {
    axios.post('/user/update_userInfo', {
      signature,
      avatar
    }).then(res => {
      Toast.show('修改成功')
      navigate(-1)
    }).catch(err => {
      console.log(err)
    })
  }
  
  return (
    <>
      <Header title='用户信息' />
      <div className={s.userinfo}>
        <h1>个人资料</h1>
        <div className={s.item}>
          <div className={s.title}>头像</div>
          <div className={s.avatar}>
            <img className={s.avatarUrl} src={avatar} alt="" />
            <div className={s.desc}>
              <span>支持 jpg、png、jpeg 格式大小 200KB 以内的图片</span>
              <FilePicker className={s.filePicker} onChange={handleSelect} accept="image/*">
                <Button className={s.upload} theme='primary' size='xs'>点击上传</Button>
              </FilePicker>
            </div>
          </div>
        </div>
        <div className={s.item}>
          <div className={s.title}>个性签名</div>
          <div className={s.signature}>
            <Input
              clearable
              type="text"
              value={signature}
              placeholder="请输入个性签名"
              onChange={(e) => setSignature(e.target.value)}
            />
          </div>
        </div>
        <Button onClick={save} style={{ marginTop: 50 }} block theme='primary'>保存</Button>
      </div>
    </>
  )
};

export default UserInfo