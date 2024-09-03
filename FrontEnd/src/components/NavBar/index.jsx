import { useState } from "react";
import PropTypes from "prop-types";
import { TabBar } from "zarm";
import { useNavigate, useLocation } from 'react-router-dom'
import './tabNav.less'
import CustomIcon from '../CustomIcon';
import { useEffect } from "react";


const NavBar = ({ showNav }) => {
  console.log('showNav',showNav.toString())
  const [activeKey, setActiveKey] = useState('/');
  const navigate = useNavigate()
  const location = useLocation()

  const changeTab = (path) => {
    setActiveKey(path);
    navigate(path)
  }

  useEffect(() => {
    setActiveKey(location.pathname)
  },[])

  return (
    showNav ?
    <TabBar className="tab-nav" activeKey={activeKey} onChange={changeTab}>
      <TabBar.Item title="账单" itemKey="/" icon={<CustomIcon type="bill" />} />
      <TabBar.Item title="统计" itemKey="/data" icon={<CustomIcon type="statistics" />} />
      <TabBar.Item title="我的" itemKey="/user" icon={<CustomIcon type="user" />} />
    </TabBar> : null
  )
}
NavBar.propTypes = {
  showNav: PropTypes.bool,
}

export default NavBar