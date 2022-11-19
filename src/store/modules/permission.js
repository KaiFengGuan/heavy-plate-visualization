import { constantRoutes, asyncRoutes } from '@/router';

const state = {
  routes: constantRoutes.concat(asyncRoutes),  // 这里临时写的
  addRoutes: []
}

const mutations = {

}

const actions = {

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

