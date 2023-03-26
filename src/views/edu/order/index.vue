<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" size="small" :inline="true">
      <el-form-item label="订单列表" prop="orderNo">
        <el-input
          v-model="queryParams.orderNo"
          placeholder="请输入订单编号"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- 课程教师 -->
      <el-form-item label="购买课程" prop="courseId">
        <el-select
          style="width: 240px"
          v-model="queryParams.courseId"
          clearable
          placeholder="请选择课程信息"
          filterable
          remote
          :filter-method="dataFilter"
        >
          <el-option
            v-for="course in courseList"
            :key="course.id"
            :label="course.title"
            :value="course.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="订单状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="订单状态"
          clearable
          style="width: 240px"
        >
          <el-option
            v-for="item in statusScopeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-row>
        <el-form-item label="创建时间">
          <el-date-picker
            v-model="dateRange"
            style="width: 240px"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <right-toolbar :show-search.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    <el-table style="margin-top: 40px" v-loading="loading" :data="orderList"
              :header-cell-style="{background:'#eef1f6',color:'#606266'}">
      <el-table-column label="序号" fixed type="index" width="80"/>
      <el-table-column label="订单编号" fixed prop="orderNo" :show-overflow-tooltip="true" width="240" v-if="columns[0].visible"/>
      <el-table-column label="会员昵称" prop="nickname" width="120" v-if="columns[1].visible"/>
      <el-table-column label="联系电话" prop="phoneNumber" width="120" v-if="columns[2].visible"/>
      <el-table-column label="购买课程" prop="courseTitle" :show-overflow-tooltip="true" width="180" v-if="columns[3].visible" />
      <el-table-column label="授课教师" prop="teacherName" :show-overflow-tooltip="true" width="120" v-if="columns[4].visible" />
      <el-table-column label="支付金额" prop="totalFee" :show-overflow-tooltip="true" width="120" v-if="columns[5].visible" />
      <el-table-column v-if="columns[6].visible" prop="status" label="订单状态" width="120">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status == '0' ? 'info' : 'success'">{{ scope.row.statusDetail }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="160" v-if="columns[7].visible">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.current"
      :limit.sync="queryParams.size"
      @pagination="getList"
    />
  </div>
</template>

<script>

import {delComment, listComment, queryCourseList} from "@/api/edu/course/comment";
import {delOrder, listOrder} from "@/api/edu/order";

export default {
  name: 'Comment',

  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      codes: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 角色表格数据
      orderList: [],
      // 日期范围
      dateRange: [],
      // 数据范围选项
      statusScopeOptions: [
        {
          value: '0',
          label: '待支付'
        },
        {
          value: '1',
          label: '已支付'
        }
      ],
      // 查询参数
      queryParams: {
        current: 1,
        size: 10,
        orderNo: undefined,
        courseId: undefined,
        status: undefined
      },
      courseList: [],
      searchList: [],
      // 列信息
      columns: [
        { key: 0, label: `订单编号`, visible: true },
        { key: 1, label: `会员昵称`, visible: true },
        { key: 2, label: `联系电话`, visible: true },
        { key: 3, label: `购买课程`, visible: true },
        { key: 4, label: `授课教师`, visible: true },
        { key: 5, label: `支付金额`, visible: true },
        { key: 6, label: `订单状态`, visible: true },
        { key: 7, label: `创建时间`, visible: true }
      ]
    }
  },
  created() {
    this.getList()
    this.getCourseList()
  },
  methods: {
    /** 查询评论列表 */
    getList() {
      this.loading = true
      listOrder(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.orderList = response.data
          this.total = response.pagination.total
          this.loading = false
        }
      )
    },
    /** 初始化所有课程 */
    getCourseList() {
      queryCourseList().then(response => {
        this.courseList = response
        this.searchList = response
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.current = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = []
      this.$refs['queryForm'].resetFields()
      this.handleQuery()
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const orderId = row.id
      this.$modal.confirm('是否确认删除订单编号为【' + row.orderNo + '】的数据项？').then(function() {
        return delOrder(orderId)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {
        this.$modal.msg('已取消删除')
      })
    },
    addDateRange(params, dateRange) {
      const search = params
      dateRange = Array.isArray(dateRange) ? dateRange : []
      search.createTimeStart = dateRange[0]
      search.createTimeEnd = dateRange[1]
      return search
    },
    /** 下拉课程教师时可以搜索 */
    dataFilter(val) {
      this.courseList = val
      if (val) { // val存在
        this.courseList = this.searchList.filter((item) => {
          if (!!~item.title.indexOf(val) || !!~item.title.toUpperCase().indexOf(val.toUpperCase())) {
            return true
          }
        })
      } else { // val为空时，还原数组
        this.courseList = this.searchList
      }
    }
  }
}
</script>
