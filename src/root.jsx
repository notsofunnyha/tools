import React from 'react'
import 'antd/dist/antd.css'
import { Layout, Menu } from 'antd'
import { BrowserRouter as Router, Link } from 'react-router-dom'
import { AppstoreOutlined } from '@ant-design/icons'
import { hot } from 'react-hot-loader/root'

import Routes from './routes'

const { Content } = Layout
const { SubMenu } = Menu

const menus = [
  {
    name: 'Home',
    path: '/',
  },
  {
    name: 'About',
    children: [
      { name: 'About1', path: '/about1' },
      {
        name: 'About2',
        children: [
          { name: 'About2', path: '/about2' },
          { name: 'About3', path: '/about3' },
        ],
      },
    ],
  },
]

class Sider extends React.Component {
  handleClick(e) {
    // console.log('menu click ', e)
  }

  subMenu(menus) {
    // console.log(menus)
    return menus.map((menu) =>
      menu.children ? (
        <SubMenu key={menu.name} icon={<AppstoreOutlined />} title={menu.name}>
          {this.subMenu(menu.children)}
        </SubMenu>
      ) : (
        <Menu.Item key={menu.name} icon={<AppstoreOutlined />}>
          <Link to={menu.path}>{menu.name}</Link>
        </Menu.Item>
      ),
    )
  }

  render() {
    return (
      <Menu
        onClick={this.handleClick}
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
        {this.subMenu(menus)}
      </Menu>
    )
  }
}

const Root = () => (
  <Router>
    <Layout>
      <Sider />
      <Layout style={{ marginLeft: 256, height: '100vh' }}>
        <Content style={{ margin: '24px 16px 0', overflow: 'auto' }}>
          <div style={{ padding: 24 }}>
            <Routes />
          </div>
        </Content>
      </Layout>
    </Layout>
  </Router>
)

export default hot(Root)
