<template>
    <div style="padding-left: 20%">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 项目详情
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container" style="width: 60%;">
            <div>
                <el-form ref="projectData" :model="projectData" label-width="80px" style="width: 50%;float: left">
                    <div class="handle-box" style="margin-top: 2%;margin-left: 2%">
                        <el-form-item label="项目编号:">
                            <el-input v-model="projectData.pid"></el-input>
                        </el-form-item>
                        <el-form-item label="项目类型:">
                            <el-input v-model="projectData.type"></el-input>
                        </el-form-item>
                        <el-form-item label="项目进度:">
                            <el-input v-model="projectData.node"></el-input>
                        </el-form-item>
                        <el-form-item label="创建者:">
                            <el-input v-model="projectData.creatorName"></el-input>
                        </el-form-item>
                    </div>
                </el-form>
                <el-form ref="query" :model="query" label-width="80px" style="float:right;width: 50%;">
                    <div class="handle-box" style="margin-top: 2%;margin-right: 2%;">
                        <el-form-item label="项目名称:">
                            <el-input v-model="projectData.pname"></el-input>
                        </el-form-item>
                        <el-form-item label="所属单位:">
                            <el-input v-model="projectData.cname"></el-input>
                        </el-form-item>
                        <el-form-item label="项目状态:">
                            <el-input v-model="projectData.status"></el-input>
                        </el-form-item>
                        <el-form-item label="创建时间">
                            <el-input v-model="projectData.createTime"></el-input>
                        </el-form-item>
                    </div>
                </el-form>
            </div>
            <div>&nbsp;</div>
            <div class="fatherProject">
                <el-button
                        type="text"
                        @click="checkFatherProject"
                        style="width: 10%;float: right;margin-right: 2%"
                >查看项目详情</el-button>
                <el-form ref="projectData" :model="projectData" label-width="100px" style="width: 45%;float: right">
                    <el-form-item label="父项目名称:" style="margin-left: 25px">
                        <el-input v-model="projectData.parentPname" id="fatherProject"></el-input>
                    </el-form-item>
                </el-form>
                <el-form ref="projectData" :model="projectData" label-width="100px" style="width: 43%">
                    <el-form-item label="父项目编号:" style="margin-left: 25px">
                        <el-input v-model="projectData.parentPid" id="fatherProject"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <el-table
                    :data="tableData"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
            >
                <el-table-column prop="pnode" label="项目进度" align="center"></el-table-column>
                <el-table-column label="送审资料" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click="downSendData(scope.$index, scope.row)"
                        >下载</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="审计报告" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click=""
                        >下载</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="auditStatus" label="审核状态" align="center"></el-table-column>
                <el-table-column prop="sendTime" label="送审时间" align="center"></el-table-column>
                <el-table-column prop="auditTime" label="审核时间" align="center"></el-table-column>
                <el-table-column prop="senderName" label="送审人员" align="center"></el-table-column>
                <el-table-column prop="auditorName" label="审核人员" align="center"></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import {sendGetRequest} from "../../api";

    export default {
        name: "projectDetails2",
        data() {
            return {
                uid: localStorage.getItem('uid'),
                pid:'',
                query: {
                    pageIndex: 1,
                    pageSize: 10
                },
                projectData:{},
                tableData: [
                ],
                multipleSelection: [],
                delList: [],
                editVisible: false,
                pageTotal: 0,
                form: {},
                idx: -1,
                id: -1
            };
        },
        created() {
            let pid = this.$route.query.pid
            if(pid === undefined){
                this.$message.error('无指定的项目数据');
                return
            }
            this.pid = pid
            this.getData();
        },
        watch: {
            // 利用watch方法检测路由变化：
            '$route': function (to, from) {
                // 拿到目标参数 to.query.id 去再次请求数据接口
                if(to.query['pid'] !== this.userData.pid && this.userData.pid !== ''){
                    this.pid = to.query['pid']
                    this.userData.pid = to.query['pid']
                    this.getData();
                }
            }
        },
        methods: {
            // 获取 easy-mock 的模拟数据
            getData() {
                let url = 'project/' + this.pid + '?uid=' + this.uid
                sendGetRequest(url).then(function(response) {
                    this.projectData = response.data.data
                }.bind(this)).catch(function (error) {
                    console.log(error);
                })
                let url2 = 'audit/' + this.pid + '?uid=' + this.uid
                sendGetRequest(url2).then(function(response) {
                    this.tableData = response.data.data
                }.bind(this)).catch(function (error) {
                    console.log(error);
                })
            },
            downSendData(index,row){
                let url = 'unit/' + row.uploadedFiles.slice(1,row.uploadedFiles.length)
                console.log(url)
                sendGetRequest(url).then(res=>{
                    if(res.status === 200){
                        let data = res.data.data
                        for (let index = 0; index < data.length; index++) {
                            this.download(data[index]);
                        }
                    }
                })
            },
            checkFatherProject(){
                if(this.projectData.parentPid === null){
                    this.$message.error("无父项目信息");
                }else{
                    this.$router.push('/projectDetails?pid='+ this.projectData.parentPid);
                }
            },
            download(url) {
                const iframe = document.createElement('iframe')
                iframe.style.display = 'none'
                function iframeLoad () {
                    const win = iframe.contentWindow
                    const doc = win.document
                    if (win.location.href === url) {
                        if (doc.body.childNodes.length > 0) {
                            // response is error
                        }
                        iframe.parentNode.removeChild(iframe)
                    }
                }
                if ('onload' in iframe) {
                    iframe.onload = iframeLoad
                } else if (iframe.attachEvent) {
                    iframe.attachEvent('onload', iframeLoad)
                } else {
                    iframe.onreadystatechange = function onreadystatechange () {
                        if (iframe.readyState === 'complete') {
                            iframeLoad()
                        }
                    }
                }
                iframe.src = ''
                document.body.appendChild(iframe)
                setTimeout(function loadUrl () {
                    iframe.contentWindow.location.href = url
                }, 50)
            }
        }
    }
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }

    .table {
        width: 100%;
        font-size: 14px;
    }
    .red {
        color: #ff0000;
    }
    .mr10 {
        margin-right: 10px;
    }
    .table-td-thumb {
        display: block;
        margin: auto;
        width: 40px;
        height: 40px;
    }

</style>
<style>
    input#fatherProject {
        border-color: greenyellow;
        background-color: greenyellow;
        width: 100%;
    }
    .el-input__inner {
        /*border: none;*/
        pointer-events: none;
    }
    .fatherProject{
        width: calc(100% + 60px);
        background-color: greenyellow;
        margin-left: -30px;
        height: 35px;
    }
    input.el-input__inner {
        width: 100%;
    }

</style>