import CONSTANTS from './constants'

const auth0LockReduxReducer = (state = null, action) => {
  switch(action.type) {
    case CONSTANTS['REVOKED']: return null
    case CONSTANTS['PROFILE']: return { ...state, ...action.payload }
    default: return state
  }
}

export default auth0LockReduxReducer
