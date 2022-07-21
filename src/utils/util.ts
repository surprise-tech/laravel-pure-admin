import { getCurrentInstance } from "vue";
// json 转 query
export function json2query(obj) {
  const res = [];
  for (const k in obj) {
    res.push(`${k}=${obj[k]}`);
  }
  return res.join("&");
}

// 过滤自定义bind
export function filterBindOpt(opt) {
  const res = {};
  for (const k in opt) {
    if (!/^__/.test(k)) {
      res[k] = opt[k];
    }
  }
  return res;
}

// 获取文件全路径
// 获取全路径
export function getFilePath(path) {
  const fileRoot =
    getCurrentInstance().appContext.config.globalProperties.$config?.FileRoot;
  if (path) {
    if (/^http/.test(path)) {
      return path;
    } else if (/^\//.test(path)) {
      return fileRoot + path;
    } else {
      return fileRoot + "/" + path;
    }
  }
  return "";
}
