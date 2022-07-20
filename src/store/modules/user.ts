import { defineStore } from "pinia";
import { store } from "/@/store";
import { userType } from "./types";
import { router } from "/@/router";
import { storageSession } from "/@/utils/storage";
import { getLogin, logout as ApiLogout } from "/@/api/user";
import { getToken, setToken, removeToken } from "/@/utils/auth";
import { useMultiTagsStoreHook } from "/@/store/modules/multiTags";

const data = getToken();
let token = "";
let name = "";
if (data) {
  const dataJson = JSON.parse(data);
  if (dataJson) {
    token = dataJson?.accessToken;
    name = dataJson?.name ?? "admin";
  }
}

export const useUserStore = defineStore({
  id: "admin-user",
  state: (): userType => ({
    token,
    name,
    avatar: ""
  }),
  actions: {
    SET_TOKEN(token) {
      this.token = token;
    },
    SET_NAME(name) {
      this.name = name;
    },
    SET_AVATAR(avatar) {
      this.avatar = avatar;
    },
    // 登入
    async loginByUsername(data) {
      return new Promise<void>((resolve, reject) => {
        getLogin(data)
          .then((data: undefined) => {
            if (data) {
              setToken(data);
              resolve(data);
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    // 登出 清空缓存
    logOut() {
      ApiLogout().then(() => {
        this.token = "";
        this.name = "";
        this.avatar = "";
        removeToken();
        storageSession.clear();

        useMultiTagsStoreHook().handleTags("equal", [
          {
            path: "/welcome",
            parentPath: "/",
            meta: {
              title: "menus.hshome",
              icon: "home-filled"
            }
          }
        ]);
        router.push("/login");
      });
    }
  }
});

export function useUserStoreHook() {
  return useUserStore(store);
}
