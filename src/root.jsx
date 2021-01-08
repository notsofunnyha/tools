import React from 'react'
import 'antd/dist/antd.css'
import { Layout, Menu } from 'antd'
import { BrowserRouter as Router, Link } from 'react-router-dom'
import { AppstoreOutlined } from '@ant-design/icons'
import './global.scss'
import Routes from './routes'
import { path as menus } from './menu'

const { Content } = Layout
const { SubMenu } = Menu

function Sider() {
  const handleClick = (e) => {
    // console.log('menu click ', e)
  }

  const subMenu = (menus) => {
    // console.log(menus)
    return menus.map((menu) =>
      menu.children ? (
        <SubMenu key={menu.name} icon={<AppstoreOutlined />} title={menu.name}>
          {subMenu(menu.children)}
        </SubMenu>
      ) : (
        <Menu.Item key={menu.name} icon={<AppstoreOutlined />}>
          <Link to={menu.path}>{menu.name}</Link>
        </Menu.Item>
      ),
    )
  }

  return (
    <Menu
      onClick={handleClick}
      mode="inline"
      theme="dark"
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        width: 256,
      }}
    >
      {subMenu(menus)}
    </Menu>
  )
}

const Root = () => (
  <Router>
    <Layout>
      <Sider />
      <Layout style={{ marginLeft: 256, height: '100vh', background: '#fff' }}>
        <Content style={{ borderTop: '1px solid #ddd' }}>
          <Content style={{ padding: 10, overflow: 'auto', height: '100%' }}>
            <Routes />
          </Content>
        </Content>
      </Layout>
    </Layout>
  </Router>
)

export default Root
