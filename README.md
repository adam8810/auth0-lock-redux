# auth0-lock-redux
<!-- [![npm version](https://img.shields.io/npm/v/@apim/auth0-lock-redux.svg?style=flat-square)](https://www.npmjs.com/package/@apim/auth0-lock-redux) [![npm downloads](https://img.shields.io/npm/dm/@apim/auth0-lock-redux.svg?style=flat-square)](https://www.npmjs.com/package/@apim/auth0-lock-redux) [![build status](https://img.shields.io/travis/reactjs/@apim/auth0-lock-redux/master.svg?style=flat-square)](https://travis-ci.org/reactjs/@apim/auth0-lock-redux) -->

> Auth Lock Redux Middleware

This middleware facilitates Auth0 Lock & Redux integration.

## Installation

```
npm install --save @apim/auth0-lock-redux
```

## Features

* Use your own action to trigger authentication by passing the right meta information.
* Right after authentication, the user's profile is fetched automatically and made available for reduction. Use the bundled reducer to grab the full profile or write your own.
* Auth0 Lock first gives us an authentication payload (with the token and auth-only data) and then gives us profile data (via another call). This middleware returns both in one object by moving the auth object to be under `profile.auth`
* All Auth0 Lock events are mapped to actions. Only "authenticated" is really being used but I am planning to add more.
* Nicely formatted for `redux-logger`.
* I intentionally leave out any routing changes and localStorage. Use your own middleware to do either. Yes, I consider this a feature.

## Usage
### Middleware Setup
```javascript
import auth0LockReduxMiddleware from '@apim/auth0-lock-redux'

// Auth0 Lock key (see auth0-lock docs)
const options = {
  key: '...',
  domain: '...',
  options: {}
}

// Add it to your middleware array
const middlewares = [
  auth0LockReduxMiddleware(options)
]

// Apply as usual
applyMiddleware(...middlewares)
```
Alternatively, if you already have an instance of `auth0-lock` with your settings, pass the instance and it'll be used instead:
```javascript
import Auth0Lock from 'auth0-lock'
import auth0LockReduxMiddleware from '@apim/auth0-lock-redux'

const auth0lock = new Auth0Lock(/* key */, /* domain */, /* options */)

// Add it to your middleware array
const middlewares = [
  auth0LockReduxMiddleware(auth0lock)
]

// Apply as usual
applyMiddleware(...middlewares)
```
### Triggering Authentication
For now, the way to trigger authentication if you don't do it directly with your own instance of `auth0-lock` is to set the meta value for your action of choice to the value of the `AUTHENTICATE` constant.
```javascript
import { AUTHENTICATE } from '@apim/auth0-lock-redux'

const SIGN_IN = () => ({
  type: 'SIGN_IN',
  meta: AUTHENTICATE // Internally it looks like this: '@@auth0Lock/AUTHENTICATE'
})
```
### Reducer (optional)
Add a reducer to reduce the received user profile. You have two options:
#### Use the bundled reducer and get the full object:
```javascript
import { AUTHENTICATED, auth0LockReducer } from '@apim/auth0-lock-redux'
const reducers = combineReducers({
  user: auth0LockReducer
})
```
#### Add your own reducer to the PROFILE action:
This lets you customize the reduction. I'm using `redux-actions` in this example.
```javascript
import {
  AUTHENTICATED,
  REVOKED,
  PROFILE,
  auth0LockReducer
} from '@apim/auth0-lock-redux'

const user = handleActions({
  [REVOKED]: () => null,
  [PROFILE]: (state, action) => ({
    ...state,
    token: action.payload.auth.accessToken, // Grab only the token
    name: action.payload.name // ...and the user's name
  })
}, state.user)

```
### Reduce noise in `redux-logger`
Add a reducer to reduce the received user profile. You have two options:
```javascript
// Collapse these entries...
createLogger({
  collapsed: (getState, action) => /auth0Lock/.test(action.type)
});

// Or omit it completely...
createLogger({
  predicate: (getState, action) => !/router/.test(action.type)
});
```

### Constants
```javascript
// [TODO] Some initialization may be added in the future.
const INITIALIZE = '@@auth0Lock/INITIALIZE'

// Trigger authentication.
const AUTHENTICATE = '@@auth0Lock/AUTHENTICATE'

// When profile is received.
const PROFILE = '@@auth0Lock/PROFILE'

// When profile load fails.
const PROFILE_ERROR = '@@auth0Lock/PROFILE_ERROR'

// [TODO] Dispatched when token revoked (aka: sign out)
const REVOKED = '@@auth0Lock/REVOKED'

// [TODO] Dispatched when token is checked.
const CHECK = '@@auth0Lock/CHECK'

// Dispatched when sign in form is shown.*
const SHOW = '@@auth0Lock/SHOW'

// Dispatched when sign in form is hidden.*
const HIDE = '@@auth0Lock/HIDE'

// Dispatched when lock emits an unrecoverable_error.*
const UNRECOVERABLE_ERROR = '@@auth0Lock/UNRECOVERABLE_ERROR'

// Dispatched when token is received.*
const AUTHENTICATED = '@@auth0Lock/AUTHENTICATED'

// Dispatched when authentication fails.*
const AUTHORIZATION_ERROR = '@@auth0Lock/AUTHORIZATION_ERROR'

// Dispatched when a hash parse attempt is done.*
const HASH_PARSED = '@@auth0Lock/HASH_PARSED'
```
* Note: these are straight maddings of Auth0 Lock's own events. See their docs.
