<script lang="ts" setup>
const props = defineProps({
  detail: {
    type: Object,
    default: () => {
      return {
        options: {},
        field: []
      };
    }
  }
});
</script>

<template>
  <el-descriptions v-bind="props.detail.options">
    <el-descriptions-item
      v-bind="field.bind"
      v-for="(field, index) in props.detail.field"
      :key="index"
    >
      <span>{{ field.data }}</span>
    </el-descriptions-item>
  </el-descriptions>
</template>
