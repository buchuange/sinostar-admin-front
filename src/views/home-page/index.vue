<template>
  <div class="app-container home">
    <el-row :gutter="20">
      <el-col :sm="24" :lg="24">
        <blockquote class="text-warning" style="font-size: 14px">
          领取阿里云通用云产品1888优惠券
          <br />
          <el-link
            href="https://www.aliyun.com/minisite/goods?userCode=brki8iof"
            type="primary"
            target="_blank"
          >https://www.aliyun.com/minisite/goods?userCode=brki8iof</el-link
          >
          <br />
          领取腾讯云通用云产品2860优惠券
          <br />
          <el-link
            href="https://cloud.tencent.com/redirect.php?redirect=1025&cps_key=198c8df2ed259157187173bc7f4f32fd&from=console"
            type="primary"
            target="_blank"
          >https://cloud.tencent.com/redirect.php?redirect=1025&cps_key=198c8df2ed259157187173bc7f4f32fd&from=console</el-link
          >
          <br />
          阿里云服务器折扣区
          <el-link href="http://aly.ruoyi.vip" type="primary" target="_blank"
          >>☛☛点我进入☚☚</el-link
          >
          &nbsp;&nbsp;&nbsp; 腾讯云服务器秒杀区
          <el-link href="http://txy.ruoyi.vip" type="primary" target="_blank"
          >>☛☛点我进入☚☚</el-link
          ><br />
          <h4 class="text-danger">
            云产品通用红包，可叠加官网常规优惠使用。(仅限新用户)
          </h4>
        </blockquote>

        <hr />
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :sm="24" :lg="12" style="padding-left: 20px">
        <h2>基于微服务架构的在线教育平台</h2>
        <p style="text-indent:2em; padding:0; margin:0;">
          针对传统单体式架构在线教育平台存在灵活性较低、可拓展性和稳定性不足等问题,设计了一种基于微服务架构的在线教育平台，微服务作为一种新型的架构思想，它将多个技术栈进行组合，并以服务划分来降低软件开发的复杂度，将复杂的业务逻辑拆分成各个服务。拆分后的服务可独立扩展，服务间耦合度降低，更利于软件升级与维护等。首先,该在线教育平台采用前后端分离开发，微服务分库设计，并使用Swagger生成接口文档方便前后端对接联调；后端搭建父工程对maven依赖进行统一管理，并建立base包作为公共的基础模块，维护系统中的公共基础信息，项目主要依靠Spring Cloud框架来搭建微服务，利用Nacos组件作为服务注册中心和其它微服务组件搭建项目基础环境，同时还选取MyBatis-Plus框架作为持久层的框架，方便对于数据库的操作，并使用Redis缓存热点数据提高系统性能。前端主要利用市面上主流的开源框架如vue-element-admin、若依框架等搭建基础环境。该系统实现了线上课程的有效管理,满足了用户的个性化学习需求，前台用户系统主要包括首页数据展示、讲师列表和详情、课程列表和详情（包括课程评论、购买、在线视频播放等功能）。后台运营平台主要包括讲师管理模块、课程分类模块、课程管理模块、统计分析模块和订单管理等。相比与传统单体式架构系统,该系统将不同服务模块部署在不同服务器上,使用灵活、拓展方便、稳定性好,具有一定的实用价值。
        </p>
        <p>
          <b>当前版本:</b> <span>v{{ version }}</span>
        </p>
        <p>
          <el-tag type="danger">&yen;免费开源</el-tag>
        </p>
        <p>
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-cloudy"
            plain
            @click="goTarget('https://gitee.com/only-19-soft-2-19-zhong-junjie/online-education-micro-service')"
          >访问码云</el-button
          >
          <el-button
            size="mini"
            icon="el-icon-s-home"
            plain
            @click="goTarget('https://github.com/buchuange/online-education-micro-service')"
          >访问主页</el-button
          >
        </p>
      </el-col>

      <el-col :sm="24" :lg="12" style="padding-left: 50px">
        <el-row>
          <el-col :span="12">
            <h2>技术选型</h2>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <h4>后端技术</h4>
            <ul>
              <li>SpringBoot</li>
              <li>SpringCloud</li>
              <li>Nacos</li>
              <li>Sentinel</li>
              <li>Gateway</li>
              <li>MyBatis-Plus</li>
              <li>Hutool工具类</li>
              <li>阿里云</li>
              <li></li>
              <li>...</li>
            </ul>
          </el-col>
          <el-col :span="6">
            <h4>前端技术</h4>
            <ul>
              <li>Vue</li>
              <li>Element-ui</li>
              <li>Axios</li>
              <li>Echarts</li>
              <li>Nuxt</li>
              <li>...</li>
            </ul>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-divider />
  </div>
</template>

<script>
export default {
  name: "Index",
  data() {
    return {
      // 版本号
      version: "1.0.0",
    };
  },
  methods: {
    goTarget(href) {
      window.open(href, "_blank");
    },
  },
};
</script>

<style scoped lang="scss">
.home {
  blockquote {
    padding: 10px 20px;
    margin: 0 0 20px;
    font-size: 17.5px;
    border-left: 5px solid #eee;
  }
  hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #eee;
  }
  .col-item {
    margin-bottom: 20px;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  font-family: "open sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 13px;
  color: #676a6c;
  overflow-x: hidden;

  ul {
    list-style-type: none;
  }

  h4 {
    margin-top: 0px;
  }

  h2 {
    margin-top: 10px;
    font-size: 26px;
    font-weight: 100;
  }

  p {
    margin-top: 10px;

    b {
      font-weight: 700;
    }
  }

  .update-log {
    ol {
      display: block;
      list-style-type: decimal;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0;
      margin-inline-end: 0;
      padding-inline-start: 40px;
    }
  }
}
</style>

