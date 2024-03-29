<template>

  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息" icon="el-icon-info" />
      <el-step title="创建课程大纲" icon="el-icon-edit" />
      <el-step title="最终发布" icon="el-icon-upload" />
    </el-steps>

    <el-form ref="courseInfo" label-width="120px" :model="courseInfo" :rules="rules">
      <el-row>
        <el-col :span="23">
          <el-form-item label="课程标题" prop="title">
            <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="10">
          <!-- 课程类别 -->
          <el-form-item label="课程类别">
            <treeselect
              v-model="courseInfo.subjectId"
              :options="subjectOptions"
              :normalizer="normalizer"
              placeholder="请选择课程类别"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <!-- 课程教师 -->
          <el-form-item label="课程教师">
            <el-select
              v-model="courseInfo.teacherId"
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
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="10">
          <el-form-item label="总课时" prop="lessonNum">
            <el-input-number
              v-model="courseInfo.lessonNum"
              :min="0"
              controls-position="right"
              placeholder="请填写总课时数"
            />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="课程价格" prop="price">
            <el-input-number
              v-model="courseInfo.price"
              :min="0.00" :precision='2'
              controls-position="right"
              placeholder="免费课程请设置为0元"
            /> 元
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="是否收费" title="注：课程价格设置为0时默认为免费">
        <el-radio-group v-model="courseInfo.chargeStatus">
          <el-radio
            v-for="dict in statusScopeOptions"
            :key="dict.value"
            :label="dict.value"
          >{{ dict.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 课程封面-->
      <el-form-item label="课程封面">
        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :action="BASE_API+'/dl/support/api/file/upload?fileHost=cover'"
          class="avatar-uploader"
        >
          <img :src="courseInfo.cover" width="260px" height="180px">
        </el-upload>
      </el-form-item>

      <!-- 课程简介-->
      <el-form-item label="课程简介">
        <tinymce v-model="courseInfo.description" :height="300" />
      </el-form-item>

      <el-form-item align="right">
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存并下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>

import tinymce from '@/components/Tinymce'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { listSubject } from '@/api/edu/subject/subejct'
import { queryTeacherList } from '@/api/edu/teacher/teacher'
import { addCourse, getCourse, updateCourse } from '@/api/edu/course/course'

const defaultForm = {
  lessonNum: 0,
  cover: process.env.VUE_APP_OSS_PATH + '/cover/default.jpg',
  price: 0.00,
  chargeStatus: '0'
}

export default {
  name: 'Form',
  components: { tinymce, Treeselect },

  data() {
    return {
      // 课程类别树选项
      subjectOptions: [],
      // 查询参数
      queryParams: {},
      statusScopeOptions: [
        {
          value: '0',
          label: '默认（免费）'
        },
        {
          value: '1',
          label: '收费'
        }
      ],
      courseId: '',
      saveBtnDisabled: false, // 保存按钮是否禁用
      courseInfo: defaultForm,
      teacherList: [],
      searchList: [],
      BASE_API: process.env.VUE_APP_BASE_API, // 接口API地址
      // 表单校验
      rules: {
        title: [
          { required: true, message: '课程标题不能为空', trigger: 'blur' },
          { max: 30, message: '课程标题不能超过30个字', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '课程价格不能为空', trigger: 'blur' }
        ],
        lessonNum: [
          { required: true, message: '课程总课时不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    console.log('info created')
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id
      // 根据id获取课程基本信息
      this.getCourse()
    } else {
      this.courseInfo = { ...defaultForm }
    }
    this.getTeacherList()
    this.getSubjectTree()
  },
  methods: {
    /** 初始化所有教师 */
    getTeacherList() {
      queryTeacherList().then(response => {
        this.teacherList = response
        this.searchList = response
      })
    },
    /** 初始化课程类别 */
    getSubjectTree() {
      listSubject(this.queryParams).then(response => {
        this.subjectOptions = response
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
    /** 文件上传处理 */
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isLt2M
    },
    handleAvatarSuccess(res, file) {
      this.courseInfo.cover = res.url
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
    },
    // 根据id获取课程基本信息
    getCourse() {
      getCourse(this.courseId).then(response => {
        this.courseInfo = response
      }).catch(() => {})
    },
    saveOrUpdate: function() {
      this.$refs['courseInfo'].validate(valid => {
        if (valid) {
          // 判断是添加还是修改
          if (this.courseId === '') {
            this.saveCourse()
          } else {
            this.courseInfo.id = this.courseId
            this.updateCourse()
          }
        }
      })
    },
    // 添加课程
    saveCourse() {
      addCourse(this.courseInfo).then(response => {
        // 提示信息
        this.$modal.msgSuccess('保存成功')
        // 路由跳转到第二步
        this.$router.push({
          path: '/course/chapter/' + response.id
        })
      })
    },
    // 修改课程
    updateCourse() {
      updateCourse(this.courseInfo).then(response => {
        // 提示信息
        this.$modal.msgSuccess('修改成功')
        // 路由跳转到第二步
        this.$router.push({
          path: '/course/chapter/' + response.id
        })
      })
    }
  }
}
</script>

<style scoped>
.tinymce-container {
  line-height: 29px;
}
</style>
