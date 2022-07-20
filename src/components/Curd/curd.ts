import { ref } from "vue";
import { http } from "/@/utils/http";
import { json2query } from "/@/utils/util";

const path = ref("");

// 请求列表数据
const loadData = (parameter, queryParam) => {
  const requestParameters = Object.assign(
    {
      current_page: parameter.current_page ? parameter.current_page : 1,
      per_page: parameter.per_page ? parameter.per_page : 10
    },
    queryParam
  );
  return http.get(path.value + "?" + json2query(requestParameters));
};

// 请求详情数据
const loadDetail = id => {
  return http.get(path.value + "/" + id);
};

// 获取编辑数据
const loadEdit = id => {
  return http.get(path.value + "/" + id + "/edit");
};

// 获取新增数据
const loadCreate = () => {
  return http.get(path.value + "/create");
};

// 编辑提交保存
const putUpdate = (id, data) => {
  return http.request("put", path.value + "/" + id, { data });
};

// 新增提交保存
const postCreate = data => {
  return http.post(path.value, { data });
};

// 删除
const deleteRequest = id => {
  return http.request("delete", path.value + "/" + id);
};

// 初始化配置
const gridConfig = () => {
  return http.get(path.value + "?_grid_configs_=1");
};

export function curdInit(url) {
  path.value = url;
  return {
    gridConfig,
    loadData,
    loadDetail,
    loadEdit,
    loadCreate,
    putUpdate,
    postCreate,
    deleteRequest
  };
}
