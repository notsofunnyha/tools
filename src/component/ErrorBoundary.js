/* eslint-disable react/prop-types */
import React from 'react'

/**注意
 *
 * getDerivedStateFromError() 会在渲染阶段调用，因此不允许出现副作用。
 * 如遇此类情况，请改用 componentDidCatch()。
 */

/**注意
 *
 * 如果发生错误，你可以通过调用 setState 使用 componentDidCatch() 渲染降级 UI，
 * 但在未来的版本中将不推荐这样做。 可以使用静态 getDerivedStateFromError() 来处理降级渲染。
 */

const key = 'ErrorBoundary_tag'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    // this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    console.log('getDerivedStateFromError', error)
    localStorage.setItem(key, true)

    // 更新 state 使下一次渲染能够显示降级后的 UI
    // 这里更新 state 只是为了渲染, state.hasError 值未使用
    return {}
  }

  // componentDidCatch(error, errorInfo) {
  //   // console.log('componentDidCatch')
  //   // 你同样可以将错误日志上报给服务器
  //   // logErrorToMyService(error, errorInfo);
  //   console.log('componentDidCatch', error, errorInfo)
  // }

  render() {
    console.log('ErrorBoundary UI', this.props.children)
    const hasError = eval(localStorage.getItem(key))
    // console.log(hasError, this.state.hasError)
    if (hasError) {
      localStorage.setItem(key, false)
      return <h1>Something went wrong.</h1>
    }
    return this.props.children
  }
}
