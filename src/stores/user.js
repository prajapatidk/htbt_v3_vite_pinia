import { defineStore } from 'pinia'
import axios from 'axios'
import { avoidHeader } from '@/utils/constant'

export const useUserStore = defineStore('users', {
  state: () => ({
    users: [],
    activeUserDetail: {}
  }),
  actions: {
    async fetchUser () {
      const response = await axios.get('user')
      if (response) {
        this.users = response.data
      }
      return response
    },

    async addUser (payload) {
      const response = await axios.post('register', payload, avoidHeader)
      if (response) {
        this.fetchUser()
      }
      return response
    },

    async updateUser (payload, id) {
      const response = await axios.put('user/' + id, payload)
      if (response) {
        this.fetchUser()
      }
      return response
    },

    async deleteUser (id) {
      const response = await axios.delete(`user/${id}`)
      if (response) {
        this.fetchUser()
      }
      return response
    },

    async activeUser () {
      const response = await axios.get('userloggedin')
      this.activeUserDetail = response.data
      return response
    }
  }
})
