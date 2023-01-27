import { defineStore } from 'pinia'
import axios from 'axios'

export const useResourceStore = defineStore('resources', {
  state: () => ({
    resources: []
  }),
  actions: {
    async fetchResource () {
      const response = await axios
        .get('http://localhost:3000/resources')
        .then(response => {
          this.resources = response.data
        })
        .catch(err => {
          console.log(err)
        })
      return response
    },
    async addResource (payload) {
      const response = await axios
        .post('http://localhost:3000/resources', payload)
        .then(() => {
          this.resources.push({
            ...payload
          })
        })
        .catch(err => {
          console.log(err)
        })
      return response
    },
    async updateResource (payload, id) {
      const response = await axios
        .put('http://localhost:3000/resources/' + id, payload)
        .then(() => {
          var index = this.resources.findIndex(obj => obj.id == this.editID)
          this.resources.splice(index, 1, payload)
        })
        .catch(err => {
          console.log(err)
        })
      return response
    },
    async deleteResource (id) {
      const response = await axios
        .delete(`http://localhost:3000/resources/${id}`)
        .then(() => {
          this.resources = this.resources.filter(
            ResourceList => ResourceList.id !== id
          )
        })
        .catch(err => {
          console.log(err)
        })
      return response
    }
  }
})
