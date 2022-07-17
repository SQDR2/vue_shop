<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../assets/logo.png" alt="">
        <span>电商通用管理平台</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="changeCollapse" @click="changeCollapse">|||</div>
        <el-menu background-color="#333744" active-text-color="#409bff" text-color="#fff" unique-opened
          :collapse="isCollapse" :collapse-transition="false" router :default-active="activePath">
          <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item :index="'/' + subitem.path" v-for="subitem in item.children" :key="subitem.id"
              @click="getMenuActivePath('/' + subitem.path)">
              <template>
                <i class="el-icon-menu"></i>
                <span>{{ subitem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>

        </el-menu>
      </el-aside>
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      menulist: [],
      iconObj: {
        125: 'iconfont icon-yonghuguanli',
        103: 'iconfont icon-quanxianguanli',
        101: 'iconfont icon-shangpinguanli',
        102: 'iconfont icon-dingdanguanli',
        145: 'iconfont icon-caidanshujutongji'
      },
      isCollapse: false,
      // 当前被激活路由lujin
      activePath: ''
    }
  },
  // 生命周期函数
  created () {
    // 调用获取左侧菜单栏
    this.getMenuList()
    this.activePath = sessionStorage.getItem('activePath')
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList () {
      // 发送获取左侧菜单栏请求
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.menulist = res.data
    },
    // 左侧菜单栏收起
    changeCollapse () {
      this.isCollapse = !this.isCollapse
    },
    // 获取被点击路由地址
    getMenuActivePath (active) {
      window.sessionStorage.setItem('activePath', active)
      this.activePath = active
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}

.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0;
  color: #fff;

  >div {
    display: flex;
    align-items: center;

    >img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background-color: #fff;
    }

    >span {
      font-size: 20px;
      margin-left: 10px;
    }
  }
}

.el-aside {
  background-color: #333744;

  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #eaedf1;
}

.iconfont {
  margin-right: 10px;
}

.changeCollapse {
  background-color: #4a5064;
  text-align: center;
  color: #fff;
  font-size: 10px;
  line-height: 24px;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>>