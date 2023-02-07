<template>

  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息" icon="el-icon-info"/>
      <el-step title="创建课程大纲" icon="el-icon-edit"/>
      <el-step title="最终发布" icon="el-icon-upload"/>
    </el-steps>

    <div style="margin: 70px">
      <el-button type="text" @click="openChapterDialog">添加章节</el-button>
      <!-- 章节 -->
      <ul class="chapterList">
        <li v-for="chapter in chapterNestedList" :key="chapter.id">
          <p>
            {{ chapter.title }}
            <span class="acts">
              <el-button type="text" @click="openLessonDialog(chapter.id)">添加课时</el-button>
              <el-button type="text" @click="openEditChapterDialog(chapter.id)">编辑</el-button>
              <el-button type="text" @click="removeChapter(chapter)">删除</el-button>
            </span>
          </p>

          <!-- 视频 -->
          <ul class="chapterList lessonList">
            <li v-for="lesson in chapter.lessonList" :key="lesson.id">
              <p>
                {{ lesson.title }}
                <span class="acts">
                  <el-button type="text" @click="openEditLessonDialog(lesson.id)">编辑</el-button>
                  <el-button type="text" @click="removeLesson(lesson)">删除</el-button>
                </span>
              </p>
            </li>
          </ul>
        </li>
      </ul>
    </div>

    <div align="center">
      <el-button @click="previous">上一步</el-button>
      <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
    </div>

    <!-- 添加和修改章节表单 -->
    <el-dialog :visible.sync="dialogChapterFormVisible" :title="chapterFormTitle" width="600px" append-to-body>
      <el-form ref="chapter" :model="chapter" :rules="chapterRules" label-width="80px">
        <el-form-item label="章节标题" prop="title">
          <el-input v-model="chapter.title" placeholder="请输入章节标题"/>
        </el-form-item>
        <el-form-item label="章节排序" prop="orderNum">
          <el-input-number v-model="chapter.orderNum" :min="0" controls-position="right" placeholder="请输入章节排序"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
        <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 添加和修改课时表单 -->
    <el-dialog :visible.sync="dialogLessonFormVisible" :title="lessonFormTitle" width="700px" append-to-body>
      <el-form ref="lesson" :model="lesson" :rules="lessonRules" label-width="120px">
        <el-form-item label="课时标题" prop="title">
          <el-input v-model="lesson.title" placeholder="请输入课时标题"/>
        </el-form-item>
        <el-form-item label="课时排序" prop="orderNum">
          <el-input-number v-model="lesson.orderNum" :min="0" controls-position="right" placeholder="请输入课时标题"/>
        </el-form-item>
        <el-form-item label="是否免费" prop="chargeStatus">
          <el-radio-group v-model="lesson.chargeStatus">
            <el-radio
              v-for="dict in statusScopeOptions"
              :key="dict.value"
              :label="dict.value"
            >{{ dict.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上传视频">
          <el-upload
            :on-success="handleVodUploadSuccess"
            :on-remove="handleVodRemove"
            :before-remove="beforeVodRemove"
            :on-exceed="handleUploadExceed"
            :file-list="fileList"
            :action="BASE_API+'/dl/support/api/video/upload'"
            :limit="1"
            class="upload-demo"
          >
            <el-button size="small" type="primary">上传视频</el-button>
            <el-tooltip placement="right-end">
              <div slot="content">最大支持1G，<br>
                支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br>
                GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br>
                MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br>
                SWF、TS、VOB、WMV、WEBM 等视频格式上传
              </div>
              <i class="el-icon-question"/>
            </el-tooltip>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :disabled="saveLessonBtnDisabled" type="primary" @click="saveOrUpdateLesson">确 定</el-button>
        <el-button @click="dialogLessonFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import { addChapter, delChapter, getChapter, listChapter, updateChapter } from '@/api/edu/course/chapter'
import {addLesson, delLesson, getLesson, removeVideo, updateLesson} from '@/api/edu/course/lesson'

export default {
  data() {
    return {
      courseId: '', // 所属课程
      chapterNestedList: [], // 章节嵌套课时列表
      saveBtnDisabled: false, // 保存按钮是否禁用
      dialogChapterFormVisible: false, // 章节弹框
      chapterFormTitle: '', // 章节弹框标题
      chapter: {
        orderNum: 0
      }, // 封装章节数据
      // 章节表单校验
      chapterRules: {
        title: [
          { required: true, message: '章节标题不能为空', trigger: 'blur' }
        ],
        orderNum: [
          { required: true, message: '章节排序不能为空', trigger: 'blur' }
        ]
      },
      lessonFormTitle: '',
      chapterId: '', // 课时所在的章节id
      lesson: {
        chargeStatus: '0',
        orderNum: 0
      },
      lessonRules: {
        title: [
          { required: true, message: '课时标题不能为空', trigger: 'blur' }
        ],
        orderNum: [
          { required: true, message: '课时排序不能为空', trigger: 'blur' }
        ]
      },
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
      fileList: [], // 上传文件列表
      saveLessonBtnDisabled: false, // 课时按钮是否禁用
      dialogLessonFormVisible: false, // 是否显示课时表单
      BASE_API: process.env.VUE_APP_BASE_API // 接口地址
    }
  },

  created() {
    this.init()
  },

  methods: {
    // ==============================上传视频========================================
    // 成功回调
    handleVodUploadSuccess(response) {
      this.lesson.videoSourceId = response.videoSourceId
      this.lesson.videoOriginalName = response.videoOriginalName
      this.lesson.duration = response.videoDuration
      this.lesson.fileSize = response.size
    },
    // 视图上传多于一个视频
    handleUploadExceed(files, fileList) {
      this.$modal.msgWarning('请先删除已上传的视频')
    },
    beforeVodRemove(file, fileList) {
      return this.$modal.confirm('是否确认删除视频【' + file.name + '】？')
    },
    // 删除视频
    handleVodRemove(file, fileList) {
      console.log(file)
      removeVideo([this.lesson.videoSourceId]).then(response => {
        this.lesson.videoSourceId = ''
        this.lesson.videoOriginalName = ''
        this.lesson.duration = ''
        this.lesson.fileSize = 0
        this.lesson.status = 'Empty'
        this.fileList = []
        this.$modal.msgSuccess('删除成功')
      })
    },
    /** ==============================小节操作======================================== */
    // 添加小节 弹框
    openLessonDialog(chapterId) {
      this.chapterId = chapterId
      this.lesson = {
        title: '',
        chargeStatus: '0',
        orderNum: 0,
        videoSourceId: ''
      }
      if (this.$refs['lesson']) {
        this.$refs['lesson'].resetFields()
      }
      this.dialogLessonFormVisible = true
      this.lessonFormTitle = '添加课时'
      this.fileList = []
    },
    saveOrUpdateLesson() {
      this.$refs['lesson'].validate(valid => {
        if (valid) {
          this.saveLessonBtnDisabled = true
          // 判断是添加还是修改
          if (!this.lesson.id) {
            this.saveDataLesson()
          } else {
            this.updateDataLesson()
          }
        }
      })
    },
    saveDataLesson() {
      this.lesson.courseId = this.courseId
      this.lesson.chapterId = this.chapterId
      addLesson(this.lesson).then(response => {
        // 提示信息
        this.$modal.msgSuccess('新增成功')
        this.resetLesson()
      })
    },
    updateDataLesson() {
      updateLesson(this.lesson).then(response => {
        // 提示信息
        this.$modal.msgSuccess('修改成功')
        this.resetLesson()
      })
    },
    openEditLessonDialog(lessonId) {
      this.dialogLessonFormVisible = true
      getLesson(lessonId).then(response => {
        this.lesson = response
        this.fileList = []
        this.lessonFormTitle = '修改课时'
        if (this.lesson.videoOriginalName) {
          this.fileList = [{ 'name': this.lesson.videoOriginalName }]
        }
      })
    },
    removeLesson(lesson) {
      this.$modal.confirm('是否确认删除课时标题为【' + lesson.title + '】的数据项？').then(function() {
        return delLesson(lesson.id)
      }).then(() => { // 点击确定，执行then方法
        // 提示信息
        this.$modal.msgSuccess('删除成功')
        // 刷新列表
        this.fetchChapterNestedListByCourseId()
      }).catch(() => {
        this.$modal.msg('已取消删除')
      })
    },
    resetLesson() {
      this.dialogLessonFormVisible = false // 如果保存成功则关闭对话框
      this.fetchChapterNestedListByCourseId()// 刷新列表
      this.lesson = {
        title: '',
        chargeStatus: '0',
        orderNum: 0,
        videoSourceId: ''
      }
      this.fileList = []
      if (this.$refs['lesson']) {
        this.$refs['lesson'].resetFields()
      }
      this.saveLessonBtnDisabled = false
    },
    /** ==============================章节操作===========================*/
    resetChapter() {
      this.chapter = { orderNum: 0 }
      if (this.$refs['chapter']) {
        this.$refs['chapter'].resetFields()
      }
    },
    // 修改章节 弹框显示
    openEditChapterDialog(chapterId) {
      getChapter(chapterId).then(response => {
        this.chapter = response
        this.dialogChapterFormVisible = true
        this.chapterFormTitle = '修改章节'
      })
    },
    // 弹出添加章节页面
    openChapterDialog() {
      this.resetChapter()
      this.dialogChapterFormVisible = true
      this.chapterFormTitle = '添加章节'
    },
    saveOrUpdate() {
      this.$refs['chapter'].validate(valid => {
        if (valid) {
          // 判断是添加还是修改
          if (!this.chapter.id) {
            this.addChapter()
          } else {
            this.updateChapter()
          }
        }
      })
    },
    // 添加章节
    addChapter() {
      this.chapter.courseId = this.courseId
      addChapter(this.chapter).then(response => {
        // 提示信息
        this.$modal.msgSuccess('新增成功')
        // 关闭弹框
        this.dialogChapterFormVisible = false
        // 刷新页面
        this.fetchChapterNestedListByCourseId()
      })
    },
    // 修改章节
    updateChapter() {
      updateChapter(this.chapter).then(response => {
        // 提示信息
        this.$modal.msgSuccess('修改成功')
        // 关闭弹框
        this.dialogChapterFormVisible = false
        // 刷新页面
        this.fetchChapterNestedListByCourseId()
      })
    },
    // 删除章节
    removeChapter(chapter) {
      this.$modal.confirm('是否确认删除章节标题为【' + chapter.title + '】的数据项？').then(function() {
        return delChapter(chapter.id)
      }).then(() => { // 点击确定，执行then方法
        // 提示信息
        this.$modal.msgSuccess('删除成功')
        // 刷新列表
        this.fetchChapterNestedListByCourseId()
      }).catch(() => {
        this.$modal.msg('已取消删除')
      })
    },
    init() {
      if (this.$route.params && this.$route.params.id) {
        this.courseId = this.$route.params.id
        // 根据id获取课程基本信息
        this.fetchChapterNestedListByCourseId()
      }
    },
    fetchChapterNestedListByCourseId() {
      listChapter(this.courseId).then(response => {
        this.chapterNestedList = response
      })
    },
    /** 路由跳转到上一步 */
    previous() {
      this.$router.push({
        path: '/course/info/' + this.courseId
      })
    },
    /** 路由跳转到下一步 */
    next() {
      this.$router.push({
        path: '/course/publish/' + this.courseId
      })
    }
  }
}
</script>

<style scoped>
.chapterList {
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
}

.chapterList li {
  position: relative;
}

.chapterList p {
  float: left;
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #DDD;
}

.chapterList .acts {
  float: right;
  font-size: 14px;
}

.lessonList {
  padding-left: 50px;
}

.lessonList p {
  float: left;
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #DDD;
}
</style>
