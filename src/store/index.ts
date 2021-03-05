import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  // 容器的状态实现了数据共享，在组件里访问比较方便
  state: {
    user: JSON.parse(window.localStorage.getItem('user') || 'null') // 当前登录用户状态
  },
  mutations: {
    // 修改容器数据必须使用mutation函数
    setUser (state, payload) {
      state.user = JSON.parse(payload)
      // 为了防止页面刷新数据丢失，我们需要把user数据持久化
      // 注意: 本地存储只能存字符串
      window.localStorage.setItem('user', payload)
    }
  },
  actions: {

  },
  modules: {

  }
})
