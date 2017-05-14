import Auth0Lock from 'auth0-lock'
import CONSTANTS, { events } from './constants'
import ACTIONS from './actions'

const auth0LockReduxMiddleware = (config) => {
  let auth0Lock
  if(config instanceof Auth0Lock) {
    auth0Lock = config
  } else {
    auth0Lock = new Auth0Lock(config.key, config.domain, config.options)
  }
  const middleware = store => next => action => {
    const dispatch = store.dispatch
    events.forEach(event => {
      const EVENT = event.toUpperCase()
      const ACTION = CONSTANTS[EVENT]
      if(auth0Lock.listenerCount(event) === 0) {
        const action = ACTIONS[ACTION]
        const handler = (...args) => dispatch(action(...args))
        auth0Lock.on(event, handler)
        if(event === 'authenticated') {
          auth0Lock.on(event, (auth) => {
            auth0Lock.getUserInfo(auth.accessToken, (err, profile) => {
              if(err) {
                dispatch(ACTIONS[CONSTANTS['PROFILE_ERROR']](err))
              } else {
                const payload = { ...profile, auth }
                dispatch(ACTIONS[CONSTANTS['PROFILE']](payload))
              }
            })
          })
        }
      }
    })
    if(action.meta && action.meta === CONSTANTS['AUTHENTICATE']) {
      auth0Lock.show()
      dispatch(ACTIONS[CONSTANTS['AUTHENTICATE']]())
    } else {
      return next(action)
    }
  }
  return middleware
}

export default auth0LockReduxMiddleware
