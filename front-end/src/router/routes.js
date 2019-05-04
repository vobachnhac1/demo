export default [
  {
    path: '*',
    redirect: {
      path: '/404'
    }
  },
  {
    path: '/401',
    meta: {
      code: 401,
      title: 'Unauthorized'
    },
    name: 'Unauthorized',
    component: () => import('modules/authentication/error-page')
  },
  {
    path: '/403',
    meta: {
      code: 403,
      title: 'Access Denied'
    },
    name: 'AccessDenied',
    component: () => import('modules/authentication/error-page')
  },
  {
    path: '/404',
    meta: {
      code: 404,
      title: 'Not Found'
    },
    name: 'NotFound',
    component: () => import('modules/authentication/error-page')
  },
  {
    path: '/500',
    meta: {
      code: 500,
      title: 'Internal Error Server'
    },
    name: 'ServerError',
    component: () => import('modules/authentication/error-page')
  },
  {
    path: '/login',
    meta: {
      title: 'Login page'
    },
    name: 'Login',
    component: () => import('modules/authentication')
  },
  {
    path: '/',
    meta: {
      title: 'menu.dashboard',
      requiresAuth: true,
      menu: true,
      icon: 'home'
    },
    name: 'Dashboard',
    component: () => import('modules/dashboard')
  },
  //Start Menu DC Stage
  {
    path: '/dc-stage',
    redirect: {
      path: '/dc-stage/black-list'
    },
    meta: {
      title: 'DC Stage',
      menu: true,
      super: true,
      group: 'dc-stage',
      icon: 'data_usage'
    }
  },
  {
    path: '/dc-stage/black-list',
    meta: {
      title: 'Black List',
      requiresAuth: true,
      menu: true,
      group: 'dc-stage'
    },
    name: 'black-list',
    component: () => import('components/modules/dc-stage/black_list.vue')
  },
  {
    path: '/dc-stage/dedupe-dc',
    meta: {
      title: 'Dedupe ID',
      requiresAuth: true,
      menu: true,
      group: 'dc-stage'
    },
    name: 'dedupe-dc',
    component: () => import('components/modules/dc-stage/dedupe.vue')
  },
  {
    path: '/dc-stage/dc-cl',
    meta: {
      title: 'DC CL - Not Yet',
      requiresAuth: true,
      menu: true,
      group: 'dc-stage'
    },
    name: 'dc-cl',
    component: () => import('components/modules/dc-stage/dc_cl.vue')
  },
  //End Start Menu DC Stage

  //Start Menu PHV Stage
  {
    path: '/phv-stage',
    redirect: {
      path: '/phv-stage/dc_cl'
    },
    meta: {
      title: 'PHV Stage',
      menu: true,
      super: true,
      group: 'phv-stage',
      icon: 'contact_phone'
    }
  },
  {
    path: '/phv-stage/dedupe-phv',
    meta: {
      title: 'Dedupe ID',
      requiresAuth: true,
      menu: true,
      group: 'phv-stage'
    },
    name: 'dedupe-phv',
    component: () => import('components/modules/phv-stage/dedupe.vue')
  },
  {
    path: '/phv-stage/dc-cl-phv',
    meta: {
      title: 'DC CL - Not Yet',
      requiresAuth: true,
      menu: true,
      group: 'phv-stage'
    },
    name: 'dc-cl-phv',
    component: () => import('components/modules/phv-stage/dc_cl.vue')
  },

  {
    path: '/phv-stage/dedupe-mobile-phv',
    meta: {
      title: 'Dedupe Mobile',
      requiresAuth: true,
      menu: true,
      group: 'phv-stage'
    },
    name: 'dedupe-mobile-phv',
    component: () => import('components/modules/phv-stage/dedupe_mobile.vue')
  },
  {
    path: '/phv-stage/phv-cl',
    meta: {
      title: 'PHV CL - Not Yet',
      requiresAuth: true,
      menu: true,
      group: 'phv-stage'
    },
    name: 'phv-cl',
    component: () => import('components/modules/phv-stage/phv_cl.vue')
  },
  //End Start Menu PHV Stage

  //Start Menu UND Stage
  {
    path: '/und-stage',
    redirect: {
      path: '/und-stage/black-list'
    },
    meta: {
      title: 'UND Stage',
      menu: true,
      super: true,
      group: 'und-stage',
      icon: 'assignment_ind'
    }
  },
  {
    path: '/und-stage/dedupe-und',
    meta: {
      title: 'Dedupe ID',
      requiresAuth: true,
      menu: true,
      group: 'und-stage'
    },
    name: 'dedupe-und',
    component: () => import('components/modules/und-stage/dedupe.vue')
  },
  {
    path: '/und-stage/dc-cl-und',
    meta: {
      title: 'DC CL - Not Yet',
      requiresAuth: true,
      menu: true,
      group: 'und-stage'
    },
    name: 'dc-cl-und',
    component: () => import('components/modules/und-stage/dc_cl.vue')
  },
  {
    path: '/und-stage/dedupe-mobile-und',
    meta: {
      title: 'Dedupe Mobile',
      requiresAuth: true,
      menu: true,
      group: 'und-stage'
    },
    name: 'dedupe-mobile-und',
    component: () => import('components/modules/und-stage/dedupe_mobile.vue')
  },
  {
    path: '/und-stage/phv-cl-und',
    meta: {
      title: 'PHV CL - Not Yet',
      requiresAuth: true,
      menu: true,
      group: 'und-stage'
    },
    name: 'phv-cl-und',
    component: () => import('components/modules/und-stage/phv_cl.vue')
  },
  {
    path: '/und-stage/und-cl',
    meta: {
      title: 'UND CL - Not Yet',
      requiresAuth: true,
      menu: true,
      group: 'und-stage'
    },
    name: 'und-cl',
    component: () => import('components/modules/und-stage/und_cl.vue')
  }
  //End Start Menu UND Stage
];
