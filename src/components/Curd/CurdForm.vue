<script lang="ts" setup>
import { FormItemRule } from "element-plus";
import { reactive, watch, ref, type PropType } from "vue";

interface FormField {
  label?: string;
  rules?: FormItemRule;
  name?: string;
  type?: string;
  bind?: any;
  options?: any;
}

const emit = defineEmits(["clickSubmit", "clickReset"]);
const props = defineProps({
  fields: {
    type: Object as PropType<FormField[]>,
    default: () => {
      return [] as FormField[];
    }
  },
  button: {
    type: String,
    default: "left"
  },
  submitTitle: {
    type: String,
    default: "提交"
  },
  resetTitle: {
    type: String,
    default: "重置"
  },
  showReset: {
    type: Boolean,
    default: true
  },
  formOption: {
    type: Object,
    required: true,
    default() {
      return {};
    }
  }
});
// 数据
let formData = reactive({});
let defaultVal = {};
let formEle = ref();

// 设置默认值
const setDefaultVal = newField => {
  defaultVal = {};
  newField.forEach(item => {
    if (item.type === "el-switch") {
      defaultVal[item.name] = formData[item.name] = Boolean(
        item["__default__"]
      );
    } else {
      if (item["__default__"] !== null) {
        // 默认值
        formData[item.name] = item["__default__"];
        defaultVal[item.name] = item["__default__"];
      } else {
        formData[item.name] = "";
      }
    }
    setTimeout(() => {
      formEle.value.clearValidate();
    }, 60);
  });
};
watch(() => props.fields, setDefaultVal);

// 点击确认
const onSubmit = () => {
  formEle.value.validate(valid => {
    if (valid) {
      emit("clickSubmit", formData);
    }
  });
};

// 点击重置
const onReset = () => {
  setDefaultVal(props.fields);
  Object.assign(formData, defaultVal);
  emit("clickReset", formData);
};

defineExpose({ onReset });
</script>

<!-- 自定义组件 -->
<script lang="ts">
import CuSelect from "./CuFormItem/CuSelect.vue";
import CuUpload from "./CuFormItem/CuUpload.vue";
export default {
  components: {
    "cu-select": CuSelect,
    "cu-upload": CuUpload
  }
};
</script>

<template>
  <el-form
    ref="formEle"
    v-bind="formOption"
    :model="formData"
    class="demo-form-inline"
  >
    <el-form-item
      :label="field.label"
      v-for="(field, index) in props.fields"
      :key="index"
      :rules="field.rules"
      :prop="field.name"
      :show-message="false"
    >
      <!-- 动态组件 -->
      <component
        :is="field.type"
        v-model="formData[field.name]"
        v-bind="field.bind ? field.bind : {}"
      />
    </el-form-item>

    <el-form-item v-if="props.fields.length">
      <el-button type="primary" @click="onSubmit">{{
        props.submitTitle
      }}</el-button>

      <el-button v-if="props.showReset" type="default" @click="onReset">{{
        props.resetTitle
      }}</el-button>
    </el-form-item>
  </el-form>
</template>
