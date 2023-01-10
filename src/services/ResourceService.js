import axios from "axios";

export class ResourceService {
  static serverUrl = "http://localhost:3000/";

  static getAllResources() {
    let dataurl = `${this.serverUrl}/resources`;
    return axios.get(dataurl);
  }

  static createResource(payload) {
    let dataurl = `${this.serverUrl}/resources`;
    return axios.post(dataurl, payload);
  }

  static updateResource(payload, id) {
    let dataurl = `${this.serverUrl}/resources/${id}`;
    return axios.put(dataurl, payload);
  }

  static deleteResource(id) {
    let dataurl = `${this.serverUrl}/resources/${id}`;
    return axios.delete(dataurl);
  }
}