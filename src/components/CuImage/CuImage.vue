<script lang="ts" setup>
import { computed } from "vue";
import { getFilePath } from "/@/utils/util";

const props = defineProps<{
  src?: string;
  style?: any;
  index?: number;
  list?: Array<string>;
}>();

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
