import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 所有列表项
    list: [],
    // 文本框的内容
    inputValue: 'aaa',
    // 定义一个id值
    nextId: 5,
    // 视图key值
    viewKey: 'all'
  },
  mutations: {
    initList(state, list) {
      state.list = list
    },
    // 为store中的inputValue赋值
    inputValueAdd(state, val) {
      state.inputValue = val
    },
    // 添加列表项
    addItem(state) {
      // 定义一个对象
      const obj = {
        id: state.nextId,
        // 文本框输入内容
        info: state.inputValue,
        done: false
      }
      state.list.push(obj)
      state.nextId++
      state.inputValue = ''
    },
    // 删除指定的一项
    removeItem(state, id) {
      // 根据传过来的id查找对应项的索引
      const index = state.list.findIndex(item => item.id === id)
      // 根据索引删除指定的元素
      if (index !== -1) {
        state.list.splice(index, 1)
      }
    },
    // 修改列表项的选中状态
    changeStatus(state, param) {
      // 根据传过来的id查找到对应项的索引
      const i = state.list.findIndex(x => x.id === param.id)
      if (i !== -1) {
        // 第几个的状态修改
        state.list[i].done = param.status
      }
    },
    // 清除已完成
    clearDone(state) {
      // 过滤list中未完成的任务，并且重新赋值给list
      state.list = state.list.filter(item => item.done === false)
    },
    changeView(state, key) {
      state.viewKey = key
    }
  },
  actions: {
    async getList(context) {
      const { data } = await axios.get('/list.json')
      // console.log(data)
      context.commit('initList', data)
    }
  },
  getters: {
    // 未完成的的任务的条数
    unDoneList(state) {
      // 过滤state中的list中done等于false，结果是一个新数组，最后返这个数组的长度
      return state.list.filter(item => item.done === false).length
    },
    infoList(state) {
      if (state.viewKey === 'all') {
        return state.list
      } else if (state.viewKey === 'undone') {
        return state.list.filter(item => item.done === false)
      }
      if (state.viewKey === 'done') {
        return state.list.filter(item => item.done === true)
      }
      return state.list
    }
  }
})
