<template class="table-item">
    <el-table :data="props.costProps" style="width: 100%">
      <el-table-column label="费用日期">
        <template #default="scope">
          <el-form-item :prop="`${props.unit === 'L' ? 'costFuelForms':'costUreaForms'}.${scope.$index}.date`" :rules="props.formRules.input">
            <el-date-picker
              v-model="scope.row.date"
              type="date"
              placeholder="费用日期"
              size="default"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              style="width: 100%"
            />
          </el-form-item> </template
      ></el-table-column>
      <el-table-column prop="location" label="加油点"
        ><template #default="scope">
          <el-input
            v-model="scope.row.location"
            placeholder="加油站名称"
          /> </template
      ></el-table-column>
      <el-table-column label="供应商">
        <template #default="scope">
    
          <el-form-item :rules="props.formRules.input" :prop="`${props.unit === 'L' ? 'costFuelForms':'costUreaForms'}.${scope.$index}.supplierFuel`">
  
            <el-input
              :title="scope.row.supplierFuel"
              v-model="scope.row.supplierFuel"
              placeholder="供应商名称"
            />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="标准单价（元）"
        ><template #default="scope">
          <el-form-item :prop="`${props.unit === 'L' ? 'costFuelForms':'costUreaForms'}.${scope.$index}.upPrice`" :rules="props.formRules.input">
            <el-input v-model="scope.row.upPrice" placeholder="单价（元）" />
          </el-form-item> </template
      ></el-table-column>
      <el-table-column :label="'标准使用量（' + props.unit + '）'"
        ><template #default="scope">
          <el-form-item :prop="`${props.unit === 'L' ? 'costFuelForms':'costUreaForms'}.${scope.$index}.upNum`" :rules="props.formRules.input">
            <el-input
              v-model="scope.row.upNum"
              :placeholder="'使用量（' + props.unit + '）'"
          /></el-form-item> </template
      ></el-table-column>
      <el-table-column label="标准费用（元）"
        ><template #default="scope">
          <el-form-item :prop="`${props.unit === 'L' ? 'costFuelForms':'costUreaForms'}.${scope.$index}.upAmount`" :rules="props.formRules.input">
            <el-input
              v-model="scope.row.upAmount"
              placeholder="标准费用（元）"
            /> </el-form-item></template
      ></el-table-column>
      <el-table-column prop="usePrice" :label="'实际单价（元）'"
        ><template #default="scope">
          <el-input
            v-model="scope.row.usePrice"
            :placeholder="'实际单价（元）'"
          /> </template
      ></el-table-column>
      <el-table-column prop="useNum" :label="'实际使用量（L）'"
        ><template #default="scope">
          <el-input
            v-model="scope.row.useNum"
            :placeholder="'实际使用量（L）'"
          /> </template
      ></el-table-column>
  
      <el-table-column prop="amount" :label="'实际费用（元）'"
        ><template #default="scope">
          <el-input
            v-model="scope.row.amount"
            :placeholder="'实际费用（元）'"
          /> </template
      ></el-table-column>
      <el-table-column prop="" label="备注"
        ><template #default="scope">
          <el-input v-model="scope.row.remark" placeholder="备注" /> </template
      ></el-table-column>
      <el-table-column prop="status" label="核销状态"
        ><template #default="scope">
          <el-select
            v-model="scope.row.status"
            style="width: 100%"
            placeholder="请选择状态"
          >
            <el-option label="未对账" :value="0" />
            <el-option label="已核销" :value="1" />
            <el-option label="已对账" :value="2" />
          </el-select> </template
      ></el-table-column>
      <el-table-column prop="action" label="操作">
        <template #default="scope">
          <el-popconfirm
            title="确定要删除吗?"
            @confirm="handleDelete(scope.$index, scope.row)"
          >
            <template #reference>
              <el-button key="text" type="text">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-button
      :disabled="props.costProps?.length === 5"
      class="mt-4 tableAdd"
      style="width: 100%"
      @click="onAddItem"
      ><el-icon><Plus /></el-icon>&nbsp;添加{{
        props.unit === "L" ? "油费" : "尿素费"
      }}信息({{ props.costProps?.length }}/5)</el-button
    >
  </template>
  <script setup lang="ts">
  import { Plus } from "@element-plus/icons-vue";
  import { reactive, ref, onMounted } from "vue";
  import { CostFuelForms } from "@/api/depreciation/types";
  const props = defineProps<{
    state: any;
    unit: string;
    costProps: CostFuelForms[];
    formRules: any;
  }>();
  const handleDelete = (index: number, row: any) => {
    props.costProps.splice(index, 1);
  };
  
  const onAddItem = () => {
    props.costProps.push({
      date: "",
      location: "",
      upAmount: undefined,
      useNum: undefined,
      amount: undefined,
      usePrice: undefined,
      upNum: undefined,
      remark: "",
      status: undefined,
      supplierFuel: "",
    });
  };
  </script>
  <style scoped lang="scss">
  .upload-demo {
    width: 100%;
    position: relative;
    height: 32px;
  }
  .upload-demo {
    :deep(.el-upload-list) {
      display: inline-block;
      vertical-align: text-top;
      position: absolute;
      margin-top: 0;
      line-height: 32px;
      width: 100%;
    }
  }
  .upload-demo {
    :deep(.el-upload-list__item.is-success:focus:not(:hover)) {
      display: none !important;
    }
    :deep(.el-upload-list__item-name .el-icon) {
      display: none;
    }
  }
  .tableAdd {
    border-style: dashed;
  }
  :deep(.el-form-item--default) {
    margin-bottom: 0px !important;
  }
  :deep(.el-form-item__content) {
    margin-left: 0 !important;
  }
  </style>
  