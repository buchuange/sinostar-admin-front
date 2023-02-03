<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" size="small" :inline="true">
      <el-form-item label="课程类别名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入课程类别名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="课程类别状态" clearable>
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

    <div style="display: flex">
      <el-button
        type="primary"
        plain
        icon="el-icon-plus"
        size="mini"
        @click="handleAdd"
      >新增
      </el-button>
      <el-button
        type="info"
        plain
        icon="el-icon-sort"
        size="mini"
        @click="toggleExpandAll"
      >展开/折叠
      </el-button>
      <right-toolbar :show-search.sync="showSearch" @queryTable="getList"></right-toolbar>
    </div>

    <el-table
      v-if="refreshTable"
      v-loading="loading"
      :data="subjectList"
      row-key="id"
      :default-expand-all="isExpandAll"
      :header-cell-style="{background:'#eef1f6',color:'#606266'}"
      style="margin-top: 10px"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="name" label="课程类别名称" width="260" :show-overflow-tooltip="true"/>
      <el-table-column prop="description" label="描述" width="260" :show-overflow-tooltip="true"/>
      <el-table-column prop="orderNum" label="排序" width="120"/>
      <el-table-column prop="status" label="状态" width="120">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status == '0' ? '' : 'danger'">{{ scope.row.statusDetail }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="200">
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
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
          >新增
          </el-button>
          <el-button
            v-if="!scope.row.children"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改课程类别框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col v-if="form.parentId !== '0'" :span="24">
            <el-form-item label="上级类别" prop="parentId">
              <treeselect v-model="form.parentId" :options="subjectOptions" :normalizer="normalizer"
                          placeholder="选择上级类别"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="类别名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入类别名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="orderNum">
              <el-input-number v-model="form.orderNum" controls-position="right" :min="0"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="类别描述" prop="teacherIntro">
          <el-input v-model="form.description" :autosize="{ minRows: 3, maxRows: 5}" type="textarea"
                    placeholder="请输入类别描述"/>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="类别状态">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in statusScopeOptions"
                  :key="dict.value"
                  :label="dict.value"
                >{{ dict.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { delSubject, listSubject, addSubject, updateSubject, getSubject, listExcludeSubject } from '@/api/edu/subejct'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: 'Subject',
  components: { Treeselect },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 表格树数据
      subjectList: [],
      // 类别树选项
      subjectOptions: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 是否展开，默认全部展开
      isExpandAll: true,
      // 重新渲染表格状态
      refreshTable: true,
      // 查询参数
      queryParams: {},
      selectParams: {},
      // 表单参数
      form: {
        orderNum: 0
      },
      statusScopeOptions: [
        {
          value: '0',
          label: '正常'
        },
        {
          value: '1',
          label: '停用'
        }
      ],
      // 表单校验
      rules: {
        name: [
          { required: true, message: '类别名称不能为空', trigger: 'blur' }
        ],
        orderNum: [
          { required: true, message: '显示排序不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询类别列表 */
    getList() {
      this.loading = true
      listSubject(this.queryParams).then(response => {
        this.subjectList = response
        this.loading = false
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
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        orderNum: 0,
        status: '0'
      }
      if (this.$refs['form']) {
        this.$refs['form'].resetFields()
      }
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.$refs['queryForm'].resetFields()
      this.handleQuery()
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset()
      if (row !== undefined) {
        this.form.parentId = row.id
      }
      this.open = true
      this.title = '添加课程类别'
      listSubject(this.selectParams).then(response => {
        this.subjectOptions = response
      })
    },
    /** 展开/折叠操作 */
    toggleExpandAll() {
      this.refreshTable = false
      this.isExpandAll = !this.isExpandAll
      this.$nextTick(() => {
        this.refreshTable = true
      })
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      getSubject(row.id).then(response => {
        this.form = response
        this.open = true
        this.title = '修改课程类别'
      })
      listExcludeSubject(row.id).then(response => {
        this.subjectOptions = response
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateSubject(this.form).then(response => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addSubject(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除类别名称为【' + row.name + '】的数据项？').then(function() {
        return delSubject(row.id)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {
      })
    }
  }
}
</script>
