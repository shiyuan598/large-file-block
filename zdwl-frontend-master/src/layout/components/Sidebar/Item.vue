<template>
  <el-icon v-if="icon && icon.includes('el-icon')" class="sub-el-icon" />
  <SvgIcon v-else-if="icon" :icon-class="icon" />
  <span v-if="title" style="margin-left: 12px;">{{ translateRouteTitleI18n(title) }}</span>
</template>

<script setup lang="ts">
import { translateRouteTitleI18n } from "@/utils/i18n";

defineProps({
  icon: {
    type: String,
    default: "",
  },
  title: {
    type: String,
    default: "",
  },
});
</script>

<style scoped>
.sub-el-icon {
  width: 14px;
  height: 14px;
  margin: 13px 0 0 16px;
  color: currentcolor;
}
</style>
