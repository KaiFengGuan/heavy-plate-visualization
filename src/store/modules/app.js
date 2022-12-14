const state = {
  sidebarCollapse: true    // false: 不折叠
}

const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebarCollapse = !state.sidebarCollapse;
  }
}

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
