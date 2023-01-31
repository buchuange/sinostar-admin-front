<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" size="small" :inline="true">
      <el-form-item label="讲师列表" prop="keyword">
        <el-input
          v-model="queryParams.keyword"
          placeholder="请输入讲师名称或编号"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="讲师头衔" prop="level">
        <el-select
          v-model="queryParams.level"
          placeholder="讲师头衔"
          clearable
          style="width: 240px"
        >
          <el-option
            v-for="item in levelScopeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
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
    </el-form>

    <div style="margin-top: 10px">
      <el-button
        type="primary"
        plain
        icon="el-icon-plus"
        size="mini"
        @click="handleAdd"
      >新增</el-button>
      <el-button
        type="success"
        plain
        icon="el-icon-edit"
        size="mini"
        :disabled="single"
        @click="handleUpdate"
      >修改</el-button>
      <el-button
        type="danger"
        plain
        icon="el-icon-delete"
        size="mini"
        :disabled="multiple"
        @click="handleDelete"
      >删除</el-button>
    </div>
    <RightToolBar :show-search.sync="showSearch" @queryTable="getList" :columns="columns"></RightToolBar>
    <el-table style="margin-top: 10px" v-loading="loading" :data="teacherList" @selection-change="handleSelectionChange"
              :header-cell-style="{background:'#eef1f6',color:'#606266'}">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="讲师名称" prop="teacherName" width="150" v-if="columns[0].visible" />
      <el-table-column label="讲师编号" prop="teacherCode" :show-overflow-tooltip="true" width="150" v-if="columns[1].visible" />
      <el-table-column label="讲师资历" prop="teacherCareer" :show-overflow-tooltip="true" width="150" v-if="columns[2].visible" />
      <el-table-column label="讲师头衔" prop="levelDetail" :show-overflow-tooltip="true" width="150" v-if="columns[3].visible" />
      <el-table-column label="手机号码" prop="phoneNumber" :show-overflow-tooltip="true" width="150" v-if="columns[4].visible" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180" v-if="columns[5].visible">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template v-if="scope.row.roleId !== 1" slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
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

    <!-- 添加或修改讲师配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="讲师名称" prop="teacherName">
              <el-input v-model="form.teacherName" placeholder="请输入讲师名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="讲师头衔" prop="level">
              <el-select
                v-model="form.level"
                placeholder="讲师头衔"
                clearable
                style="width: 240px"
              >
                <el-option
                  v-for="item in levelScopeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="phoneNumber">
              <el-input v-model="form.phoneNumber" placeholder="请输入手机号码" maxlength="11" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="讲师顺序" prop="orderNum">
              <el-input-number v-model="form.orderNum" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 讲师头像 -->
        <el-form-item label="讲师头像" prop="avatar">
          <!-- 头衔缩略图 -->
          <pan-thumb :image="form.avatar"/>
          <!-- 文件上传按钮 -->
          <el-button type="primary" icon="el-icon-upload" @click="imageCropperShow=true">更换头像
          </el-button>
          <!--
              v-show：是否显示上传组件
              :key：类似于id，如果一个页面多个图片上传控件，可以做区分
              :url：后台上传的url地址
              @close：关闭上传组件
              @crop-upload-success：上传成功后的回调
                <input type="file" name="file"/>
              -->
          <image-cropper v-show="imageCropperShow"
                         :width="300"
                         :height="300"
                         :key="imageCropperKey"
                         :url="BASE_API+'/api/file/upload?fileHost=avatar'"
                         field="file"
                         @close="close"
                         @crop-upload-success="cropSuccess"/>
        </el-form-item>
        <el-form-item label="讲师资历" prop="teacherCareer">
          <el-input v-model="form.teacherCareer" placeholder="请输入讲师资历"/>
        </el-form-item>
        <el-form-item label="讲师简介" prop="teacherIntro">
          <el-input v-model="form.teacherIntro" :autosize="{ minRows: 2, maxRows: 5}" type="textarea"
                    placeholder="请输入讲师简介"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import { listTeacher, delTeacher, addTeacher, updateTeacher, getTeacher } from '@/api/edu/teacher'
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'
import RightToolBar from '@/components/RightToolBar'
import Pagination from '@/components/Pagination'

export default {

  components: { ImageCropper, PanThumb, RightToolBar, Pagination },

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
      teacherList: [],
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
      // 日期范围
      dateRange: [],
      // 数据范围选项
      levelScopeOptions: [
        {
          value: '1',
          label: '初级讲师'
        },
        {
          value: '2',
          label: '中级讲师'
        },
        {
          value: '3',
          label: '高级讲师'
        }
      ],
      // 查询参数
      queryParams: {
        current: 1,
        size: 10,
        keyword: undefined,
        level: undefined
      },
      // 列信息
      columns: [
        { key: 0, label: `讲师名称`, visible: true },
        { key: 1, label: `讲师编号`, visible: true },
        { key: 2, label: `讲师资历`, visible: true },
        { key: 3, label: `讲师头衔`, visible: true },
        { key: 4, label: `手机号码`, visible: true },
        { key: 5, label: `创建时间`, visible: true }
      ],
      // 表单参数
      form: {
        orderNum: 0,
        avatar: process.env.VUE_APP_OSS_PATH + '/avatar/default.jpg'
      },
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 表单校验
      rules: {
        teacherName: [
          { required: true, message: "讲师名称不能为空", trigger: "blur" },
          { min: 2, max: 20, message: '讲师名称长度必须介于 2 和 20 之间', trigger: 'blur' }
        ],
        level: [
          { required: true, message: "讲师头衔不能为空", trigger: "blur" }
        ],
        teacherCareer: [
          { required: true, message: "讲师资历不能为空", trigger: "blur" }
        ],
        phoneNumber: [
          {
            required: true,
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ]
      },
      imageCropperShow: false, // 上传弹框组件是否显示
      imageCropperKey: 0, // 上传组件id
      BASE_API: process.env.VUE_APP_BASE_API
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询讲师列表 */
    getList() {
      this.loading = true
      listTeacher(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.teacherList = response.data
        this.total = response.pagination.total
        this.loading = false
      }
      )
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        orderNum: 0,
        avatar: process.env.VUE_APP_OSS_PATH + '/avatar/default.jpg'
      }
      if (this.$refs['form']) {
        this.$refs['form'].resetFields()
      }
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.codes = selection.map(item => item.teacherCode)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加讲师'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const teacherId = row.id || this.ids[0]
      getTeacher(teacherId).then(response => {
        this.form = response
        this.open = true
        this.title = '修改讲师'
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateTeacher(this.form).then(response => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addTeacher(this.form).then(response => {
              this.$modal.msgSuccess('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const teacherCodes = row.teacherCode || this.codes
      const teacherIds = row.id || this.ids
      this.$modal.confirm('是否确认删除讲师编号为【' + teacherCodes + '】的数据项？').then(function() {
        return delTeacher(teacherIds)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {})
    },
    addDateRange(params, dateRange) {
      const search = params
      dateRange = Array.isArray(dateRange) ? dateRange : []
      search.createTimeStart = dateRange[0]
      search.createTimeEnd = dateRange[1]
      return search
    },
    /** 上传成功后的回调函数 */
    cropSuccess(data) {
      this.imageCropperShow = false
      this.form.avatar = data.url
      // 上传成功后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
      this.imageCropperKey = this.imageCropperKey + 1
    },
    /** 关闭上传组件 */
    close() {
      this.imageCropperShow = false
      // 上传失败后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
      this.imageCropperKey = this.imageCropperKey + 1
    }
  }
}
</script>
