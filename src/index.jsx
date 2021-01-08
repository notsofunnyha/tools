import React, { Fragment } from 'react'
import { render } from 'react-dom'
import { AppContainer as ReactHotAppContainer } from 'react-hot-loader'
import { hot } from 'react-hot-loader/root'
import Root from './root'

const AppContainer = process.env.PLAIN_HMR ? Fragment : ReactHotAppContainer
const RootComponent = process.env.PLAIN_HMR ? Root : hot(Root)

document.addEventListener('DOMContentLoaded', () =>
  render(
    <AppContainer>
      <RootComponent />
    </AppContainer>,
    document.getElementById('root'),
  ),
)
