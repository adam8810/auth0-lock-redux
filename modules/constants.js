const PREFIX = '@@auth0Lock'

// auth0Lock constants keys
const KEYS = [
  'INITIALIZE',
  'AUTHENTICATE',
  'PROFILE',
  'PROFILE_ERROR',
  'REVOKED',
  'CHECK'
]

// Auth0Lock Events
export const events = [
  'show',
  'hide',
  'unrecoverable_error',
  'authenticated',
  'authorization_error',
  'hash_parsed'
]

// Inject Auth0Lock Events into constants and uppercase all
const MERGED = KEYS.concat(events).map(key => key.toUpperCase())

/**
 * Reduce into object using merged keys as keys and prefixed keys as values
 * @type {object}
 * @example
 *  {
 *    AUTHENTICATE: '@@auth0Lock/AUTHENTICATE',
 *    REVOKED: '@@auth0Lock/REVOKED',
 *    ...
 *  }
 */
const CONSTANTS = MERGED.reduce((CONSTANTS, CONSTANT) => {
  CONSTANTS[CONSTANT] = `${PREFIX}/${CONSTANT}`
  // Push each into top of module exports
  module.exports[CONSTANT] = `${PREFIX}/${CONSTANT}`
  return CONSTANTS
}, {})

export default CONSTANTS
