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
                    <el-form-item label="所属项目编号:" style="margin-left: 25px">
                        <el-input v-model="projectData.parentPid" id="fatherProject"></el-input>
                    </el-form-item>
                </el-form>
                <el-form ref="projectData" :model="projectData" label-width="100px" style="width: 43%">
                    <el-form-item label="所属项目名字:" style="margin-left: 25px">
                        <el-input v-model="projectData.parentPname" id="fatherProject"></el-input>
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
            <el-form style="margin-top: 20px">
                <fieldset style="-moz-border-radius:8px;padding-left: 30px">
                    <legend>&nbsp;<label v-text="status"></label>&nbsp;</legend>
                    <br />
                    <label style="margin-left: 14px">请下载合同送审资料, 进行<label v-text="status"></label>!</label>
                    <br />
                    <br />
                    <el-form ref="form" :model="form" label-width="80px">
                        <el-form-item label="审核状态">
                            <el-radio-group v-model="form.resource">
                                <el-radio label="1"><label v-text="auditStatus1"></label></el-radio>
                                <el-radio label="2"><label v-text="auditStatus2"></label></el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-form>
                    <label style="margin-left: 12px">上传审计报告或退回函（支持DOC/XLS/PDF）：</label>
                    <br /><br />
                    <el-form>
                        <el-form-item style="margin-left: 12px;text-align: center">
                            <a href="http://localhost:8080/#/AddSeal"style="text-decoration:none">
                            	<el-button>盖章</el-button>
                            </a>
                            <el-button>上传审计报告</el-button>
                        </el-form-item>
                    </el-form>
                    <el-form-item style="text-align: center">
                        <el-upload
                                ref="uploadExcel"
                                action=""
                                :limit="1"
                                :data="userData"
                                :auto-upload="false"
                                accept=".xlsx,.PDF,.xls,.doc,.docx"
                                :before-upload="beforeUploadFile"
                                :on-change="fileChange"
                                :on-exceed="exceedFile"
                                :on-success="handleSuccess"
                                :on-error="handleError"
                                :http-request="uploadFile"
                                :file-list="fileList">
                            <el-button size="small" plain style="width: 100px">选择文件</el-button>
                            <div slot="tip" class="el-upload__tip">只能上传DOC/XLS/PDF文件</div>
                        </el-upload>
                    </el-form-item>
                    <el-form-item style="text-align: center">
                        <el-button size="small" type="primary" @click="uploadFile">提交审核结果</el-button>
                    </el-form-item>
                </fieldset>
            </el-form>
        </div>
    </div>
</template>

