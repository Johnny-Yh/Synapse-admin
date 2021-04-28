import { fetchUtils } from "react-admin";

const authProvider = {
  // 当用户点击登录时调用
  login: ({ base_url, username, password }) => {
    console.log("login to ", base_url);
    const options = {
        method: "POST",
        body: JSON.stringify({
          type: "m.login.password",
          user: username,
          password: password,
          initial_device_display_name: "Synapse Admin",
        }),
      };
  
    // 使用base_url进行登录 而不是用well_known入口进行登录
    // 因为管理员需要通过私有地址访问 admin API

    localStorage.setItem("base_url", base_url);

    const decoded_base_url = window.decodeURIComponent(base_url);
    const login_api_url = decoded_base_url + "/_matrix/client/r0/login";

    return fetchUtils.fetchJson(login_api_url, options).then(({ json }) => {
      localStorage.setItem("home_server", json.home_server);
      localStorage.setItem("user_id", json.user_id);
      localStorage.setItem("access_token", json.access_token);
      localStorage.setItem("device_id", json.device_id);
    });
  },
  // 当用户点击退出时调用
  logout: () => {
    console.log("logout");

    const logout_api_url =
      localStorage.getItem("base_url") + "/_matrix/client/r0/logout";
    const access_token = localStorage.getItem("access_token");

    const options = {
      method: "POST",
      user: {
        authenticated: true,
        token: `Bearer ${access_token}`,
      },
    };

    if (typeof access_token === "string") {
      fetchUtils.fetchJson(logout_api_url, options).then(({ json }) => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("device_id");
      });
    }
    return Promise.resolve();
  },
  // 当API返回错误时调用
  checkError: ({ status }) => {
    console.log("checkError " + status);
    if (status === 401 || status === 403) {
      return Promise.reject();
    }
    return Promise.resolve();
  },
  // 当用户点击其他页面，需要验证时调用
  checkAuth: () => {
    const access_token = localStorage.getItem("access_token");
    console.log("checkAuth " + access_token);
    return typeof access_token === "string"
      ? Promise.resolve()
      : Promise.reject();
  },
  // 当用户点击其他页面，检查权限时调用
  getPermissions: () => Promise.resolve(),
};

export default authProvider;
