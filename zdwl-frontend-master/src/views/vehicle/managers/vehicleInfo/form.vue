<template>
  <el-form
    :model="props.formModel"
    size="default"
    ref="ruleFormRef"
    class="form-height"
    v-loading="props.fromList.length == 0"
    label-position="left"
  >
    <el-row :gutter="220">
      <template
        v-for="(item, index) in props.fromList.slice(0, activeNumber)"
        :key="item.prop"
      >
        <el-col :span="8" v-if="item.type === 'input'">
          <el-form-item
            :label-width="item.labelWidth + 'px'"
            :label="item.label"
            :prop="item.prop"
          >
            <el-input
              @keyup.enter.native="searchInput"
              v-model="props.formModel[item.prop]"
              :placeholder="item.placeholder"
            /> </el-form-item
        ></el-col>

        <el-col :span="8" v-if="item.type === 'select'">
          <el-form-item
            :label-width="item.labelWidth + 'px'"
            :label="item.label"
            :prop="item.prop"
          >
            <el-select
              v-model="props.formModel[item.prop]"
              clearable
              filterable
              style="width: 100%"
              :multiple="item.multiple"
              :placeholder="item.placeholder"
            >
              <el-option
                v-for="option in item.optionList"
                :key="option.value"
                :label="option.label"
                :value="option.label"
              />
            </el-select> </el-form-item
        ></el-col>
        <el-col :span="8" v-if="item.type === 'selectValue'">
          <el-form-item
            :label-width="item.labelWidth + 'px'"
            :label="item.label"
            :prop="item.prop"
          >
            <el-select
              v-model="props.formModel[item.prop]"
              clearable
              filterable
              style="width: 100%"
              :multiple="item.multiple"
              :placeholder="item.placeholder"
            >
              <el-option
                v-for="option in item.optionList"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select> </el-form-item
        ></el-col>
        <el-col :span="8" v-if="item.type === 'picker'">
          <el-form-item
            :label-width="item.labelWidth + 'px'"
            :label="item.label"
            :prop="item.prop"
          >
            <el-date-picker
              v-model="props.formModel[item.prop]"
              type="daterange"
              :value-format="item.format ? item.format : 'YYYY-MM-DD'"
              :default-time="item.defaultTime ? defaultTime : defaultTimeType"
              range-separator="-"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
            /> </el-form-item
        ></el-col>
        <el-col :span="8" v-if="item.type === 'pickerDate'">
          <el-form-item
            :label-width="item.labelWidth + 'px'"
            :label="item.label"
            :prop="item.prop"
          >
            <el-row>
              <el-col :span="11"
                ><el-date-picker
                  style="width: 100%"
                  v-model="props.formModel[item.prop[0]]"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  date-format="YYYY/MM/DD"
                  type="date"
                  placeholder="开始时间"
              /></el-col>
              <el-col :span="2" class="text-center">-</el-col>
              <el-col :span="11">
                <el-date-picker
                  style="width: 100%"
                  v-model="props.formModel[item.prop[1]]"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  date-format="YYYY/MM/DD"
                  type="date"
                  placeholder="结束时间"
              /></el-col> </el-row></el-form-item
        ></el-col>
        <el-col :span="8" v-if="item.type === 'row'"></el-col>
      </template>
      <slot name="formSlot"></slot>
      <el-col :span="8" class="aline-right">
        <el-button @click="resetForm(ruleFormRef)">重 置</el-button>
        <el-button type="primary" @click="onSubmit">查 询</el-button>
        <el-button
          type="primary"
          v-if="props.fromList.length > 5 && active"
          @click="activeClick"
          link
          >展开<el-icon><ArrowDown /></el-icon
        ></el-button>
        <el-button
          type="primary"
          v-if="props.fromList.length > 5 && !active"
          @click="activeClick"
          link
          >收起<el-icon><ArrowUp /></el-icon
        ></el-button>
      </el-col>
    </el-row>
  </el-form>
</template>
<script setup lang="ts">
import { ref, nextTick } from "vue";
import type { FormInstance } from "element-plus";
import { AssemblyForm, FormSate } from "@/api/vehicleInfo/types";
import { ArrowDown, ArrowUp } from "@element-plus/icons-vue";

const props = defineProps<{ formModel: any; fromList: AssemblyForm[] }>();
const ruleFormRef = ref<FormInstance>();
const active = ref(true);
const activeNumber = ref(5);
const activeClick = () => {
  active.value = !active.value;
  activeNumber.value = active.value ? 5 : props.fromList.length;
  emit("collapseExpand", active.value);
};
const searchInput = () => {
  emit("searchInput");
};
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  emit("onSubmit");
  emit("restFunction");
};
const emit = defineEmits([
  "onSubmit",
  "collapseExpand",
  "searchInput",
  "restFunction",
]);
const onSubmit = () => {
  let list = props.fromList.find((p) => p.type === "pickerDate");
  if (
    list &&
    (props.formModel[list.prop[0]] !== "" ||
      props.formModel[list.prop[1]] !== "")
  ) {
    if (
      props.formModel[list.prop[0]] === "" ||
      props.formModel[list.prop[1]] === ""
    ) {
      ElMessage.warning("订单日期需选择开始时间与结束时间");
      return;
    }
  }

  emit("onSubmit");
};
const defaultTime = ref<[Date, Date]>([
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 2, 1, 23, 59, 59),
]);
const defaultTimeType = ref<[Date, Date]>([
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 2, 1, 0, 0, 0),
]);
</script>
<style lang="scss" scoped>
.aline-right {
  text-align: right;
  float: right;
}
:deep(.el-form-item--default) {
  margin-bottom: 24px;
}
// .form-height{
//   height: ;
// }
</style>
