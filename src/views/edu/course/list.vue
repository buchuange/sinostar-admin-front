<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" size="small" :inline="true">
      <el-form-item label="课程列表" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入课程标题"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item prop="subjectId" label="课程类别">
        <treeselect
          style="width: 350px"
          v-model="queryParams.subjectId"
          :options="subjectOptions"
          :normalizer="normalizer"
          placeholder="请选择课程类别"
        />
      </el-form-item>
      <el-form-item label="课程教师" prop="teacherId">
        <el-select
          style="width: 240px"
          v-model="queryParams.teacherId"
          clearable
          placeholder="请选择课程教师"
          filterable
          remote
          :filter-method="dataFilter"
        >
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.teacherName"
            :value="teacher.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="课程状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择课程状态"
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
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <div style="display: inline-flex">
      <el-button
        type="primary"
        plain
        icon="el-icon-plus"
        size="mini"
        @click="handleAdd"
      >发布课程
      </el-button>
      <right-toolbar :show-search.sync="showSearch" :columns="columns" @queryTable="getList"/>
    </div>
    <el-table
      v-loading="loading"
      style="margin-top: 10px"
      :data="courseList"
      :header-cell-style="{background:'#eef1f6',color:'#606266'}"
      @selection-change="handleSelectionChange"
    >
      <el-table-column label="序号" type="index" width="50"/>
      <el-table-column v-if="columns[0].visible" label="课程标题" prop="title" :show-overflow-tooltip="true"
                       width="120"/>
      <el-table-column v-if="columns[1].visible" label="课程类别" prop="subjectDetail" :show-overflow-tooltip="true"
                       width="160"/>
      <el-table-column v-if="columns[2].visible" label="课程教师" prop="teacherName" :show-overflow-tooltip="true"
                       width="120"/>
      <el-table-column v-if="columns[3].visible" prop="chargeStatus" label="是否收费" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.chargeStatus == '0' ? '' : 'danger'">{{ scope.row.chargeStatusDetail }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column v-if="columns[4].visible" label="购买人数" prop="buyCount" :show-overflow-tooltip="true"
                       width="100"/>
      <el-table-column v-if="columns[5].visible" label="浏览次数" prop="viewCount" :show-overflow-tooltip="true"
                       width="100"/>
      <el-table-column v-if="columns[6].visible" prop="status" label="状态" width="80">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status == '0' ? 'info' : 'success'">{{ scope.row.statusDetail }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column v-if="columns[7].visible" label="创建时间" align="center" prop="createTime" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除
          </el-button>
          <el-dropdown size="mini" @command="(command) => handleCommand(command, scope.row)">
            <el-button size="mini" type="text" icon="el-icon-d-arrow-right">更多</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                command="createChapter"
                icon="el-icon-key"
              >创建课程大纲
              </el-dropdown-item>
              <el-dropdown-item
                command="publishCourse"
                icon="el-icon-circle-check"
              >最终发布
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
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

import {delCourse, listCourse} from '@/api/edu/course/course'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {queryTeacherList} from "@/api/edu/teacher/teacher";
import {listSubject} from "@/api/edu/subject/subejct";

export default {
  name: 'Course',
  components: {Treeselect},
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
      courseList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 是否显示弹出层（数据权限）
      openDataScope: false,
      menuExpand: false,
      menuNodeAll: false,
      deptExpand: true,
      deptNodeAll: false,
      // 课程类别树选项
      subjectOptions: [],
      // 查询参数
      selectParam: {},
      // 数据范围选项
      statusScopeOptions: [
        {
          value: '0',
          label: '草稿'
        },
        {
          value: '1',
          label: '发布'
        }
      ],
      // 查询参数
      queryParams: {
        current: 1,
        size: 10,
        title: undefined,
        status: undefined,
        subjectId: undefined,
        teacherId: undefined
      },
      // 列信息
      columns: [
        {key: 0, label: `课程标题`, visible: true},
        {key: 1, label: `课程类别`, visible: true},
        {key: 2, label: `课程教师`, visible: true},
        {key: 3, label: `是否收费`, visible: true},
        {key: 4, label: `购买人数`, visible: true},
        {key: 5, label: `浏览次数`, visible: true},
        {key: 6, label: `状态`, visible: true},
        {key: 7, label: `创建时间`, visible: true}
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      teacherList: [],
      searchList: []
    }
  },
  created() {
    this.getList()
    this.getSubjectTree()
    this.getTeacherList()
  },
  methods: {
    /** 查询课程列表 */
    getList() {
      this.loading = true
      listCourse(this.queryParams).then(response => {
        this.courseList = response.data
        this.total = response.pagination.total
        this.loading = false
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
      this.$refs['queryForm'].resetFields()
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.codes = selection.map(item => item.teacherCode)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    // 更多操作触发
    handleCommand(command, row) {
      console.log(row)
      switch (command) {
        case 'createChapter':
          this.$router.push({path: '/course/chapter/' + row.id})
          break
        case 'publishCourse':
          this.$router.push({path: '/course/publish/' + row.id})
          break
        default:
          break
      }
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.$router.push({path: '/course/info'})
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.$router.push({path: '/course/info/' + row.id})
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$modal.confirm('是否确认删除课程标题为【' + row.title + '】的数据项？').then(function () {
        return delCourse(row.id)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {
        this.$modal.msg('已取消删除')
      })
    },
    /** 转换课程类别数据结构 */
    normalizer(node) {
      if (!node.children || !node.children.length) {
        delete node.children
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children
      }
    },
    /** 初始化所有教师 */
    getTeacherList() {
      queryTeacherList().then(response => {
        this.teacherList = response
        this.searchList = response
      })
    },
    /** 初始化课程类别 */
    getSubjectTree() {
      listSubject(this.selectParam).then(response => {
        this.subjectOptions = response
      })
    },
    /** 下拉课程教师时可以搜索 */
    dataFilter(val) {
      this.teacherList = val
      if (val) { // val存在
        this.teacherList = this.searchList.filter((item) => {
          if (!!~item.teacherName.indexOf(val) || !!~item.teacherName.toUpperCase().indexOf(val.toUpperCase())) {
            return true
          }
        })
      } else { // val为空时，还原数组
        this.teacherList = this.searchList
      }
    }
  }
}
</script>
