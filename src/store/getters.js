const getter = {
  permission_routes: state => state.permission.routes,
  sidebar: state => state.app.sidebarCollapse,
  avatar: state => state.user.avatar,
  curMonth: state => state.visual.curMonth,
  dateRange: state => state.visual.dateRange,
  selectedData: state => state.visual.selectedData,
}

export default getter;
