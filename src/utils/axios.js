import axios from 'axios'
import { BASE_URL, TOKEN } from '@/utils/constant'

axios.defaults.baseURL = BASE_URL
axios.defaults.headers.common['authorization'] =
  'Bearer ' + localStorage.getItem(TOKEN)
