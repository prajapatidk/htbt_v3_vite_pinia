import { defineStore } from 'pinia'
import axios from 'axios'
import { token } from '../utils/localStorage'

export const useResourceStore = defineStore('resources', {
  state: () => ({
    itemDetails: [],
    resources: [],
    draftResources: [],
    assignedResourceItems: []
  }),
  actions: {
    async fetchAll () {
      const response = await axios.get('resource', token)
      this.resources = response.data.filter(s => s.status != 0)

      return response
    },

    async fetchAlldraft () {
      const response = await axios.get('resource', token)
      this.draftResources = response.data.filter(s => s.status == 0)
      return response
    },

    async itemDetails (id) {
      const response = await axios.get(`resource/${id}`, token)
      if (response) {
        this.itemDetails = response.data
        this.fetchAll()
      }
      return response
    },

    async addResource (payload) {
      const response = await axios.post('resource', payload, token)
      if (response) {
        this.fetchAll()
      }
      return response
    },

    async updateResource (payload, id) {
      const response = await axios.put(`resource/${id}`, payload, token)
      if (response) {
        this.fetchAll()
      }
      return response
    },

    async restoreResource (id) {
      const response = await axios.put(`restoreresource/${id}`, token)
      if (response) {
        this.fetchAlldraft()
      }
      return response
    },

    async deleteResource (id) {
      const response = await axios.delete(`resource/${id}`, token)
      if (response) {
        this.fetchAll()
      }
      return response
    },

    async bookResource (payload, id) {
      const response = await axios.put(`bresource/${id}`, payload, token)
      if (response) {
        this.fetchAll()
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
