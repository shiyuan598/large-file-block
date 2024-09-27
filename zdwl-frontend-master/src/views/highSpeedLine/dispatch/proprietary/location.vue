<template>
  <el-row :gutter="80">
    <el-col class="margin-bo" :span="12">
      <div
        v-for="(item, index) in props.waypointList"
        style="position: relative"
      >
        <el-form-item :label="index === 0 ? '&nbsp;&nbsp;&nbsp;经停地点' : ''">
          <el-select
            v-model="item.value"
            style="width: 100%"
            filterable
            @change="(value)=>selectLocation(value,item)"
            :loading="state.selectloading"
            placeholder="请选择经停地点"
          >
            <el-option
              v-for="val in item.list"
              :key="val.id"
              :label="val.name"
              :value="val.id"
            />
          </el-select>
        </el-form-item>
        <div class="icon-style">
          <el-icon v-if="index !== 0" disabled @click="clickSort(index)"
            ><Sort
          /></el-icon>
          <el-icon @click="removeClick(index)" class="ml-2"><Delete /></el-icon>
        </div>
      </div>
      <el-button
        class="tableAdd"
        style="width: calc(100% - 90px); margin-left: 90px;"
        @click="onAddItem"
        ><el-icon><Plus /></el-icon>&nbsp;添加经停点</el-button
      >
      <el-text class="mt-10" style="width:calc(100% - 80px);margin-top: 8px;margin-left: 90px;font-size: 14px" truncated title="请按经停顺序从上往下添加，最多添加5个">请按经停顺序从上往下添加，最多添加5个</el-text>
      <!-- <span style="margin-left: 90px;height: 20px;font-size: 14px;font-family: PingFangSC, PingFang SC;font-weight: 400;color: #8C8C8C;line-height: 20px;padding-top: 8px;">请按经停顺序从上往下添加，最多添加5个</span> -->
    </el-col>
  </el-row>
</template>
<script setup lang="ts">
import { Sort, Delete, Plus } from "@element-plus/icons-vue";
import { reactive } from "vue";
import { debounce } from "lodash-es";
import { locationStation } from "@/api/depreciation";
const props = defineProps({
  waypointList: {
    type: Array,
  },
  locationList: {
    type: Array
  }
});
const state = reactive({
  selectloading: false,
});
const selectLocation = (value:number,item:any)=>{
 item.label = item.list.filter((val:any)=>val.id === value)[0]?.name;
}
const remoteMethod = debounce(async (query: string, item:any) => {
  if (query) {
    state.selectloading = true;
    try {
      const { data } = await locationStation({ keywords: query });
      item.list = data;
      state.selectloading = false;
    } catch (e:any) {
      state.selectloading = false;
      ElMessage.error(e.message);
    }
  }
}, 1000);

const clickSort = (index) => {
  [props.waypointList[index - 1], props.waypointList[index]] = [
    props.waypointList[index],
    props.waypointList[index - 1],
  ];
};
const onAddItem = () => {

    props.waypointList.push({
    label: "",
    value: "",
    list: props.locationList,
  });
};
const removeClick = (index)=>{
    props.waypointList.splice(index,1)
}
</script>
<style scoped lang="scss">
.icon-style {
  margin: 8px;
  cursor: pointer;
  position: absolute;
  right: -56px;
  top: 0px;
}
.tableAdd {
  border-style: dashed;
  border-color: #b1b3b8;;
}
</style>
