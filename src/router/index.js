import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

/* Layout */
import Layout from '@/layout'

/* Router Modules */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  // {
  //   path: '/',
  //   // component: () => import('@/view/login/index'),
  //   redirect: '/login',
  //   hidden: true
  // },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  }
];

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'home',
        component: () => import('@/views/home/index'),
        meta: { title: '主页', icon: 'home' }
      }
    ]
  },
  {
    path: '/data-overview',
    name: 'data-overview',
    component: Layout,
    redirect: '/data-overview/key-indicators',
    meta: { title: '数据概览', icon: 'arco-dashboard' },
    children: [
      {
        path: 'key-indicators',
        name: 'key-indicators',
        component: () => import('@/views/key-indicators/index'),
        meta: { title: '关键指标', icon: 'key' }
      },
      {
        path: 'heating-process',
        name: 'heating-process',
        component: () => import('@/views/heating-process/index'),
        meta: { title: '加热工序', icon: 'heating' }
      },
      {
        path: 'rolling-process',
        name: 'rolling-process',
        component: () => import('@/views/rolling-process/index'),
        meta: { title: '轧制工序', icon: 'industrial' }
      },
      {
        path: 'cooling-process',
        name: 'cooling-process',
        component: () => import('@/views/cooling-process/index'),
        meta: { title: '冷却工序', icon: 'cooling' }
      },
      {
        path: 'FQC-process',
        name: 'FQC-process',
        component: () => import('@/views/FQC-process/index'),
        meta: { title: '质量检查', icon: 'quality' }
      }
    ]
  },
  {
    path: '/data-analysis',
    name: 'data-analysis',
    component: Layout,
    redirect: '/data-analysis/heating-analysis',
    meta: { title: '数据分析', icon: 'computer' },
    children: [
      {
        path: 'heating-analysis',
        name: 'heating-analysis',
        component: () => import('@/views/heating-analysis/index'),
        meta: { title: '加热工序', icon: 'heating' }
      },
      {
        path: 'rolling-analysis',
        name: 'rolling-analysis',
        component: () => import('@/views/rolling-analysis/index'),
        meta: { title: '轧制工序', icon: 'industrial' }
      },
      {
        path: 'cooling-analysis',
        name: 'cooling-analysis',
        component: () => import('@/views/cooling-analysis/index'),
        meta: { title: '冷却工序', icon: 'cooling' }
      }
    ]
  },
  {
    path: '/monitoring',
    name: 'monitoring',
    component: Layout,
    redirect: '/monitoring/visualization',
    meta: { title: '全流程监控', icon: 'monitor' },
    children: [
      {
        path: 'visualization',
        name: 'visualization',
        component: () => import('@/views/visualization/index'),
        meta: { title: '可视分析', icon: 'monitor' }
      }
    ]
  },
  {
    path: '/administrator',
    name: 'administrator',
    component: Layout,
    redirect: '/administrator/user',
    meta: { title: '系统管理', icon: 'arco-setting' },
    children: [
      {
        path: 'user',
        name: 'user',
        component: () => import('@/views/user/index'),
        meta: { title: '用户管理', icon: 'user_1' }
      },
      {
        path: 'role',
        name: 'role',
        component: () => import('@/views/role/index'),
        meta: { title: '角色管理', icon: 'user_admin' }
      },
      {
        path: 'permission',
        name: 'permission',
        component: () => import('@/views/permission/index'),
        meta: { title: '权限管理', icon: 'quanxian' }
      }
    ]
  }
];

const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: [...constantRoutes, ...asyncRoutes] // 先这样写
});

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
