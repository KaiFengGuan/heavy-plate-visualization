const state = {
  curMonth: '2021-03-01',
  dateRange: ['2021-03-25', '2021-03-31'],    // 通过日历组件选中的月份范围
  selectedData: [],   // 选中的钢板数据，全局保存
}

const mutations = {
  CHANGE_MONTH: (state, month) => {
    console.log('in mutation: ', month);
    state.curMonth = month;
  },
  SELECT_DATE_RANGE: (state, range) => {
    console.log('select date range: ', range);
    state.dateRange = [...range];
  },
  SAVE_SELECTED_DATA: (state, dataList) => {
    console.log('in save_selected_data: ', dataList);
    state.selectedData = dataList;
  }
}

const actions = {
  changeMonth({ commit }, month) {
    commit('CHANGE_MONTH', month);
  },
  selectDateRange({ commit }, range) {
    commit('SELECT_DATE_RANGE', range);
  },
  saveSelectedData({ commit }, dataList) {
    commit('SAVE_SELECTED_DATA', dataList);
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
