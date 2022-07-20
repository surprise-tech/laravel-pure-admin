<script lang="ts" setup>
const props = defineProps({
  tableData: {
    type: Array,
    default: () => {
      return [];
    }
  },
  tableBind: {
    type: Object,
    default: () => {
      return {};
    }
  }
});
</script>

<template>
  <el-table
    :data="props.tableData"
    :header-cell-style="{ background: '#fafafa', color: '#606266' }"
    v-bind="tableBind"
    style="width: 100%"
  >
    <slot />
  </el-table>
</template>
