export const getAccessToken = state => {
  return state.access_token;
};

export const getLastAccess = state => {
  return state.token_last_access;
};

export const getExpiredIn = state => {
  return state.expired_in;
};

export const authUser = state => {
  return state.account == null ? { username: 'anonymous' } : state.account;
};
