const STORAGE_USER_KEY = "EduCar_user";
const STORAGE_TOKEN_KEY = "EduCar_token";
const STORAGE_PHOTOS_KEY = "EduCar_profile_photos";

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

const API_BASE_URL = "http://localhost:4000/api";

const Api = {
  async request(path, options = {}) {
    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {})
    };
    const token = Auth.getToken();

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || "Une erreur est survenue. Veuillez reessayer.");
    }

    return data;
  },

  get(path) {
    return this.request(path);
  },

  post(path, body) {
    return this.request(path, {
      method: "POST",
      body: JSON.stringify(body)
    });
  },

  patch(path, body = {}) {
    return this.request(path, {
      method: "PATCH",
      body: JSON.stringify(body)
    });
  },

  delete(path) {
    return this.request(path, {
      method: "DELETE"
    });
  }
};

const ProfilePhotos = {
  getAll() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_PHOTOS_KEY) || "{}");
    } catch {
      return {};
    }
  },
  get(email) {
    const photos = this.getAll();
    return photos[String(email || "").trim().toLowerCase()] || "";
  },
  set(email, photo) {
    const key = String(email || "").trim().toLowerCase();
    if (!key || !photo) return;
    const photos = this.getAll();
    photos[key] = photo;
    localStorage.setItem(STORAGE_PHOTOS_KEY, JSON.stringify(photos));
  }
};
