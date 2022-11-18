module.exports = [
  // user login
  {
    url: '/nodeApi/v1.0/user/login',
    type: 'post',
    response: {
      "code": 0,
      "msg": "ok",
      "data": {
        "id": "52837fe0-0aa6-11ea-aa08-cded4343cbb4",
        "name": "liucheng613",
        "token": null,
        "logo": null,
        "auth": {
          "menus": [
            "/furnace",
            "/rolling",
            "/cooling",
            "/visual",
            "/reportForm",
            "/coolForm",
            "/user",
            "/role",
            "/monitor",
            "/record",
            "/rollForm",
            "/auth"
          ],
          "views": []
        }
      }
    }
  },

  // // get user info
  // {
  //   url: '/vue-element-admin/user/info\.*',
  //   type: 'get',
  //   response: config => {
  //     const { token } = config.query
  //     const info = users[token]

  //     // mock error
  //     if (!info) {
  //       return {
  //         code: 50008,
  //         message: 'Login failed, unable to get user details.'
  //       }
  //     }

  //     return {
  //       code: 20000,
  //       data: info
  //     }
  //   }
  // },

  // // user logout
  // {
  //   url: '/vue-element-admin/user/logout',
  //   type: 'post',
  //   response: _ => {
  //     return {
  //       code: 20000,
  //       data: 'success'
  //     }
  //   }
  // }
]
