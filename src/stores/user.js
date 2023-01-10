import { defineStore } from 'pinia'
import axios from 'axios'

export const useUserStore = defineStore('users', {
  state: () => ({
    users: []
  }),
  actions: {
    async fetchUser() {
      try {
        await axios.get('http://localhost:3000/users').then(response => {
          this.users = response.data
        })
      } catch (err) {
        console.log(err)
      }
    },
    async adduser (payload) {
      try {
        await axios.post('http://localhost:3000/users', payload).then(() => {
          this.users.push({
            ...payload
          })
        })
      } catch (err) {
        console.log(err)
      }
    },
    async updateUser(payload, id) {
      try {
        await axios
          .put('http://localhost:3000/users/' + id, payload)
          .then(() => {
            var index = this.users.findIndex(obj => obj.id == this.editID)
            this.users.splice(index, 1, payload)
          })
      } catch (err) {
        console.log(err)
      }
    },
    async deleteUser (id) {
      try {
        await axios.delete(`http://localhost:3000/users/${id}`).then(() => {
          this.users = this.users.filter(UsersList => UsersList.id !== id)
        })
      } catch (err) {
        console.log(err)
      }
    }
  }
})
