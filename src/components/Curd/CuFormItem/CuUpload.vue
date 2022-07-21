<script lang="ts" setup>
import { reactive } from "vue";
import { uploaderHttp } from "./upload";
import { UploadProps } from "element-plus";
import { getFilePath } from "/@/utils/util";

let defaultVal = reactive({
  value: []
});
const props = defineProps<{
  options: UploadProps;
  placeholder?: any;
  modelValue?: Array<string> | string | null;
}>();

// 处理默认值
if (props.modelValue) {
  let valArr = Array.isArray(props.modelValue)
    ? props.modelValue
    : [props.modelValue];
  let paths = [];
  valArr.forEach(item => {
    paths.push({
      url: getFilePath(item),
      path: item
    });
  });
  defaultVal.value = paths;
} else {
  defaultVal.value = [];
}

// 上传成功
const onUploadSuccess = (response: any) => {
  let temp = defaultVal.value;
  temp.push(response);
  defaultVal.value = temp;
  fileValChange();
};

// 删除文件
const deleteFile = (index: number) => {
  let temp = defaultVal.value;
  temp.splice(index, 1);
  defaultVal.value = temp;
  fileValChange();
};

const emits = defineEmits(["update:modelValue"]);
const fileValChange = () => {
  let res = [];
  defaultVal.value.forEach(item => {
    res.push(item.path);
  });
  console.log(props.options.multiple ? res : res.length ? res[0] : "");
  emits(
    "update:modelValue",
    props.options.multiple ? res : res.length ? res[0] : ""
  );
};
</script>

<template>
  <div>
    <el-upload
      v-bind="props.options"
      :http-request="uploaderHttp"
      :on-success="onUploadSuccess"
      class="cu-upload"
    >
      <template #trigger>
        <div v-if="props.options.multiple">
          <el-button type="primary" size="default">点击选择</el-button>
        </div>
        <div class="cu-upload-plus-icon" v-else>
          <div v-if="defaultVal.value.length" class="upload-item">
            <img :src="defaultVal.value[0].url" />
            <IconifyIconOffline
              icon="close-bold"
              class="delete-icon"
              @click.stop="deleteFile(0)"
            />
          </div>
          <IconifyIconOffline icon="plus" v-else />
        </div>
      </template>
    </el-upload>

    <div
      class="upload-list-warp"
      v-if="
        props.options.multiple &&
        !props.options.listType &&
        defaultVal.value.length
      "
    >
      <div
        class="upload-list-item"
        v-for="(item, index) in defaultVal.value"
        :key="index"
      >
        <div class="upload-item">
          <img :src="item.url" />
          <IconifyIconOffline
            icon="close-bold"
            class="delete-icon"
            @click.stop="deleteFile(index)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cu-upload-plus-icon:hover {
  border-color: var(--el-color-primary);
}
.cu-upload-plus-icon,
.upload-list-item {
  font-size: 28px;
  color: #8c939d;
  text-align: center;
  --el-upload-picture-card-size: 148px;
  background-color: var(--el-fill-color-lighter);
  border: 1px dashed var(--el-border-color-darker);
  border-radius: 6px;
  box-sizing: border-box;
  width: var(--el-upload-picture-card-size);
  height: var(--el-upload-picture-card-size);
  cursor: pointer;
  vertical-align: top;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
.upload-item {
  position: relative;
}
.upload-item .delete-icon {
  position: absolute;
  font-size: 20px;
  top: 0;
  right: 0;
  cursor: pointer;
  opacity: 0.75;
  color: var(--el-text-color-regular);
  transition: opacity var(--el-transition-duration);
  color: #ffffff;
  display: none;
}
.upload-item:hover .delete-icon {
  display: block;
}
.upload-list-warp {
  margin-top: 5px;
}
</style>
