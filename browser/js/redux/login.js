import axios from 'axios';

export const SET_CURRENT = 'SET_CURRENT_USER'
export const REMOVE_CURRENT = 'REMOVE_CURRENT_USER'

const setCurrent = user => ({type: SET_CURRENT, user: user})
const removeCurrent = () => ({type: REMOVE_CURRENT})

export default function reducer (currentUser = {}, action) {

  switch (action.type) {

    case SET_CURRENT:
      currentUser = action.user
      return currentUser

    case REMOVE_CURRENT:
      currentUser = {}
      return currentUser

    default:
      return currentUser

  }

}

export const setCurrentUser = (credentials) => dispatch => {
  axios.post('/login', credentials)
        .then(res => {
          dispatch(setCurrent(res.data))
        })
        .catch(console.error)
}

export const removeCurrentUser = () => dispatch => {
  axios.get('/login/logout')
        .then(() => {
          dispatch(removeCurrent())
        })
        .catch(console.error)
}
