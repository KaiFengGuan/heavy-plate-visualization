const getter = {
  permission_routes: state => state.permission.routes,
  sidebar: state => state.app.sidebarCollapse,
  avatar: state => state.user.avatar,
  curMonth: state => state.visual.curMonth,
}

export default getter;
