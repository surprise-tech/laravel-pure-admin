<script lang="ts" setup>
import CurdForm from "/@/components/Curd/CurdForm.vue";
import CurdTable from "/@/components/Curd/CurdTable.vue";
import CurdDescriptions from "./CurdDescriptions.vue";
import { reactive, ref, nextTick } from "vue";
import { filterBindOpt } from "/@/utils/util";
import { http } from "/@/utils/http";
import { json2query } from "/@/utils/util";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";

const props = defineProps({
  path: {
    type: String,
    required: true
  }
});

const option = reactive<any>({
  table: {
    detailOption: {},
    editOption: {},
    createOption: {},
    tableOption: {
      treeTableOptions: {}
    },
    column: []
  },
  search: {}
});

// 请求列表数据
const loadData = (parameter, queryParam) => {
  const requestParameters = Object.assign(
    {
      current_page: parameter.current_page ? parameter.current_page : 1,
      per_page: parameter.per_page ? parameter.per_page : 10
    },
    queryParam
  );
  return http.get(props.path + "?" + json2query(requestParameters));
};

// 请求详情数据
const loadDetail = id => {
  return http.get(props.path + "/" + id);
};

// 获取编辑数据
const loadEdit = id => {
  return http.get(props.path + "/" + id + "/edit");
};

// 获取新增数据
const loadCreate = () => {
  return http.get(props.path + "/create");
};

// 编辑提交保存
const putUpdate = (id, data) => {
  return http.request("put", props.path + "/" + id, { data });
};

// 新增提交保存
const postCreate = data => {
  return http.post(props.path, { data });
};

// 删除
const deleteRequest = id => {
  return http.request("delete", props.path + "/" + id);
};

// 初始化配置
const gridConfig = () => {
  return http.get(props.path + "?_grid_configs_=1");
};

gridConfig().then(grid_configs => {
  option.search = grid_configs["filter"];
  option.table = grid_configs["table"];
  changePage(); // 初始化首页
});

// 当前分页数据
let page = reactive<any>({
  current_page: 1,
  per_page: 10,
  total: 0
});

// 当前删选字段
let queryData = reactive<any>({});

// 表格数据
let tableData = ref([]);

// 详情数据
let datailData = ref({});

// 编辑数据
let editData = ref({
  fields: [],
  bind: {}
});

// 创建数据
let createData = ref({
  fields: [],
  bind: {}
});

// 显示详情抽屉
let showDetaildrawer = ref(false);

// 显示编辑抽屉
let showEditdrawer = ref(false);

// 显示新增抽屉
let showCreatedrawer = ref(false);

// 创建表单ref
const createFormRef = ref();

// 表格loading状态
let tableLoading = ref(true);

// 详情loading状态
let detailLoading = ref(true);

// 编辑loading状态
let editLoading = ref(true);

// 新增loading状态
let createLoading = ref(true);

// 生成树状结构
const treeData = (data, pid, pidField, keyField) => {
  let treeArray = [];
  data.forEach(item => {
    if (item[pidField] == pid) {
      let temp = item;
      let children = treeData(data, item[keyField], pidField, keyField);
      if (children.length) {
        temp["children"] = children;
      }
      treeArray.push(temp);
    }
  });
  return treeArray;
};

// 点击搜索
const clickSearch = date => {
  page.current_page = 1;
  queryData = date;
  changePage();
};

// 点击重置
const clickReset = date => {
  page.current_page = 1;
  queryData = date;
  changePage();
};

// 页面变化
const changePage = () => {
  tableLoading.value = true;
  loadData(page, queryData)
    .then(res => {
      if (option.table.tableOption.treeTableOptions?.enable) {
        // 开启树状表格
        tableData.value = treeData(
          res.data,
          option.table.tableOption.treeTableOptions.rootPid,
          option.table.tableOption.treeTableOptions.pidField,
          option.table.tableOption.treeTableOptions.keyField
        );
        page.total = tableData.value.length;
        page.current_page = 1;
        page.last_page = 1;
        option.table.tableOption.showPagination = false;
      } else {
        tableData.value = res.data;
        page.total = res.meta.total;
        page.current_page = res.meta.current_page;
        page.last_page = res.meta.last_page;
      }
    })
    .finally(() => {
      tableLoading.value = false;
    });
};