<script>
    import {sendFilePostRequest, sendFilePutRequest, sendGetRequest} from "../../api";

    export default {
        name: "Review",
        data() {
            return {
                form: {
                    file: [],
                    resource:''
                },
                fileList: [],
                uid: localStorage.getItem('uid'),
                pid:'',
                userData:{
                    uid:localStorage.getItem('uid'),
                    pid:""
                },
                query: {
                    pageIndex: 1,
                    pageSize: 10
                },
                projectData:{},
                tableData: [],

                pageTotal: 0,
                idx: -1,
                id: -1,
                status:'',
                auditResultStatus:'',
                auditStatus1: '',
                auditStatus2 : ''
            };
        },
        created() {
            let pid = this.$route.query.pid
            if(pid === undefined){
                this.$message.error('无指定的项目数据');
                return
            }
            this.pid = pid
            this.userData.pid = pid
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
                    console.log(response)
                    this.projectData = response.data.data
                    this.changeStatus()
                    this.auditStatus1 = '初审通过'
                    this.auditStatus2 = '初审不通过'
                }.bind(this)).catch(function (error) {
                    console.log(error);
                })
                let url2 = 'audit/' + this.pid + '?uid=' + this.uid
                sendGetRequest(url2).then(function(response) {
                    console.log(response)
                    this.tableData = response.data.data
                    this.changeAuditStatus()
                }.bind(this)).catch(function (error) {
                    console.log(error);
                })
            },
            changeAuditStatus(){
                this.form = {
                    file: [],
                    resource:''
                }
                this.fileList =  []
                console.log(this.tableData.length)
                if(this.tableData.length > 0){
                    if(this.tableData[this.tableData.length-1].auditStatus === '复审通过'){
                        this.auditResultStatus = '初审'
                    }else if(this.tableData[this.tableData.length-1].auditStatus === '复审不通过'){
                        this.auditResultStatus = '复审'
                    }else if(this.tableData[this.tableData.length-1].auditStatus === '初审通过'){
                        this.auditResultStatus = '复审'
                    }else if(this.tableData[this.tableData.length-1].auditStatus === '初审不通过'){
                        this.auditResultStatus = '初审'
                    }else if(this.tableData[this.tableData.length-1].auditStatus === '待复审'){
                        this.auditResultStatus = '复审'
                    }
                }
                if(this.auditResultStatus !== ''){
                    this.auditStatus1 = this.auditResultStatus + '通过'
                    this.auditStatus2 = this.auditResultStatus + '不通过'
                }
            },
            changeStatus(){
                this.status = this.projectData.status
            },
            checkFatherProject(){
              if(this.projectData.parentPid === null){
                  this.$message.error("无所属项目信息");
              }else{
                  this.$router.push('/projectDetails?pid='+ this.projectData.parentPid);
              }
            },
            downSendData(index,row){
                let url = 'audit/' + row.uploadedFiles.slice(1,row.uploadedFiles.length)
                sendGetRequest(url).then(res=>{
                    if(res.status === 200){
                        let data = res.data.data
                        for (let index = 0; index < data.length; index++) {
                            this.download(data[index]);
                        }
                    }
                })
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
            },
            exceedFile(files, fileList) {
                this.$notify.warning({
                    title: '警告',
                    message: `只能选择1个文件，当前共选择了 ${files.length + fileList.length} 个`
                });
            },
            // 文件状态改变时的钩子
            fileChange(file, fileList) {
                this.form.file = file.raw
            },
            // 上传文件之前的钩子, 参数为上传的文件,若返回 false 或者返回 Promise 且被 reject，则停止上传
            beforeUploadFile(file) {
                console.log('before upload')
                let extension = file.name.substring(file.name.lastIndexOf('.')+1)
                let size = file.size / 1024 / 1024
                if(extension !== 'xlsx' || extension !== 'PDF' || extension !== 'xls' || extension !== 'doc' || extension !== 'docx') {
                    this.$notify.warning({
                        title: '警告',
                        message: `只能上传后缀是.xlsx/.PDF/.xls/.doc/.docx的文件`
                    });
                }
            },
            // 文件上传成功时的钩子
            handleSuccess(res, file, fileList) {
                this.$notify.success({
                    title: '成功',
                    message: `文件上传成功`
                });
            },
            // 文件上传失败时的钩子
            handleError(err, file, fileList) {
                this.$notify.error({
                    title: '错误',
                    message: `文件上传失败`
                });
            },
            uploadFile() {
                let status = ''
                if(this.form.resource === "1"){
                    status = this.auditStatus1
                }else if(this.form.resource === "2"){
                    status = this.auditStatus2
                }else{
                    this.$message.error('请确认审核状态');
                    return
                }
                // console.log('pid = ' , this.pid)
                // console.log('uid = ' , this.uid)
                // console.log('data = ' , this.form.file)
                // console.log('status = ' , status)
                let formData = new FormData()
                formData.append('file', this.form.file)
                this.$confirm('确定提交审核吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        let url = "audit?auditResultStatus=" + status + "&pid=" + this.pid + "&uid=" + this.uid
                        sendFilePutRequest(url,formData).then((res) => {
                            console.log(res)
                            if(res.data.code !== 200){
                                this.$message.error(res.data.msg);
                            }else{
                                this.$message.success(res.data.msg);
                            }
                        }, (err) =>{
                            console.log(err)
                        })

                    })
                    .catch(() => {});
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
    .el-upload-dragger {
        border: 0px dashed #d9d9d9;
    }
    .el-upload--text {
         background-color: #fff;
         border: 0px dashed #d9d9d9;
         border-radius: 6px;
         -webkit-box-sizing: border-box;
         box-sizing: border-box;
         width: 170px;
         height: auto;
         text-align: center;
         cursor: pointer;
         position: relative;
        overflow: hidden;
    }
</style>