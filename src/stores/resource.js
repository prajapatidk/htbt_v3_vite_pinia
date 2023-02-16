import { defineStore } from 'pinia'
import axios from 'axios'
import { token } from '../utils/localStorage'

export const useResourceStore = defineStore('resources', {
  state: () => ({
    resources: [],
    assignedResourceItems: []
  }),
  actions: {
    async fetchResource () {
      const response = await axios
        .get('resource', token)
        .then(response => (this.resources = response.data))

      return response
    },

    async addResource (payload) {
      const response = await axios.post('resource', payload, token)
      if (response) {
        this.fetchResource()
      }
      return response
    },

    async updateResource (payload, id) {
      const response = await axios.put('resource/' + id, payload, token)
      if (response) {
        this.fetchResource()
      }
      return response
    },

    async deleteResource (id) {
      const response = await axios.delete(`resource/${id}`, token)
      if (response) {
        this.fetchResource()
      }
      return response
    },

    async bookResource (payload, id) {
      const response = await axios.put(`bresource/${id}`, payload, token)
      if (response) {
        this.fetchResource()
      }
      return response
    },

    async releaseResource (id) {
      const response = await axios.get(`rresource/${id}`, token).then(res => {
        this.assignedResource()
      })
      return response
    },

    async assignedResource () {
      const response = await axios
        .get('resourceByUser', token)
        .then(res => (this.assignedResourceItems = res.data))
      return response
    }
  }
})
