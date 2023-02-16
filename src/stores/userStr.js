import { defineStore } from 'pinia'
import { ref, computed, reactive } from 'vue'
import axios from 'axios'
import { avoidHeader } from '@/utils/constant'

export const useUsersStore = defineStore('users', () => {
  const users = reactive({
    username: '',
    email: '',
    roles: ''
  })
  const getUsers = computed(() => users.value)

  const addUser = async payload => {
    const response = await axios.post('register', payload, avoidHeader)
    return response
  }

  const fetchUsers = async () => {
    let response = await axios.get('user')
    if (response) {
      users = response.data
    }
    return response
  }

  return { users, getUsers, addUser, fetchUsers }
})
