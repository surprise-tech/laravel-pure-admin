<script lang="ts" setup>
import { reactive } from "vue";

const emits = defineEmits(["update:modelValue"]);
interface SelectOpt {
  label: string;
  value: any;
  created?: boolean;
  disabled?: boolean;
}
const props = defineProps<{
  options: Object;
  placeholder: string;
  selectOptions: Array<SelectOpt>;
  modelValue?: any;
}>();

let selectedVal = reactive({
  value: props.modelValue
});

const selectChange = e => {
  emits("update:modelValue", e);
};
</script>

<template>
  <div>
    <el-select
      v-model="selectedVal.value"
      v-bind="props.options"
      @change="selectChange"
    >
      <el-option
        v-for="(opt, index) in props.selectOptions"
        v-bind="opt"
        :key="index"
      />
    </el-select>
  </div>
</template>
