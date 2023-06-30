import createDataContext from './createDataContext';

const userReducer = (state, action) => {
  switch (action.type) {
    case 'set_global_user':
      return {...state, user: action.payload};
    case 'set_global_token':
      return {...state, userToken: action.payload};
    default:
      return state;
  }
};

const setGlobalUser = dispatch => async user => {
  dispatch({type: 'set_global_user', payload: user});
};

const setGlobalToken = dispatch => async token => {
  dispatch({type: 'set_global_token', payload: token});
};

export const {Context, Provider} = createDataContext(
  userReducer,
  {setGlobalUser, setGlobalToken},
  {
    user: null,
    userToken: null,
  },
);
