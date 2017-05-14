import CONSTANTS from './constants'

const ACTIONS = Object.keys(CONSTANTS).reduce((ACTIONS, CONSTANT) => {
  ACTIONS[CONSTANTS[CONSTANT]] = (payload) => {
    let error = null
    if(payload instanceof Error) {
      error = payload
    }
    return {
      type: CONSTANTS[CONSTANT],
      payload,
      error
    }
  }
  return ACTIONS
}, {})

export default ACTIONS
