<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157"
            text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item v-for="(threeItem,i) in subItem.subs" :key="i" :index="threeItem.index">
                                    {{ threeItem.title }}
                                </el-menu-item>
                            </el-submenu>
                            <el-menu-item v-else :index="subItem.index" :key="subItem.index">
                                {{ subItem.title }}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import bus from '../common/bus';
    export default {
        data() {
            return {
                collapse: false,
                items: [
                    {
                        icon:'el-icon-lx-group',
                        index:'/CompanyManagement',
                        title:'单位管理'
                    },
                    {
                        icon:'el-icon-lx-group',
                        index:'/ModuleManagement',
                        title:'模块管理'
                    },
                    {
                      icon:'el-icon-lx-people',
                      index:'/PermissionManager',
                      title:'权限管理'
                    },
                    {
                      icon: 'el-icon-lx-profile',
                      index:'/CharacterManagement',
                      title:'角色管理'
                    },
                    {
                        icon: 'el-icon-lx-peoplefill',
                        index:'/UserManagement',
                        title:'用户管理'
                    },
                    {
                        icon: 'el-icon-lx-calendar',
                        index: '100',
                        title: '项目管理--审计部门',
                        subs: [
                            {
                                index: 'ProjectReviewList',
                                title: '项目审核列表',
                            },
                            // {
                            //     index: 'projectDetails',
                            //     title: '项目详情'
                            // },
                            // {
                            //     index: 'Review',
                            //     title: '审核'
                            // },
                            // {
                            //     index: 'PerformanceReview',
                            //     title: '绩效评审'
                            // }
                        ]
                    },
                    {
                        icon: 'el-icon-lx-calendar',
                        index: '200',
                        title: '项目管理--单位用户使用',
                        subs: [
                            {
                                icon: 'el-icon-lx-copy',
                                index: 'unitproject',
                                title: '单位项目列表'
                            },
                            // {
                            //     index: 'projectDetails2',
                            //     title: '项目详情'
                            // },
                            // {
                            //     index: 'Review2',
                            //     title: '送审'
                            // }
                        ]
                    },
                    {
                        icon: 'el-icon-lx-calendar',
                        index: '2',
                        title: '资料管理',
                        subs: [
                            {
                                index: 'templatemanagement',
                                title: '模板管理',
                            },
                            {
                                index: 'performancetable',
                                title: '绩效评价指标管理'
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-lx-calendar',
                        index: '300',
                        title: '统计报表',
                        subs: [
                            {
                                index: 'weekform',
                                title: '周报',
                            },
                            {
                                index: 'monthform',
                                title: '月报'
                            }
                        ]
                    },
                    ////////////////////////////////原框架内容/////////////////////////////////////////
                    {
                        icon: 'el-icon-lx-home',
                        index: 'dashboard',
                        title: '系统首页'
                    },
                    {
                        icon: 'el-icon-lx-cascades',
                        index: 'table',
                        title: '基础表格'
                    },
                    {
                        icon: 'el-icon-lx-copy',
                        index: 'tabs',
                        title: 'tab选项卡'
                    },
                    {
                        icon: 'el-icon-lx-calendar',
                        index: '3',
                        title: '表单相关',
                        subs: [
                            {
                                index: 'form',
                                title: '基本表单'
                            },
                            {
                                index: '3-2',
                                title: '三级菜单',
                                subs: [
                                    {
                                        index: 'editor',
                                        title: '富文本编辑器'
                                    },
                                    {
                                        index: 'markdown',
                                        title: 'markdown编辑器'
                                    },
                                ]
                            },
                            {
                                index: 'upload',
                                title: '文件上传'
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-lx-emoji',
                        index: 'icon',
                        title: '自定义图标'
                    },
                    {
                        icon: 'el-icon-pie-chart',
                        index: 'charts',
                        title: 'schart图表'
                    },
                    {
                        icon: 'el-icon-rank',
                        index: '6',
                        title: '拖拽组件',
                        subs: [
                            {
                                index: 'drag',
                                title: '拖拽列表',
                            },
                            {
                                index: 'dialog',
                                title: '拖拽弹框',
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-lx-global',
                        index: 'i18n',
                        title: '国际化功能'
                    },
                    {
                        icon: 'el-icon-lx-warn',
                        index: '7',
                        title: '错误处理',
                        subs: [
                            {
                                index: 'permission',
                                title: '权限测试'
                            },
                            {
                                index: '404',
                                title: '404页面'
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-lx-redpacket_fill',
                        index: '/donate',
                        title: '支持作者'
                    },
                    {
                        index: '/test',
                        title: '测试'
                    }
                ]
            }
        },
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        },
        created(){
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapse', msg => {
                this.collapse = msg;
            })
        },
    }
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        left: 0;
        top: 70px;
        bottom:0;
        overflow-y: scroll;
    }
    .sidebar::-webkit-scrollbar{
        width: 0;
    }
    .sidebar-el-menu:not(.el-menu--collapse){
        width: 250px;
    }
    .sidebar > ul {
        height:100%;
    }
</style>