// 点击详情
const showDetail = id => {
  showDetaildrawer.value = true;
  detailLoading.value = true;
  loadDetail(id)
    .then(detailConfig => {
      datailData.value = detailConfig;
    })
    .finally(() => {
      detailLoading.value = false;
    });
};

// 点击编辑
const showEdit = id => {
  showEditdrawer.value = true;
  editLoading.value = true;
  loadEdit(id)
    .then(editConfig => {
      editData.value = {
        _id: id,
        ...editConfig
      };
      editLoading.value = false;
    })
    .finally(() => {
      editLoading.value = false;
    });
};

// 点击新增按钮
const showCreate = () => {
  showCreatedrawer.value = true;
  if (
    createData.value["fields"].length === 0 ||
    option.table.createOption["__cache__"] === false
  ) {
    createLoading.value = true;
    loadCreate()
      .then(createConfig => {
        createData.value = createConfig;
        createLoading.value = false;
        nextTick(() => {
          createFormRef.value.onReset();
        });
      })
      .finally(() => {
        createLoading.value = false;
      });
  } else {
    createFormRef.value.onReset();
  }
};

// 点击保存(新增)
const clickSave = data => {
  createLoading.value = true;
  postCreate(data)
    .then(() => {
      showCreatedrawer.value = false;
      changePage();
    })
    .finally(() => {
      createLoading.value = false;
    });
};

// 点击保存(编辑)
const clickUpdate = data => {
  editLoading.value = true;
  putUpdate(editData.value["_id"], data)
    .then(() => {
      showEditdrawer.value = false;
      editLoading.value = false;
      changePage();
    })
    .finally(() => {
      editLoading.value = false;
    });
};

// 点击删除
const clickDelete = id => {
  deleteRequest(id).then(changePage);
};

defineExpose({ changePage, clickReset });
</script>

