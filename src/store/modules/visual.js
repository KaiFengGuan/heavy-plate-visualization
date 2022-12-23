const state = {
  curMonth: '2021-03-01',
  dateRange: ['2021-03-25', '2021-03-31'],    // 通过日历组件选中的月份范围
  overviewData: [],   // 总览的钢板数据
  selectedData: [],   // 从overview视图选中的钢板，做规格分布视图展示用
  plateParams: {      // 同规格筛选数据, -1是初始值
    tgtdischargetemp: [-1, -1],
    tgtplatelength2: [-1, -1],
    tgtthickness: [-1, -1],
    tgttmplatetemp: [-1, -1],
    tgtwidth: [-1, -1]
  }
}

const mutations = {
  CHANGE_MONTH: (state, month) => {
    state.curMonth = month;
  },
  SELECT_DATE_RANGE: (state, range) => {
    state.dateRange = [...range];
  },
  SAVE_OVERVIEW_DATA: (state, dataList) => {
    state.overviewData = dataList;
  },
  SET_PLATE_PARAMS: (state, params) => {
    state.plateParams = { ...params };
  },
  RESET_PLATE_PARAMS: (state) => {
    state.plateParams = {
      tgtdischargetemp: [-1, -1],
      tgtplatelength2: [-1, -1],
      tgtthickness: [-1, -1],
      tgttmplatetemp: [-1, -1],
      tgtwidth: [-1, -1]
    };
  },
  SAVE_SELECTED_DATA: (state, dataList) => {
    state.selectedData = dataList;
  },
}

const actions = {
  changeMonth({ commit }, month) {
    commit('CHANGE_MONTH', month);
  },
  selectDateRange({ commit }, range) {
    commit('SELECT_DATE_RANGE', range);
  },
  saveOverviewData({ commit }, dataList) {
    commit('SAVE_OVERVIEW_DATA', dataList);
  },
  setPlateParams({ commit }, params) {
    commit('SET_PLATE_PARAMS', params);
  },
  resetPlateParams({ commit }) {
    commit('RESET_PLATE_PARAMS');
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
