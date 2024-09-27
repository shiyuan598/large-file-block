<template>
  <div class="app-container">
    <el-header
      style="
        background-color: white;
        display: flex;
        justify-content: flex-start;
        height: 56px;
      "
    >
      <span
        style="
          font-size: 14px;
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          color: #8c8c8c;
          display: flex;
          align-items: center;
          line-height: 30px;
        "
        >当前位置：</span
      >
      <el-breadcrumb separator="-" style="display: flex; align-items: center">
        <el-breadcrumb-item :to="{ path: '/highSpeedLine/project/cooperate' }"
          ><span style="color: #8c8c8c">高速干线</span></el-breadcrumb-item
        >
        <el-breadcrumb-item
          :to="{ path: '/highSpeedLine/dispatch/proprietary' }"
          ><span style="color: #8c8c8c">调度中心</span></el-breadcrumb-item
        >
        <el-breadcrumb-item
          ><span
            :class="
              state.import || !state.built
                ? 'breadcrumb-color'
                : 'breadcrumb-color-is'
            "
            @click="returnList"
            >自营业务</span
          ></el-breadcrumb-item
        >
        <el-breadcrumb-item v-if="state.import"
          ><span style="color: #303030">导入</span></el-breadcrumb-item
        >
        <el-breadcrumb-item v-if="!state.built"
          ><span style="color: #303030">编辑</span></el-breadcrumb-item
        >
      </el-breadcrumb>
    </el-header>
    <div class="map-content" ref="vehi" v-if="state.built && !state.import">
      <div class="set-height">
        <Form
          class="hide-form"
          :formModel="form"
          :fromList="list"
          @searchInput="searchInput"
          @collapseExpand="collapseExpand"
          @onSubmit="onSubmit"
          @restFunction="restFunction"
        >
          <template #formSlot> </template>
        </Form>
        <el-row>
          <el-col :span="14">
            <el-button @click="newBuilt" type="primary" size="default"
              >新建</el-button
            >
            <el-button @click="issuanceOrder('issuance')" size="default"
              >订单下发</el-button
            >
            <el-button @click="importVehicle('基础')" size="default"
              >基础导入</el-button
            >
            <el-button @click="importVehicle('完整')" size="default"
              >完整导入</el-button
            >
            <el-button @click="exportVehicle" size="default">导出</el-button>
            <el-popconfirm
              title="确定要删除吗?"
              @confirm="issuanceOrder('batch')"
            >
              <template #reference>
                <!-- <el-button key="text" type="text">删除</el-button> -->
                <el-button size="default">删除</el-button>
              </template>
            </el-popconfirm>
            <el-button
              @click="intelligent"
              class="ml-12px"
              type="primary"
              size="default"
              >智能调度</el-button
            >
            <el-button
              @click="supplement"
              :disabled="multipleSelection.length === 0"
              size="default"
              >司机补扣款</el-button
            >
          </el-col>
          <el-col :span="10" class="property">
            <div>
              <span class="span-color">参考油量(L)：</span>
              <el-text class="w-150px text-span" truncated>
                {{ state.refer }}
              </el-text>
              <span class="span-color ml-8">实际油量(L)：</span>
              <el-text class="w-150px text-span" truncated>
                {{ state.reality }}
              </el-text>
              <span class="span-color ml-8">额外油量(L)：</span>
              <el-text class="w-150px text-span" truncated>
                {{ state.additional }}
              </el-text>
            </div>
          </el-col>
        </el-row>
        <!-- default small -->
        <el-table
          :data="tableData"
          v-loading="state.loading"
          :max-height="setHeight"
          size="default"
          @row-click="rowClick"
          @sort-change="sortChange"
          tooltip-effect="light"
          style="width: 100%; margin-top: 16px"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column width="144" prop="uuid" fixed label="订单编号" />
          <el-table-column prop="costDriverStatus" width="90" label="结算状态">
            <template #default="scope">
              <span :class="scope.row.costDriverStatus==1?'text-color':''">{{ fileDriverStatus(scope.row.costDriverStatus) }}</span>
              
            </template>
          </el-table-column>
          <el-table-column prop="" width="90" label="订单状态">
            <template #default="scope">
              <span
                class="round"
                :class="'roundColor' + scope.row.status"
              ></span
              >{{ fileStatus(scope.row.status) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="orderDate"
            :show-overflow-tooltip="true"
            sortable="custom"
            width="110"
            label="订单日期"
          >
            <template #default="scope">
              {{ fileTime(scope.row.orderDate) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="route"
            :show-overflow-tooltip="true"
            width="210"
            label="路线名称"
          >
            <template #default="scope">
              {{ scope.row.route }}({{ scope.row.project }})
            </template>
          </el-table-column>
          <el-table-column
            prop="customer"
            :show-overflow-tooltip="true"
            width="110"
            label="客户名称"
          />
          <el-table-column prop="tractor" width="100" label="车牌号码" />
          <el-table-column prop="firstDriver" width="90" label="主驾">
            <template #default="scope">
              {{ scope.row.firstDriver }}
              <el-tooltip
                class="box-item"
                effect="dark"
                :content="scope.row.firstDriverPhone"
                placement="right"
              >
                <el-icon><Iphone /></el-icon>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="secondDriver" width="90" label="副驾">
            <template #default="scope">
              {{ scope.row.secondDriver }}
              <el-tooltip
                class="box-item"
                effect="dark"
                :content="scope.row.secondDriverPhone"
                placement="right"
              >
                <el-icon v-show="scope.row.secondDriverPhone"
                  ><Iphone
                /></el-icon>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="里程（KM）" align="center">
            <el-table-column
              prop="upMileage"
              label="标准"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="gpsMileage"
              label="实际"
              width="100"
              align="center"
            >
              <template #default="scope">
                <el-input
                  :class="scope.row.gpsMileageStatus === 1 ? 'red-color' : ''"
                  @change="(value:number )=>gpsMileageInput(value,scope.row)"
                  @keyup.enter="handleEnter"
                  v-model="scope.row.gpsMileage"
                  placeholder=""
                  :disabled="scope.row.costDriverStatus == 1"
                />
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="油量计算(L)" align="center">
            <el-table-column
              prop="referenceFuelNum"
              label=""
              width="100"
              align="center"
            >
              <template #header="header">
                <span>标准油耗</span>
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  content="默认标准里程*百公里油耗实际际里程修改以实际为主"
                  placement="top"
                >
                  <span class="scope-icon">
                    <el-icon><Warning /></el-icon
                  ></span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="useFuelNum" label="实际" align="center">
              <template #default="scope">
                <el-button
                  @Click="numClick(scope.row.uuid)"
                  type="primary"
                  link
                  >{{ scope.row.useFuelNum }}</el-button
                >
              </template>
            </el-table-column>
          </el-table-column>

          <el-table-column prop="orderType" width="90" label="订单类型">
            <template #default="scope">
              {{ fileType(scope.row.orderType) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="route"
            :show-overflow-tooltip="true"
            width="82"
            label="运输类型"
          >
            <template #default="scope">
              {{ scope.row.tranType }}
            </template>
          </el-table-column>
          <el-table-column prop="startTime" width="164" label="发车时间" />
          <el-table-column prop="endTime" width="164" label="到达时间" />

          <el-table-column label="时效（分钟）" align="center">
            <el-table-column
              prop="upTime"
              label="标准"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="downTime"
              label="实际"
              align="center"
            ></el-table-column>
          </el-table-column>
          <el-table-column
            label="创建时间"
            width="200"
            align="center"
            prop="createTime"
          ></el-table-column>
          <el-table-column prop="action" fixed="right" label="操作" width="180">
            <template #default="scope">
              <el-button
                key="text"
                type="text"
                @click.stop="editClick(scope.$index, scope.row)"
                >编辑</el-button
              >
              <el-popconfirm
                title="确定要删除吗?"
                @confirm="handleDelete(scope.row.id)"
              >
                <template #reference>
                  <el-button @click.stop key="text" type="text">删除</el-button>
                </template>
              </el-popconfirm>
              <el-button
                v-if="scope.row.status === 0"
                key="text"
                type="text"
                @click="distribute(scope.$index, scope.row)"
                >订单下发</el-button
              >
              <el-button
                v-if="scope.row.status === 1"
                key="text"
                type="text"
                @click="CancelDistribution(scope.$index, scope.row)"
                >取消下发</el-button
              >
              <el-button
                v-if="scope.row.status === 3"
                key="text"
                type="text"
                @click="history(scope.$index, scope.row)"
                >历史轨迹</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-row class="pagination-style" justify="end">
          <el-pagination
            background
            layout="total, prev, pager, next, sizes, jumper"
            @size-change="handleUseSizeChange"
            @current-change="handleUseCurrentChange"
            :pager-count="5"
            :page-sizes="[10, 20, 30, 40, 100]"
            :total="state.total"
          />
        </el-row>
      </div>
      <el-dialog
        :close-on-click-modal="false"
        class="newDialogClass"
        v-model="state.intelligentSwitch"
        style="height: 200px"
      >
        <template #header="{ close, titleId, titleClass }">
          <div class="my-header">日期选择</div>
        </template>
        <el-date-picker
          class="mt-20px"
          value-format="YYYY-MM-DD"
          :disabledDate="dateRangePickerOptions"
          v-model="preOrderDate"
          type="date"
          placeholder="选择订单日期"
        >
        </el-date-picker>
        <div
          class="aline-right"
          style="position: absolute; bottom: 10px; right: 20px"
        >
          <el-button @click="cancellation()" size="default">取消</el-button>
          <el-button @click="sureClick()" type="primary" size="default"
            >确定</el-button
          >
        </div>
      </el-dialog>
      <el-dialog
        v-model="state.dialogVisible"
        :close-on-click-modal="false"
        class="newDialogClass"
        @close="closeDialog"
      >
        <template #header="{ close, titleId, titleClass }">
          <div class="my-header">{{ state.dialogTitle }}订单</div>
        </template>
        <div v-show="state.step === 0">
          <div class="steps">
            <div class="steps-inline steps-blue">1</div>
            <span class="steps-text weight-bold">填写自营订单</span>
            <div class="steps-border"></div>
            <div class="steps-inline steps-lightgray">2</div>
            <span class="steps-text">选择调度信息</span>
          </div>
          <div class="dialog-content">
            <el-form
              :model="formProjectDialog"
              :rules="rulesProjectDialog"
              label-width="90px"
              v-loading="state.editLoading"
              :show-message="false"
              size="default"
              ref="projectFormRef"
              label-position="left"
              class="map-content"
            >
              <el-row :gutter="80" :align="'middle'">
                <el-col class="margin-bo" :span="12">
                  <el-form-item label="运输类型" prop="tranTypeCode">
                    <el-select
                      v-model="formProjectDialog.tranTypeCode"
                      style="width: 100%"
                      filterable
                      placeholder="请选择运输类型"
                      @change="changeTranType"
                    >
                      <el-option
                        v-for="item in tranTypelist"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col class="margin-bo" :span="12">
                  <el-form-item label="项目名称" prop="projectCode">
                    <el-select
                      v-model="formProjectDialog.projectCode"
                      style="width: 100%"
                      filterable
                      placeholder="请选择项目名称"
                      @change="changeProject"
                    >
                      <el-option
                        v-for="item in projectOption"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col class="margin-bo" :span="12">
                  <el-form-item label="订单日期" prop="orderDate">
                    <el-date-picker
                      v-model="formProjectDialog.orderDate"
                      value-format="YYYY-MM-DD"
                      type="date"
                      placeholder="请选择订单日期"
                    />
                  </el-form-item>
                </el-col>
                <el-col class="margin-bo" :span="12">
                  <el-form-item label="路线名称" prop="routeCode">
                    <el-select
                      v-model="formProjectDialog.routeCode"
                      filterable
                      style="width: 100%"
                      placeholder="请选择路线名称"
                      @change="changeRoute"
                    >
                      <el-option
                        v-for="item in lineOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col class="margin-bo" :span="12">
                  <el-form-item label="起运地点" prop="startStation">
                    <el-select
                      v-model="formProjectDialog.startStation"
                      filterable
                      value-key="id"
                      :loading="state.selectloading"
                      style="width: 100%"
                      placeholder="请选择起运地点"
                      @change="
                        (value) => {
                          changeselect(value, 'startCode');
                        }
                      "
                    >
                      <el-option
                        v-for="item in location"
                        :key="item.id"
                        :label="item.name"
                        :value="item.name"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col class="margin-bo" :span="12">
                  <el-form-item label="目的地点" prop="endStation">
                    <el-select
                      v-model="formProjectDialog.endStation"
                      filterable
                      :loading="state.selectloading"
                      style="width: 100%"
                      placeholder="请选择目的地点"
                      @change="
                        (value) => {
                          changeselect(value, 'endCode');
                        }
                      "
                    >
                      <el-option
                        v-for="item in location"
                        :key="item.id"
                        :label="item.name"
                        :value="item.name"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <Loaction
                v-if="formProjectDialog.routeCode"
                :waypointList="waypointList"
                :locationList="location"
              ></Loaction>
            </el-form>
          </div>
          <div class="aline-right">
            <el-button @click="cancellation()" size="default">取消</el-button>
            <el-button
              type="primary"
              :disabled="!state.submitFormDisabled && state.editDisabled"
              @click="nextStep"
              size="default"
              >下一步</el-button
            >
          </div>
        </div>
        <div v-show="state.step === 1">
          <div class="steps">
            <div class="steps-inline steps-check">
              <el-icon><Check /></el-icon>
            </div>
            <span class="steps-text">填写自营订单</span>
            <div class="steps-border steps-border-check"></div>
            <div class="steps-inline steps-blue">2</div>
            <span class="steps-text weight-bold">选择调度信息</span>
          </div>
          <div class="record-title weight-bold">近三次调度记录</div>
          <el-row :gutter="20">
            <el-col :span="8" v-for="item in routeList">
              <div class="record-ev">
                <div class="record-bold-text weight-bold">
                  {{ item.tractor }}
                </div>
                <div class="record-text">
                  司机： {{ item.firstDriver }}（主）<span
                    v-show="item.secondDriver"
                    >、{{ item.secondDriver }}（副）</span
                  >
                </div>
                <div class="record-text">订单时间： {{ item.orderDate }}</div>
                <div class="record-state">
                  <el-tag>{{ fileStatus(item.status) }}</el-tag>
                </div>
              </div>
            </el-col>
          </el-row>
          <div class="dialog-content mt-6">
            <el-form
              :model="formRecordDialog"
              :rules="rulesRecordDialog"
              label-width="90px"
              v-loading="state.loading"
              size="default"
              ref="recordFormRef"
              label-position="left"
              class="map-content"
            >
              <el-row :gutter="80" :align="'middle'">
                <el-col class="margin-bo" :span="12">
                  <el-form-item label="单双驾驶" prop="driverType">
                    <el-radio-group
                      v-model="formRecordDialog.driverType"
                      class="ml-4"
                    >
                      <el-radio :label="2" size="large">双驾</el-radio>
                      <el-radio :label="1" size="large">单驾</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col class="margin-bo" :span="12">
                  <el-form-item label="牵引车牌" prop="tractorCode">
                    <el-select
                      v-model="formRecordDialog.tractorCode"
                      style="width: 100%"
                      placeholder="请选择牵引车牌"
                      filterable
                      @change="tractorCodeChange"
                    >
                      <el-option
                        v-for="item in tractorOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col class="margin-bo" :span="12">
                  <el-form-item label="主驾驶员" prop="firstDriverCode">
                    <el-row>
                      <el-col :span="11"
                        ><el-select
                          v-model="formRecordDialog.firstDriverCode"
                          style="width: 100%"
                          filterable
                          placeholder="选择司机"
                          @change="firstDriver"
                        >
                          <el-option
                            v-for="item in onDriverList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                          /> </el-select
                      ></el-col>
                      <el-col :span="1" class="center"> - </el-col>
                      <el-col :span="12">
                        <el-input
                          v-model="formRecordDialog.upFirstDriverAmount"
                          placeholder="驾驶提成"
                        >
                          <template #append>元</template>
                        </el-input>
                      </el-col>
                    </el-row>
                  </el-form-item>
                </el-col>
                <el-col
                  class="margin-bo"
                  :span="12"
                  v-if="formRecordDialog.driverType === 2"
                >
                  <el-form-item label="副驾驶员" prop="secondDriverCode">
                    <el-row>
                      <el-col :span="11"
                        ><el-select
                          v-model="formRecordDialog.secondDriverCode"
                          style="width: 100%"
                          filterable
                          placeholder="选择司机"
                          @change="secondDriver"
                        >
                          <el-option
                            v-for="item in onDriverList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                          /> </el-select
                      ></el-col>
                      <el-col :span="1" class="center"> - </el-col>
                      <el-col :span="12">
                        <el-input
                          v-model="formRecordDialog.upSecondDriverAmount"
                          placeholder="驾驶提成"
                        >
                          <template #append>元</template>
                        </el-input>
                      </el-col>
                    </el-row>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <div class="aline-right">
            <el-button @click="recordCancellation()" size="default"
              >上一步</el-button
            >
            <el-button
              type="primary"
              :disabled="!state.submitRecord"
              @click="recordNextStep"
              size="default"
              >确定</el-button
            >
          </div>
        </div>
      </el-dialog>
      <el-dialog
        width="65%"
        v-model="state.projectLoading"
        class="newDialogClass"
      >
        <template #header="{ close, titleId, titleClass }">
          <div class="my-header">历史轨迹</div>
        </template>
        <Map
          class="trajectory"
          v-if="state.projectLoading"
          :rowHistory="state.rowHistory"
        ></Map>
      </el-dialog>
      <el-dialog
        :close-on-click-modal="false"
        class="newDialogClass"
        v-model="state.supplementDialog"
      >
        <template #header="{ close, titleId, titleClass }">
          <div class="my-header">司机补扣款</div>
        </template>
        <el-form label-position="left">
          <el-row :gutter="80" :align="'middle'" class="mt-10px">
            <el-col :span="12" v-for="item in fuelList" :key="item.driverName">
              <el-form-item :label="item.driverName">
                <el-date-picker
                  v-model="item.costDate"
                  type="date"
                  placeholder="费用日期"
                  size="default"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  style="width: 130px"
                />
                <span>&nbsp;-&nbsp;</span>
                <el-input style="width: 120px" v-model="item.amount" placeholder="补扣款金额" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="备注" style="width: 100%">
              <el-input
                v-model="notes"
                type="textarea"
                placeholder="请输入备注"
              />
            </el-form-item>
          </el-row>
          <el-row class="warning-color"
            ><el-icon class="mt-4px mr-4px"><Warning /></el-icon
            >金额为0，不计入补扣款</el-row
          >
          <div class="aline-right">
            <el-button @click="cancellSupplement()" size="default"
              >取消</el-button
            >
            <el-button @click="supplementSure()" type="primary" size="default"
              >确定</el-button
            >
          </div>
        </el-form>
      </el-dialog>
      <el-dialog
        title="油费详情"
        :close-on-click-modal="false"
        v-model="state.feeOilAppear"
        :destroy-on-close="true"
        width="90%"
      >
        <FeeOil :numId="numId" @upload="uploadList"></FeeOil>
      </el-dialog>
    </div>
    <div class="map-content" v-if="!state.built">
      <div class="set-height">
        <NewBuilt
          @cancelBuit="cancelBuit"
          :builtRow="builtRow"
          :tractorOptions="tractorOptions"
          :driverOptions="driverOptions"
          :licenseOptions="licenseOptions"
        ></NewBuilt>
      </div>
    </div>
    <div class="map-content overflow-hidden" v-if="state.import">
      <div class="importSlot-height" style="height: 100%">
        <importSlot
          :title="state.title"
          :apiFn="state.apiFn"
          :downFn="state.downFn"
          :downloadType="state.downloadType"
          @returnList="returnList"
        ></importSlot>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Iphone, Check, Warning } from "@element-plus/icons-vue";
import Form from "@/views/vehicle/managers/vehicleInfo/form.vue";
import importSlot from "@/views/Import/index.vue";
import type { FormInstance } from "element-plus";
import { exportFile } from "@/utils";
import Map from "./map.vue";
import NewBuilt from "./newBuilt.vue";
import { useElementSize } from "@vueuse/core";
import { ref, reactive, computed, onMounted, watch, nextTick } from "vue";
import { AssemblyForm } from "@/api/vehicleInfo/types";
import {
  deleteTractor,
  getOptions,
  smartSchedule,
  gpsMileageUpdate,
  fuelStat,
} from "@/api/vehicleInfo";
import {
  Depreciation,
  Options,
  DispatchOrder,
  RecordOrder,
  NewDispatch,
} from "@/api/depreciation/types";
import FeeOil from "./feeOil.vue";
import Loaction from "./location.vue";
import { dictionary } from "@/store/modules/dictionary";
import { useRoute } from "vue-router";
import { driverPage } from "@/api/secure";
// 客户名称 , 线路信息 ,车牌号码，司机姓名
import {
  cooperateList,
  lineInfoList,
  tractorList,
  driverList,
  dispatchOrder,
  projectList,
  dispatchOrderId,
  newDispatchOrder,
  threeRoute,
  dispatchOrderPush,
  importDispatchOrder,
  importDispatchOrderBase,
  dispatchOrderTemplateBase,
  dispatchOrderTemplate,
  getStationList,
  dispatchOrderBase,
  costFuelList,
  expenseAdd,
  undoPush,
} from "@/api/depreciation";
import { calculate } from "@/utils";
const vehi = ref();
const { height } = useElementSize(vehi);
const setHeight = computed(() => {
  return height.value - 280;
});
const route = useRoute();
const form = reactive<Depreciation>({
  startTime: "",
  endTime: "",
  picker: [],
  pageNum: 1,
  pageSize: 10,
  driverCode: undefined,
  tractorCode: undefined,
  status: undefined,
  customerCode: undefined,
  orderType: null,
  orderDateSort: "",
  routeCode: undefined,
});
const state = reactive({
  loading: false,
  dialogVisible: false,
  title: "调度中心 - 自营业务",
  apiFn: null,
  downFn: null,
  import: false,
  downloadType: "fuel",
  projectLoading: false,
  step: 0,
  built: true,
  queryLoding: false,
  selectloading: false,
  submitFormDisabled: false,
  editDisabled: true,
  submitRecord: false,
  editLoading: false,
  total: 0,
  rowHistory: {},
  dialogTitle: "",
  intelligentSwitch: false,
  refer: 0,
  reality: 0,
  additional: 0,
  supplementDialog: false,
  supplementLoading: false,
  feeOilAppear: false,
});
// 线路名称
const lineOptions: any = ref([]);
// 起运地点
const startCodeOptions: any = ref([]);
// 目的地点
const destinationOptions: any = ref([]);
// 经停点
const waypointList: any = ref([]);
// 地点列表
const location: any = ref([]);
// 地点请求
const stationList = async (val: number | undefined) => {
  try {
    const { data } = await getStationList({ projectCode: val, pageSize: 99 });
    location.value = data;
  } catch (e: any) {
    ElMessage.error(e.message);
  }
};
const handleEnter = (val: any) => {
  val.target.blur();
};
const gpsMileageInput = async (value: number, row: any) => {
  let parmers = {
    orderId: row.id,
    gpsMileage: Number(value),
  };
  try {
    const { data } = await gpsMileageUpdate(row.id, parmers);
    getStatList();
  } catch (e: any) {
    ElMessage.error(e.message);
  }
};
const setStationList = (formList: any) => {
  waypointList.value = [];
  formRecordDialog.upFirstDriverAmount = formList.upFirstDriverAmount;
  formRecordDialog.upSecondDriverAmount = formList.upSecondDriverAmount;
  if (!formList?.waypoints) return;
  const keys = formList?.waypoints?.split(",");
  const values = formList?.waypointCodes?.split(",");
  if (keys) {
    keys.map((n: any, index: number) => {
      waypointList.value?.push({
        label: n,
        value: Number(values[index]),
        list: location.value,
      });
    });
  }
};
// 路线名称change
const changeRoute = async (value: number) => {
  const routeList: any = lineOptions.value?.filter(
    (val: any) => val.id === value
  );
  if (routeList.length === 0) return;
  setStationList(routeList[0]);
  formProjectDialog.project = routeList[0].project;
  formProjectDialog.startCode = routeList[0].startCode;
  formProjectDialog.endCode = routeList[0].endCode;
  formProjectDialog.startStation = routeList[0].startStation;
  formProjectDialog.endStation = routeList[0].endStation;
  formProjectDialog.route = routeList[0].name;
  formProjectDialog.customer = routeList[0].customer;
  formProjectDialog.customerCode = routeList[0].customerCode;
  formProjectDialog.upAmount = routeList[0].upAmount;
  formProjectDialog.upFuelNum = routeList[0].upFuelNum;
  formProjectDialog.upTime = routeList[0].upTime;
  formProjectDialog.upHighAmount = routeList[0].upHighAmount;
  formProjectDialog.upMileage = routeList[0].upMileage;
  formProjectDialog.upUreaNum = routeList[0].upUreaNum;
  formProjectDialog.waypointCodes = routeList[0].waypointCodes;
  formProjectDialog.waypoints = routeList[0].waypoints;
  formRecordDialog.driverType = routeList[0].upDriverType;
};
const firstDriver = (val: number) => {
  const obj: any = driverOptions.value.filter((n: any) => n.id === val);
  formRecordDialog.firstDriver = obj[0].name;
  formRecordDialog.firstDriverPhone = obj[0].phone;
};
const secondDriver = (val: number) => {
  const obj: any = driverOptions.value.filter((n: any) => n.id === val);
  formRecordDialog.secondDriver = obj[0].name;
  formRecordDialog.secondDriverPhone = obj[0].phone;
};
const tractorCodeChange = (val: number) => {
  const obj: any = tractorOptions.value?.filter((n: any) => n.id === val);
  formRecordDialog.tractor = obj[0].card;
};
// 地点点击事件
const changeselect = (value: string, type: string) => {
  formProjectDialog[type as keyof typeof formProjectDialog] =
    location.value.filter((val: any) => val.name === value)[0]?.id;
};
const changeTranType = (value: string) => {
  console.log(tranTypelist.value);
  formProjectDialog.tranType = tranTypelist.value.filter(
    (val: any) => val.value === Number(value)
  )[0]?.label;
  console.log(formProjectDialog.tranType);
};
// 项目名称change
const changeProject = async (value: number) => {
  await stationList(value);
  const { data } = await lineInfoList({ projectCode: value });
  lineOptions.value = data;
  formProjectDialog.routeCode = undefined;
  formProjectDialog.startStation = "";
  formProjectDialog.endStation = "";
};
const handleUseSizeChange = (value: number) => {
  form.pageSize = value;
  getStatList();
};
const handleUseCurrentChange = (value: number) => {
  form.pageNum = value;
  getStatList();
};
const getStatList = async () => {
  state.loading = true;
  try {
    const { data } = await dispatchOrder(form);
    state.total = data.total;
    tableData.value = data.list;
    state.loading = false;
  } catch (e: any) {
    ElMessage.error(e.message);
    state.loading = false;
  }
};
// 在职司机
let onDriverList = reactive([]);
const onDriver = async ()=>{
  onDriverList.length = 0;
  try{
    const { data } = await driverPage({driverType: 'on',pageSize:9999}, "/api/v1/driver/page");
    Object.assign(onDriverList,data.list)
  } catch(e:any){
    ElMessage.error(e.message)
  }
}
// 司机姓名
const driverOptions = ref<Options[]>([]);
// 线路名称
const licenseOptions = ref<Options[]>([]);
// 牵引车牌
const tractorOptions = ref<Options[]>([]);
// 客户名称
const cooperateOptions = ref<Options[]>([]);
// 项目名称
const projectOption = ref<Options[]>([]);
onMounted(() => {
  Promise.all([
    driverList(),
    tractorList(),
    cooperateList(),
    lineInfoList({}),
    projectList(),
  ])
    .then((res) => {
      res.map((n, index) => {
        if (index === 0) {
          n.data.map((i: any) => {
            driverOptions.value.push({ value: i.id, label: i.name, ...i });
          });
        } else if (index === 1) {
          n.data.map((i: any) => {
            tractorOptions.value?.push({ value: i.id, label: i.card, ...i });
          });
        } else if (index === 2) {
          n.data.map((i: any) => {
            cooperateOptions.value?.push({ value: i.id, label: i.name });
          });
        } else if (index === 3) {
          n.data.map((i: any) => {
            licenseOptions.value?.push({ value: i.id, label: i.name });
          });
        } else if (index === 4) {
          n.data.map((i: any) => {
            projectOption.value?.push({ value: i.id, label: i.name });
          });
        }
      });

      Object.assign(list, [
        {
          type: "selectValue",
          label: "客户名称",
          prop: "customerCode",
          placeholder: "请选择客户名称",
          optionList: cooperateOptions,
        },
        {
          type: "selectValue",
          label: "线路名称",
          prop: "routeCode",
          placeholder: "请选择线路名称",
          optionList: licenseOptions,
        },
        {
          type: "selectValue",
          label: "项目名称",
          prop: "projectCode",
          placeholder: "请选择项目名称",
          optionList: projectOption,
        },
        {
          type: "selectValue",
          label: "订单类型",
          prop: "orderType",
          placeholder: "请选择订单类型",
          optionList: [
            {
              label: "手动",
              value: 0,
            },
            {
              label: "自动",
              value: 1,
            },
          ],
        },

        {
          type: "pickerDate",
          label: "订单日期",
          prop: ["startTime", "endTime"],
          placeholder: "请选择订单日期",
        },
        {
          type: "selectValue",
          label: "司机姓名",
          prop: "driverCode",
          placeholder: "请选择司机姓名",
          optionList: driverOptions,
        },
        {
          type: "selectValue",
          label: "车牌号码",
          prop: "tractorCode",
          placeholder: "请选择车牌号码",
          optionList: tractorOptions,
        },
        {
          type: "select",
          label: "运输类型",
          prop: "tranType",
          placeholder: "请选择运输类型",
          optionList: tranTypelist,
        },
        {
          type: "selectValue",
          label: "订单状态",
          prop: "status",
          placeholder: "请选择订单状态",
          optionList: [
            {
              label: "已到达",
              value: 3,
            },
            {
              label: "已发车",
              value: 2,
            },
            {
              label: "已下发",
              value: 1,
            },
            {
              label: "已创建",
              value: 0,
            },
          ],
        },
        {
          type: "input",
          label: "订单编号",
          prop: "uuid",
          placeholder: "请输入订单编号",
        },
        {
          type: "selectValue",
          label: "异常里程1%",
          prop: "exMileageFilter",
          placeholder: "过滤异常里程",
          optionList: [
            {
              label: "是",
              value: true,
            },
            {
              label: "否",
              value: false,
            },
          ],
        },
      ]);
    })
    .catch((er) => {
      console.log(er);
    });

  getStatList();
  getOption("tran_type");
});
// 运输类型
const tranTypelist = ref<Options[]>([]);
const setDictionary = dictionary();
const getOption = async (type: string) => {
  const { data } = await getOptions(type);
  data.map((n: { label: string; value: Number }) => {
    n.value = Number(n.value);
  });
  setDictionary.setDictionaryList("tranType", data);
  tranTypelist.value = data;
};
const sortChange = (column: any) => {
  form.orderDateSort = column.order
    ? column.order === "descending"
      ? "asc"
      : "desc"
    : "";
  getStatList();
};
// 查询form
let list: AssemblyForm[] = reactive([]);

interface User {
  date: string;
  name: string;
  address: string;
}

const selectable = (row: any, index: any) => {
  // false是禁止选中

  // let bool = row.status == 3 ? true : row.costDriverStatus == 0? true : false;
  // console.log(bool)
  let bool = row.status == 3;
  return bool;
};
const tableData: any = ref([]);
const fileDriverStatus = (val: number) => {
  let status = ["未结算", "已结算"];
  return status[val];
};
const fileStatus = (val: number) => {
  let status = ["已创建", "已下发", "已发车", "已到达"];
  return status[val];
};
const fileType = (val: number) => {
  let status = ["手动", "自动"];
  return status[val];
};
const fileTime = (time: string) => {
  return /\d{4}-\d{1,2}-\d{1,2}/g.exec(time)?.toString();
};
const onSubmit = () => {
  getStatList();
};
const restFunction = () => {
  form.orderType = null;
  form.startTime = "";
  form.endTime = "";
};
const collapseExpand = (val: boolean) => {
  val ? (height.value = height.value + 50) : (height.value = height.value - 50);
};
// 项目查询
const getProjectList = async () => {
  projectOption.value = [];
  const { data } = await projectList();
  data.map((n: any) => {
    projectOption.value?.push({ label: n.name, value: n.id });
  });
};
const searchInput = () => {
  getStatList();
};
const newBuilt = () => {
  
  state.dialogVisible = true;
  state.dialogTitle = "新增";
  formProjectDialog.tranType = '载货';
  state.step = 0;
  console.log(formProjectDialog)
  formProjectDialog.id = undefined;
  
  // watchRules(projectFormRef.value)
};
// 行内点击事件

const rowClick = (row: any) => {};
const returnList = () => {
  state.import = false;
  state.built = true;
};
const importVehicle = (type: string) => {
  if (type === "完整") {
    state.apiFn = importDispatchOrder;
    state.downFn = dispatchOrderTemplate;
  } else {
    state.apiFn = importDispatchOrderBase;
    state.downFn = dispatchOrderTemplateBase;
  }
  state.import = true;
};
// 导出
const exportVehicle = () => {
  exportFile(form, "/api/v1/dispatchOrder/_export");
};
// 修改
const builtRow: any = ref({});
const editClick = async (index: number, row: any) => {
  if (row.status === 0) {
    state.dialogTitle = "编辑";
    state.editLoading = true;
    try {
      state.dialogVisible = true;
      state.step = 0;
      await changeProject(row.projectCode);

      Object.assign(formProjectDialog, row);
      setStationList(row);
      formRecordDialog.firstDriver = row.firstDriver;
      formRecordDialog.firstDriverCode = row.firstDriverCode;
      formRecordDialog.firstDriverPhone = row.firstDriverPhone;
      formRecordDialog.secondDriver = row.secondDriver;

      formRecordDialog.secondDriverCode = row.secondDriverCode;
      formRecordDialog.secondDriverPhone = row.secondDriverPhone;
      formRecordDialog.secondDriver = row.secondDriver;
      formRecordDialog.driverType = row.driverType;
      formRecordDialog.tractorCode = row.tractorCode;
      formRecordDialog.tractor = row.tractor;

      state.editDisabled = false;
      state.editLoading = false;
    } catch (e: any) {
      ElMessage.error(e.message);
      state.editLoading = false;
    }
  } else {
    state.built = false;
    builtRow.value = row;
  }
};
// 历史轨迹
const history = async (index: number, row: any) => {
  const { data } = await dispatchOrderId(row.id);
  let routeLine = '';
  data.stations?.map((n:any,index:number)=>{
    let y = index === 0 ? '':' - '
    routeLine+=(y+n.station);
  })
  state.rowHistory = row;
  state.rowHistory.routeLine = routeLine;
  state.projectLoading = true;
};

const multipleSelection = ref<User[]>([]);
state.refer = computed(() => {
  return multipleSelection.value.reduce(
    (accumulator, currentValue) =>
      calculate(
        Number(accumulator),
        Number(currentValue.referenceFuelNum),
        "+"
      ),
    0
  );
});
state.reality = computed(() => {
  return multipleSelection.value.reduce(
    (accumulator, currentValue) =>
      calculate(Number(accumulator), Number(currentValue.useFuelNum), "+"),
    0
  );
});
state.additional = computed(() => {
  return calculate(state.reality, state.refer, "-");
});
const handleSelectionChange = (val: User[]) => {
  multipleSelection.value = val;
  console.log(multipleSelection.value);
};

const issuanceOrder = (val: string) => {
  const arr = Array.from(multipleSelection.value, (item: any) => item.id).join(
    ","
  );
  val === "issuance" ? dispatch(arr) : handleDelete(arr);
};

const CancelDistribution = async (index: number, row: any) => {
  try {
    const { data } = await undoPush(row.id);
    ElMessage.success("取消下发成功");
    getStatList();
  } catch (e: any) {
    ElMessage.error(e.message);
  }
};
// 批量下发与单个下发
const distribute = (index: number, row: any) => {
  dispatch(row.id);
};
const dispatch = async (ids: string | undefined) => {
  try {
    const { data } = await dispatchOrderPush(ids);
    getStatList();
    ElMessage.success("下发成功");
  } catch (e: any) {
    ElMessage.error(e.message);
  }
};
// 批量删除与单个删除
const handleDelete = async (ids: any) => {
  await deleteTractor(ids, "/api/v1/dispatchOrder/");
  getStatList();
};

// 新建订单弹出框
const projectFormRef = ref<FormInstance>();
let formProjectDialog = reactive<DispatchOrder>({
  project: "",
  projectCode: undefined,
  orderDate: "",
  route: "",
  routeCode: undefined,
  startStation: "",
  startCode: undefined,
  endStation: "",
  endCode: undefined,
  waypoints: "",
  waypointCodes: undefined,
  tranType: "载货",
  tranTypeCode: 1,
  // firstDriver: "",
  // firstDriverCode: undefined,
  // firstDriverPhone: "",
  // tractor: "",
  // tractorCode: undefined,
  customer: "",
  customerCode: undefined,
  upAmount: undefined,
  upMileage: undefined,
  upTime: undefined,
  upFuelNum: undefined,
  upUreaNum: undefined,
  upHighAmount: undefined,
  // upFirstDriverAmount: undefined,
  // upSecondDriverAmount: undefined,
  // driverType: undefined
});
const recordFormRef = ref<FormInstance>();
let formRecordDialog = reactive<RecordOrder>({
  driverType: 2,
  tractor: "",
  tractorCode: undefined,
  // 主驾
  firstDriver: "",
  // 主驾编码
  firstDriverCode: undefined,
  // 主驾费用
  upFirstDriverAmount: undefined,
  firstDriverPhone: "",
  // 副驾
  secondDriver: "",
  // 副驾编码
  secondDriverCode: undefined,
  // 副驾费用
  upSecondDriverAmount: undefined,
  secondDriverPhone: "",
});
watch(
  [() => formProjectDialog, () => formRecordDialog],
  ([newValue, oldValue]) => {
    state.step === 0
      ? watchRules(projectFormRef.value)
      : watchRules(recordFormRef.value);
  },
  {
    deep: true,
  }
);

const watchRules = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    state.step === 0
      ? (state.submitFormDisabled = valid)
      : (state.submitRecord = valid);
  });
};
const rulesProjectDialog = {
  tranTypeCode: [
    {
      required: true,
      message: "请选择运输类型",
      trigger: "change",
    },
  ],
  projectCode: [
    {
      required: true,
      message: "请输入项目名称",
      trigger: "change",
    },
  ],
  orderDate: [
    {
      required: true,
      message: "请选择订单日期",
      trigger: "change",
    },
  ],
  routeCode: [
    {
      required: true,
      message: "请选择路线名称",
      trigger: "change",
    },
  ],
  startStation: [
    {
      required: true,
      message: "请选择起运地点",
      trigger: "change",
    },
  ],
  endStation: [
    {
      required: true,
      message: "请选择目的地点",
      trigger: "change",
    },
  ],
};
const nextStep = async () => {
  let label = [];
  let value = [];
  for (let item of waypointList.value) {
    label.push(item.label);
    value.push(item.value);
  }
  formProjectDialog.waypoints = label.join(",");
  formProjectDialog.waypointCodes = value.join(",");
  await onDriver()
  state.step = 1;
  await nextTick();
  watchRules(recordFormRef.value);
  
  getThreeRoute();
};
const routeList: any = ref([]);
const getThreeRoute = async () => {
  try {
    const { data } = await threeRoute(formProjectDialog.routeCode);
    routeList.value = data;
  } catch (e: any) {
    ElMessage.error(e.message);
  }
};
const closeDialog = () => {
  state.editDisabled = true;
  projectFormRef.value?.resetFields();
  recordFormRef.value?.resetFields();
};
const cancellation = () => {
  state.dialogVisible = false;
  state.intelligentSwitch = false;
};
const cancelBuit = (refresh: boolean) => {
  state.built = true;
  if (refresh) {
    getStatList();
  }
};
const rulesRecordDialog = {
  driverType: [
    {
      required: true,
      message: "",
      trigger: "change",
    },
  ],
  tractorCode: [
    {
      required: true,
      message: "",
      trigger: "change",
    },
  ],
  firstDriverCode: [
    {
      required: true,
      message: "",
      trigger: "change",
    },
  ],
  upFirstDriverAmount: [
    {
      required: true,
      message: "",
      trigger: "change",
    },
  ],
  secondDriverCode: [
    {
      required: true,
      message: "",
      trigger: "change",
    },
  ],
  upSecondDriverAmount: [
    {
      required: true,
      message: "",
      trigger: "change",
    },
  ],
};
const numId = ref("");
const numClick = (id: string) => {
  numId.value = id;
  state.feeOilAppear = true;
};

const recordCancellation = () => {
  state.step = 0;
};
const recordNextStep = async () => {
  if (formRecordDialog.driverType === 1) {
    formRecordDialog.secondDriverCode = null;
    formRecordDialog.secondDriverPhone = "";
    formRecordDialog.secondDriver = "";
  }
  Object.assign(formProjectDialog, formRecordDialog);
  try {
    const { data } = await newDispatchOrder(formProjectDialog as NewDispatch);
    state.dialogVisible = false;
    getStatList();
  } catch (e: any) {
    ElMessage.error(e.message);
  }
};
const preOrderDate = ref("");
const sureClick = async () => {
  try {
    const { data } = await smartSchedule({ preOrderDate: preOrderDate.value });
    ElMessage.success("订单生成成功");
    state.loading = false;
    state.intelligentSwitch = false;
    form.orderType = 1;
    form.picker = [preOrderDate.value, preOrderDate.value];
    getStatList();
  } catch (e: any) {
    state.loading = false;
    ElMessage.error(e.message);
  }
};
const dateRangePickerOptions = (time: any) => {
  return time.getTime() < Date.now() - 8.64e7;
};
const intelligent = () => {
  preOrderDate.value = "";
  state.intelligentSwitch = true;
};
const fuelList = ref([]);
const notes = ref("");
const getCostFuelList = async () => {
  state.supplementLoading = true;

  const arr = Array.from(multipleSelection.value, (item: any) => item.id);
  const parmes = new FormData();
  parmes.append("orderIds", arr);
  try {
    const { data } = await costFuelList(parmes);
    fuelList.value = data;
    state.supplementLoading = false;
  } catch (e: any) {
    ElMessage.error(e.message);
    state.intelligentSwitch = false;
    state.supplementLoading = false;
  }
};
const supplementSure = async () => {
  fuelList.value.map((n) => {
    n.remark = notes.value;
  });
  try {
    const { data } = await expenseAdd(fuelList.value);
    state.supplementDialog = false;
    getStatList();
  } catch (e: any) {
    ElMessage.error(e.message);
  }
};
const cancellSupplement = () => {
  state.supplementDialog = false;
};
const supplement = () => {
  state.supplementDialog = true;
  notes.value = "";
  getCostFuelList();
};
const uploadList = () => {
  state.feeOilAppear = false;
  getStatList();
};
</script>
<style scoped lang="scss">
.round {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 6px;
  vertical-align: middle;
}
.roundColor0 {
  background: #bbbbbb;
}
.roundColor3 {
  background: #3270ff;
}
.roundColor1 {
  background: #ffb608;
}
.roundColor2 {
  background: green;
}
.text-color{
  color: #337ecc;
}
:deep(.newDialogClass .el-dialog__header) {
  border-bottom: 1px solid lightgray;
  margin: 0 22px;
  padding: 20px 0 10px;
}
:deep(.newDialogClass .el-dialog__body) {
  padding: 10px var(--el-dialog-padding-primary);
}
.steps {
  text-align: center;
  margin-top: 20px;
  margin-bottom: 30px;
  .steps-inline {
    display: inline-block;
    width: 30px;
    text-align: center;
    line-height: 30px;
    border-radius: 50%;
  }
  .steps-blue {
    background: #409eff;
    color: #fff;
  }
  .steps-lightgray {
    border: 1px solid lightgray;
    color: #303030;
  }
  .steps-text {
    color: #303030;
    font-size: 16px;
    margin-left: 10px;
  }
  .steps-border {
    width: 200px;
    height: 1px;
    display: inline-block;
    background: lightgray;
    vertical-align: middle;
    margin: 0 20px;
  }
  .steps-check {
    border: 1px solid #409eff;
    color: #409eff;
    font-size: 16px;
  }
  .steps-border-check {
    background: #409eff;
  }
}
.record-title {
  color: #303030;
  font-size: 15px;
  margin-bottom: 12px;
}
.record-content {
}
.record-ev {
  border: 1px solid lightgray;
  position: relative;
}
.record-text {
  font-size: 12px;
  color: #303030;
  margin: 0 14px 10px;
}
.record-bold-text {
  font-size: 16px;
  font-weight: 600;
  margin: 12px 14px;
}
.record-state {
  position: absolute;
  top: 0;
  right: 0;
}
.trajectory {
  width: 100%;
  height: 600px;
}
.set-height {
  overflow: auto;
}
.hide-form {
  overflow: hidden;
}
.map-content {
  height: calc(100% - 72px);
}
.set-height {
  height: calc(100% - 16px);
}
.app-container {
  height: 100%;
}
:deep(.el-form-item.is-error .el-input__wrapper) {
  box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color))
    inset;
}
:deep(.el-table th) {
  background-color: #f6f9ff;
  color: #303030;
}
:deep(.el-breadcrumb__inner) {
  font-size: 14px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
}
.property {
  text-align: right;
}
.span-color {
  color: #606060;
  font-size: 14px;
  line-height: 32px;
  display: inline-block;
  vertical-align: top;
}
.text-span {
  color: #303030;
  font-size: 16px;
  line-height: 32px;
  font-weight: 600;
  text-align: left;
  display: inline;
}
.red-color {
  :deep(.el-input__inner) {
    color: red;
  }
}
.warning-color {
  color: #73767a;
}
</style>
