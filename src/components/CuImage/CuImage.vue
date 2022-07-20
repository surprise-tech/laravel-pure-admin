<script lang="ts" setup>
import { computed, getCurrentInstance } from "vue";
const fileRoot =
  getCurrentInstance().appContext.config.globalProperties.$config?.FileRoot;

const props = defineProps<{
  src?: string;
  style?: any;
  index?: number;
  list?: Array<string>;
}>();

// 获取全路径
const getFilePath = path => {
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
};

// 计算全路径
let path = computed(() => {
  return getFilePath(props.src);
});

// 计算数组全路径
let srcList = computed(() => {
  let srcArr = [];
  if (props.list) {
    props.list.forEach(it => it && srcArr.push(getFilePath(it)));
  }
  return srcArr;
});
</script>
<template>
  <el-image
    :style="props.style"
    :src="path"
    :preview-src-list="srcList"
    :initial-index="props.index ? props.index : 0"
    fit="cover"
    preview-teleported
    hide-on-click-modal
    lazy
  />
</template>
