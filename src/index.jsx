import React from 'react'
import { render } from 'react-dom'
import 'antd/dist/antd.css'
import { Layout, Menu } from 'antd'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import { AppstoreOutlined } from '@ant-design/icons'

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
    console.log('menu click ', e)
  }

  subMenu(menus) {
    console.log(menus)
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

function Home() {
  return <h2>Home Page</h2>
}

function About1() {
  return <h2>About Page 1</h2>
}

function About2() {
  return <h2>About Page 2</h2>
}

function About3() {
  return <h2>About Page 3</h2>
}

function Routes() {
  return (
    <Switch>
      {/* exact 精确匹配 https://reactrouter.com/web/api/Route/exact-bool */}
      <Route path="/" exact={true} component={Home} />
      <Route path="/about1" exact={true} component={About1} />
      <Route path="/about2" exact={true} component={About2} />
      <Route path="/about3" exact={true} component={About3} />
    </Switch>
  )
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

document.addEventListener('DOMContentLoaded', () =>
  render(<Root />, document.getElementById('root')),
)
