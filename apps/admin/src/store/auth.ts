import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    username: "",
    token: ""
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.token)
  },
  actions: {
    login(username: string, password: string) {
      if (username === "admin" && password === "123456") {
        this.username = username;
        this.token = "knowledge-admin-token";
        return true;
      }
      return false;
    },
    logout() {
      this.username = "";
      this.token = "";
    }
  }
});