<template>
  <el-card class="box-card">
    <CurdForm
      :fields="option.search"
      :formOption="{ inline: true }"
      submitTitle="搜索"
      @clickSubmit="clickSearch"
      @clickReset="clickReset"
    />

    <div class="flex justify-between w-full h-60px" style="padding: 1em 0">
      <p class="font-bold truncate">{{ option.table.tableOption.title }}</p>
      <div class="flex items-center justify-around">
        <div class="flex mr-4">
          <el-button
            type="primary"
            size="default"
            v-if="option.table.tableOption.showCreateBtn"
            @click="showCreate"
            >新增</el-button
          >
        </div>
      </div>
    </div>

    <!-- 表格 -->
    <CurdTable
      :tableData="tableData"
      :tableBind="option.table.bind"
      v-loading="tableLoading"
    >
      <el-table-column
        v-for="(column, index) in option.table.column"
        :key="index"
        v-bind="column.bind"
      >
        <template #default="scope" v-if="column.custom">
          <!-- 操作栏 -->
          <template v-if="column.bind.prop === '__actions__'">
            <slot name="__actions_before__" :row="scope.row" />
            <el-link
              type="primary"
              v-if="option.table.tableOption.showDetailBtn"
              :underline="false"
              class="m-r-2"
              @click="showDetail(scope.row.id)"
            >
              详情
            </el-link>
            <el-link
              type="primary"
              v-if="option.table.tableOption.showEditBtn"
              :underline="false"
              class="m-r-2"
              @click="showEdit(scope.row.id)"
            >
              编辑
            </el-link>
            <el-popconfirm
              title="是否确认删除?"
              v-if="option.table.tableOption.showDeleteBtn"
              @confirm="clickDelete(scope.row.id)"
            >
              <template #reference>
                <el-link :underline="false" type="primary">删除</el-link>
              </template>
            </el-popconfirm>
            <slot name="__actions_after__" :row="scope.row" />
          </template>

          <!-- tag类型 -->
          <el-tag
            v-else-if="column.custom.type == 'tag'"
            :type="column.custom.options[scope.row[column.bind.prop]]['color']"
            >{{
              column.custom.options[scope.row[column.bind.prop]]["text"]
            }}</el-tag
          >

          <!-- 多项tag multiple-tag -->
          <template v-else-if="column.custom.type == 'multiple-tag'">
            <el-tag
              :type="column.custom.color"
              v-for="(it, index) in scope.row[column.bind.prop]"
              :key="index"
              class="m-1"
              >{{ it }}</el-tag
            >
          </template>

          <!-- 图标 -->
          <template v-else-if="column.custom.type == 'icon'">
            <component
              v-if="scope.row[column.bind.prop]"
              :is="useRenderIcon(scope.row[column.bind.prop])"
            />
          </template>

          <!-- 图片 -->
          <template v-else-if="column.custom.type == 'image'">
            <div v-if="Array.isArray(scope.row[column.bind.prop])">
              <cu-image
                :src="img"
                v-for="(img, index) in scope.row[column.bind.prop]"
                :key="index"
                :style="column.custom.style"
                :index="index"
                :list="scope.row[column.bind.prop]"
              />
            </div>
            <cu-image
              v-else
              :src="scope.row[column.bind.prop]"
              :style="column.custom.style"
              :index="0"
              :list="[scope.row[column.bind.prop]]"
            />
          </template>

          <!-- 其他自定义 -->
          <slot
            v-else
            :name="column.bind.prop"
            :row="scope.row"
            :custom="column.custom"
          />
        </template>
      </el-table-column>
    </CurdTable>

    <!-- 分页 -->
    <div
      style="padding-top: 1em"
      v-if="option.table.tableOption.showPagination"
    >
      <el-pagination
        layout="total, ->, sizes, prev, pager, next"
        :page-sizes="[10, 20, 30, 50, 100]"
        v-model:currentPage="page.current_page"
        v-model:page-size="page.per_page"
        @size-change="changePage"
        @current-change="changePage"
        background
        :total="page.total"
      />
    </div>

    <!-- 新增框 -->
    <div v-if="option.table.tableOption.showCreateBtn">
      <el-drawer
        v-if="option.table.createOption.__type__ === 'drawer'"
        v-bind="filterBindOpt(option.table.createOption)"
        v-model="showCreatedrawer"
      >
        <CurdForm
          :fields="createData.fields"
          :formOption="createData.bind"
          submitTitle="保存"
          @clickSubmit="clickSave"
          v-loading="createLoading"
          ref="createFormRef"
        />
      </el-drawer>
      <el-dialog
        v-else
        v-bind="filterBindOpt(option.table.createOption)"
        v-model="showCreatedrawer"
      >
        <CurdForm
          :fields="createData.fields"
          :formOption="createData.bind"
          submitTitle="保存"
          @clickSubmit="clickSave"
          v-loading="createLoading"
          ref="createFormRef"
      /></el-dialog>
    </div>

    <!-- 编辑框 -->
    <div v-if="option.table.tableOption.showEditBtn">
      <el-drawer
        v-if="option.table.editOption.__type__ === 'drawer'"
        v-bind="filterBindOpt(option.table.editOption)"
        v-model="showEditdrawer"
      >
        <CurdForm
          :fields="editData.fields"
          :formOption="editData.bind"
          submitTitle="保存"
          @clickSubmit="clickUpdate"
          v-loading="editLoading"
        />
      </el-drawer>
      <el-dialog
        v-else
        v-bind="filterBindOpt(option.table.editOption)"
        v-model="showEditdrawer"
      >
        <CurdForm
          :fields="editData.fields"
          :formOption="editData.bind"
          submitTitle="保存"
          @clickSubmit="clickUpdate"
          v-loading="editLoading"
      /></el-dialog>
    </div>
    <!-- 详情框 -->
    <div v-if="option.table.tableOption.showDetailBtn">
      <el-drawer
        v-if="option.table.detailOption.__type__ === 'drawer'"
        v-bind="filterBindOpt(option.table.detailOption)"
        v-model="showDetaildrawer"
      >
        <CurdDescriptions v-loading="detailLoading" :detail="datailData" />
      </el-drawer>

      <el-dialog
        v-else
        v-bind="filterBindOpt(option.table.detailOption)"
        v-model="showDetaildrawer"
      >
        <CurdDescriptions v-loading="detailLoading" :detail="datailData" />
      </el-dialog>
    </div>
  </el-card>
</template>
