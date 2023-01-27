import { defineStore } from 'pinia'
import axios from 'axios'

export const useUserStore = defineStore('users', {
  state: () => ({
    users: [],
    activeUser: {}
  }),
  actions: {
    async fetchUser () {
      const response = await axios
        .get('http://localhost:3000/users')
        .then(response => {
          this.users = response.data
        })
        .catch(err => {
          // console.log(err)
        })
      return response
    },
    async adduser (payload) {
      const response = await axios
        .post('http://localhost:3000/users', payload)
        .then(() => {
          this.users.push({
            ...payload
          })
        })
        .catch(err => {
          console.log(err)
        })
      return response
    },
    async updateUser (payload, id) {
      const response = await axios
        .put('http://localhost:3000/users/' + id, payload)
        .then(() => {
          var index = this.users.findIndex(obj => obj.id == this.editID)
          this.users.splice(index, 1, payload)
        })
        .catch(err => {
          // console.log(err)
        })
      return response
    },
    async deleteUser (id) {
      const response = await axios
        .delete(`http://localhost:3000/users/${id}`)
        .then(() => {
          this.users = this.users.filter(UsersList => UsersList.id !== id)
        })
        .catch(err => {
          throw err.message
        })
      return response
    },
    async userLogin (activeUser) {
      this.activeUser = activeUser
    }
  }
})
