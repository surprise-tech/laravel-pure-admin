<script setup lang="ts">
import { getCurrentInstance } from "vue";
const props = defineProps({
  collapse: Boolean
});

const title =
  getCurrentInstance().appContext.config.globalProperties.$config?.Title;
const min_title =
  getCurrentInstance().appContext.config.globalProperties.$config?.MinTitle;
</script>

<template>
  <div class="sidebar-logo-container" :class="{ collapse: props.collapse }">
    <transition name="sidebarLogoFade">
      <router-link
        v-if="props.collapse"
        key="props.collapse"
        :title="title"
        class="sidebar-logo-link"
        to="/"
      >
        <span class="sidebar-title">{{ min_title }}</span>
      </router-link>
      <router-link
        v-else
        key="expand"
        :title="title"
        class="sidebar-logo-link"
        to="/"
      >
        <span class="sidebar-title">{{ title }}</span>
      </router-link>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 48px;
  text-align: center;
  overflow: hidden;

  .sidebar-logo-link {
    height: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    padding: 0;

    .sidebar-title {
      display: block;
      width: 100%;
      color: #1890ff;
      font-weight: 600;
      font-size: 20px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      text-align: center;
      line-height: 48px;
    }
  }

  .collapse {
    .sidebar-logo {
      margin-right: 0;
    }
  }
}
</style>
