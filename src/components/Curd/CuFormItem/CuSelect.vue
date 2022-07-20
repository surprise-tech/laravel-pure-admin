<script lang="ts" setup>
import { reactive, watch } from "vue";

const emits = defineEmits(["update:modelValue"]);
let selectedVal = reactive({
  value: null
});
const props = defineProps({
  bind: {
    type: Object,
    default: () => {
      return {};
    }
  },
  options: {
    type: Object,
    default: () => {
      return {};
    }
  },
  modelValue: {}
});

watch(
  () => props.modelValue,
  newVal => {
    selectedVal.value = newVal;
  }
);

const selectChange = e => {
  emits("update:modelValue", e);
};
</script>

<template>
  <el-select
    v-model="selectedVal.value"
    v-bind="props.bind"
    @change="selectChange"
  >
    <el-option
      v-for="(opt, index) in props.options"
      v-bind="opt"
      :key="index"
    />
  </el-select>
</template>
