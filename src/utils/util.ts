// json 转 query
export function json2query(obj) {
  const res = [];
  for (const k in obj) {
    res.push(`${k}=${obj[k]}`);
  }
  return res.join("&");
}

// 过滤自定义bing
export function filterBindOpt(opt) {
  const res = {};
  for (const k in opt) {
    if (!/^__/.test(k)) {
      res[k] = opt[k];
    }
  }
  return res;
}
