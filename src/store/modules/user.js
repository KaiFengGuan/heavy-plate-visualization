import { login } from '@/api/user';

const state = {
  loginId: 1,
  loginName: '',
  loginUserId: '',
  isLogin: false,
  loginAuth: {
      menus: [],
      views: []
  },
  loginToken: ''
};

const mutations = {
  LOGIN: (state, data) => {
    
  }
};

const actions = {
  login({ commit }, userInfo) {
    const { username, password } = userInfo;
    return new Promise((resolve, reject) => {
      login({ user: username.trim(), psw: password })
        .then(res => {
          const { data } = res;
          if (res.code === 0) {
            if (data.auth.menus.length > 0) {
              // myVue.$router.addRoutes(getRouterMap(res.data.auth.menus))
              // window.localStorage.setItem('loginLogo', res.data.logo)
              commit('LOGIN', data);
              resolve();
            }
          } else {
            reject('用户名或密码错误')
          }
        })
        .catch(err => {
          reject(err);
        })
    })
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
