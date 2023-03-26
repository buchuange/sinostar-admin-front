<template>

  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="3" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息" icon="el-icon-info" />
      <el-step title="创建课程大纲" icon="el-icon-edit" />
      <el-step title="最终发布" icon="el-icon-upload" />
    </el-steps>

    <div class="ccInfo">
      <img :src="coursePublish.cover">
      <div class="main">
        <h1>{{ coursePublish.title }}</h1>
        <p><span>所属分类：{{ coursePublish.subjectDetail }}</span></p>
        <p>课程教师：{{ coursePublish.teacherName }}</p>
        <p>
          <span>上传于：{{ coursePublish.createTime }}</span>
          <span style="margin-left: 20px">共{{ coursePublish.lessonNum }}课时</span>
        </p>
        <h3 class="red">课程价格：￥{{ coursePublish.price }}</h3>
      </div>
    </div>

    <div align="center">
      <el-button @click="previous">返回修改</el-button>
      <el-button :disabled="saveBtnDisabled" type="primary" @click="publish">
        {{ coursePublish.status === '0' ? '发布课程' : "取消发布" }}
      </el-button>
    </div>
  </div>
</template>

<script>

import {getCourse, publishCourse} from '@/api/edu/course/course'

export default {
  data() {
    return {
      saveBtnDisabled: false, // 保存按钮是否禁用
      courseId: '', // 所属课程
      coursePublish: {}
    }
  },

  created() {
    this.init()
  },

  methods: {
    init() {
      if (this.$route.params && this.$route.params.id) {
        this.courseId = this.$route.params.id
        // 根据id获取课程基本信息
        this.fetchCoursePublishInfoById()
      }
    },

    fetchCoursePublishInfoById() {
      getCourse(this.courseId).then(response => {
        this.coursePublish = response
      })
    },
    previous() {
      this.$router.push({
        path: '/course/chapter/' + this.courseId
      })
    },

    publish() {
      if (this.coursePublish.status == '0') {
        this.$modal.confirm('是否确认发布课程【' + this.coursePublish.title + '】？').then(() => {
          publishCourse(this.courseId).then(response => {
            this.$modal.msgSuccess('发布成功')
            this.$router.push({ path: '/course/list' })
          })
        }).catch(() => {
          this.$modal.msg('已取消操作')
        })
      } else {
        this.$modal.confirm('是否取消发布课程【' + this.coursePublish.title + '】？').then(() => {
          publishCourse(this.courseId).then(response => {
            this.$modal.msgSuccess('取消成功')
            this.$router.push({ path: '/course/list' })
          })
        }).catch(() => {
          this.$modal.msg('已取消操作')
        })
      }
    }
  }
}
</script>

<style scoped>
.ccInfo {
  background: #d1dbe5;
  padding: 20px;
  overflow: hidden;
  border: 1px dashed #DDD;
  margin-bottom: 40px;
  position: relative;
}

.ccInfo img {
  background: #d6d6d6;
  width: 500px;
  height: 278px;
  display: block;
  float: left;
  border: none;
}

.ccInfo .main {
  margin-left: 520px;
}

.ccInfo .main h2 {
  font-size: 28px;
  margin-bottom: 30px;
  line-height: 1;
  font-weight: normal;
}

.ccInfo .main p {
  margin-bottom: 10px;
  word-wrap: break-word;
  line-height: 24px;
  max-height: 48px;
  overflow: hidden;
}

.ccInfo .main p {
  margin-bottom: 10px;
  word-wrap: break-word;
  line-height: 24px;
  max-height: 48px;
  overflow: hidden;
}

.ccInfo .main h3 {
  left: 540px;
  bottom: 20px;
  line-height: 1;
  font-size: 28px;
  color: #d32f24;
  font-weight: normal;
  position: absolute;
}
</style>
