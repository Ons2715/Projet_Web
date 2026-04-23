const STORAGE_USER_KEY = "citydrive_user";
const STORAGE_TOKEN_KEY = "citydrive_token";

const Auth = {
  get() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_USER_KEY) || "null");
    } catch {
      return null;
    }
  },
  set(user) {
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
  },
  clear() {
    localStorage.removeItem(STORAGE_USER_KEY);
    localStorage.removeItem(STORAGE_TOKEN_KEY);
  },
  getToken() {
    return localStorage.getItem(STORAGE_TOKEN_KEY);
  },
  setToken(token) {
    localStorage.setItem(STORAGE_TOKEN_KEY, token);
  }
};

const Toast = {
  show(message, type = "") {
    let container = document.querySelector(".toast-container");
    if (!container) {
      container = document.createElement("div");
      container.className = "toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast ${type}`.trim();
    toast.textContent = message;
    container.appendChild(toast);

    window.setTimeout(() => {
      toast.remove();
      if (!container.children.length) {
        container.remove();
      }
    }, 3200);
  },
  success(message) {
    this.show(message, "success");
  },
  error(message) {
    this.show(message, "error");
  }
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
