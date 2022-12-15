const state = {
  curMonth: '2021-03-01'
}

const mutations = {
  CHANGE_MONTH: (state, month) => {
    console.log('in mutation: ', month);
    state.curMonth = month;
  }
}

const actions = {
  changeMonth({ commit }, month) {
    commit('CHANGE_MONTH', month);
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
