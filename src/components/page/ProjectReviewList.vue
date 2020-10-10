<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 项目审核列表
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-form ref="query" :model="query" label-width="80px" style="width:100%;padding-left: 2%;">
            <div class="handle-box" style="margin-top: 2%;width: 20%">
                <el-form-item label="项目名称:">
                    <el-input v-model="query.projectName"></el-input>
                </el-form-item>
                <el-form-item label="项目进度:">
                    <el-input v-model="query.projectSchedule"></el-input><!--   下拉框-->
                </el-form-item>
                <el-form-item label="项目类型:">
                    <el-input v-model="query.projectType"></el-input><!--   下拉框-->
                </el-form-item>
            </div>
            <div class="handle-box" style="margin-top: 2%;margin-left: 2%;width: 35%">
                <el-form-item label="单位名称:">
                    <el-input v-model="query.unitName" style="width: 46%"></el-input>
                </el-form-item>
                <el-form-item label="创建时间:">
                    <el-col :span="11">
                        <el-date-picker
                                type="date"
                                placeholder="选择日期"
                                v-model="query.createTime"
                                value-format="yyyy-MM-dd"
                                style="width: 100%;"
                        ></el-date-picker>
                    </el-col>
                    <el-col class="line" :span="1">&nbsp;&nbsp;-</el-col>
                    <el-col :span="11">
                        <el-time-picker
                                placeholder="选择时间"
                                v-model="query.createTime2"
                                value-format="HH:mm"
                                style="width: 100%;"
                        ></el-time-picker>
                    </el-col>
                </el-form-item>
                <el-form-item label="结审时间:">
                    <el-col :span="11">
                        <el-date-picker
                                type="date"
                                placeholder="选择日期"
                                v-model="query.endTime"
                                value-format="yyyy-MM-dd"
                                style="width: 100%;"
                        ></el-date-picker>
                    </el-col>
                    <el-col class="line" :span="1">&nbsp;&nbsp;-</el-col>
                    <el-col :span="11">
                        <el-time-picker
                                placeholder="选择时间"
                                v-model="query.endTime2"
                                value-format="HH:mm"
                                style="width: 100%;"
                        ></el-time-picker>
                    </el-col>
                </el-form-item>
            </div>
            <div class="handle-box" style="margin-top: 2%;margin-left: -5%;width: 35%">
                <el-form-item>
                    <el-input v-model="query.unitName" style="visibility: hidden"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-col :span="11">
                        <el-date-picker
                                type="date"
                                placeholder="选择日期"
                                v-model="query.createTime3"
                                value-format="yyyy-MM-dd"
                                style="width: 100%;"
                        ></el-date-picker>
                    </el-col>
                    <el-col class="line" :span="1">&nbsp;&nbsp;-</el-col>
                    <el-col :span="11">
                        <el-time-picker
                                placeholder="选择时间"
                                v-model="query.createTime4"
                                value-format="HH:mm"
                                style="width: 100%;"
                        ></el-time-picker>
                    </el-col>
                </el-form-item>
                <el-form-item>
                    <el-col :span="11">
                        <el-date-picker
                                type="date"
                                placeholder="选择日期"
                                v-model="query.endTime3"
                                value-format="yyyy-MM-dd"
                                style="width: 100%;"
                        ></el-date-picker>
                    </el-col>
                    <el-col class="line" :span="1">&nbsp;&nbsp;-</el-col>
                    <el-col :span="11">
                        <el-time-picker
                                placeholder="选择时间"
                                v-model="query.endTime4"
                                value-format="HH:mm"
                                style="width: 100%;"
                        ></el-time-picker>
                    </el-col>
                </el-form-item>
            </div>
            <div style="float: left;margin-left: 2%;margin-top: 5.5%">
                <el-button type="primary" @click="selectProject">查 询</el-button>
            </div>

        </el-form>
        <div class="container">
            <el-table
                    :data="tableData"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
            >
                <el-table-column prop="pid" label="项目编号" align="center"></el-table-column>
                <el-table-column prop="pname" label="项目名称" align="center"></el-table-column>
                <el-table-column prop="cname" label="所属单位" align="center"></el-table-column>
                <el-table-column prop="type" label="项目类型" align="center"></el-table-column>
                <el-table-column prop="node" label="项目进度" align="center"></el-table-column>
                <el-table-column prop="status" label="项目状态" align="center"></el-table-column>
                <el-table-column prop="isSub" label="是否为子项目" align="center"></el-table-column>
                <el-table-column prop="parentPid" label="父项目" align="center"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
                <el-table-column prop="finishTime" label="结审时间" align="center"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click="handleEdit(scope.$index, scope.row)"
                        >查看</el-button>
                        <el-button
                                type="text"
                                icon="el-icon-lx-tag"
                                class="red"
                                @click="handleDelete(scope.$index, scope.row)"
                                :class="(scope.row.node === '新建' ||
                                        (scope.row.status !== null &&
                                        scope.row.status[scope.row.status.length - 2] === '提' &&
                                        scope.row.status[scope.row.status.length - 1] === '交')
                                        )? 'notUse':''"
                        >
                            <div style="float: right" v-if="scope.row.node === '结审' && scope.row.status === '项目结审'">
                                查看绩效评审
                            </div>
                            <div style="float: right" v-else>
                                审核
                            </div>
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                        background
                        layout="total, prev, pager, next"
                        :current-page="query.pageIndex"
                        :page-size="query.pageSize"
                        :total="pageTotal"
                        @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

    </div>
</template>

<script>
    import {sendGET_J_Request} from "../../api";
    import {sendGetRequest} from "../../api";
    import {sendPostRequest} from "../../api";

    export default {
        name: "ProjectReviewList",
        data() {
            return {
                uid: localStorage.getItem('uid'),
                query: {
                    projectName:'',
                    projectSchedule:'',
                    projectType:'',
                    unitName:'',
                    createTime:'',
                    createTime2:'00:00:00',
                    createTime3:'',
                    createTime4:'23:59:00',
                    endTime:'',
                    endTime2:'00:00:00',
                    endTime3:'',
                    endTime4:'23:59:00',
                    pageIndex: 1,
                    pageSize: 10
                },
                tableData: [
                ],
                selectData:{
                    uid:localStorage.getItem('uid'),
                    cname:"none",
                    pname:"none",
                    cid:"none",
                    node:"none",
                    type:"none",
                    createTimeMin:"none",
                    createTimeMax:"none",
                    finishTimeMin:"none",
                    finishTimeMax:"none",
                    pageNum:"1",
                    pageSize:"10"
                },
                multipleSelection: [],
                delList: [],
                pageTotal: 0,
                form: {},
                idx: -1,
                id: -1
            };
        },
        created() {
            // this.testData1();
            this.testData2();
            this.getData();
        },
        methods: {
            getData() {
                let url = 'search/unit'
                sendGET_J_Request(url,this.selectData).then(function(response) {
                    console.log(response.data.data)
                    if(response.status === 200){
                        console.log(response)
                        this.$set(this,"pageTotal",response.data.data.intotal)
                        this.tableData = response.data.data.datas
                        for (let i = 0;i<this.tableData.length;i++){
                            if(this.tableData[i].parentPid != null){
                                this.tableData[i].isSub = '是'
                            }else {
                                this.tableData[i].isSub = '否'
                            }
                        }
                    }
                }.bind(this)).catch(function (error) {
                    console.log(error);
                })
            },
            testData1(){
                let url = 'user/login?username=12345679a@qq.com&password=123456'
                sendPostRequest(url).then(function(response) {
                    console.log(response)
                }.bind(this)).catch(function (error) {
                    console.log(error);
                })
            },
            testData2() {
                let url = 'company'
                sendGetRequest(url).then(function(response) {
                    console.log(response.data)
                }.bind(this)).catch(function (error) {
                    console.log(error);
                })
            },
            selectProject(){
                this.selectData.cname = this.query.unitName === ''?'none':this.query.unitName
                this.selectData.pname = this.query.projectName === ''?'none':this.query.projectName
                this.selectData.node = this.query.projectSchedule === ''?'none':this.query.projectSchedule
                this.selectData.type = this.query.projectType === ''?'none':this.query.projectType
                if(this.query.createTime !== ""){
                    if(this.query.createTime2 !== ""){
                        this.selectData.createTimeMin = this.query.createTime + " " + this.query.createTime2
                    }
                    else{
                        this.$message.error('请输入完整的开始时间范围');
                        return
                    }
                }
                if(this.query.createTime3 !== ""){
                    if(this.query.createTime4 !== ""){
                        this.selectData.createTimeMax = this.query.createTime3 + " " + this.query.createTime4
                    }
                    else{
                        this.$message.error('请输入完整的开始时间范围');
                        return
                    }
                }
                if(this.query.endTime !== ""){
                    if(this.query.endTime2 !== ""){
                        this.selectData.finishTimeMin = this.query.endTime + " " + this.query.endTime2
                    }
                    else{
                        this.$message.error('请输入完整的结审时间范围');
                        return
                    }
                }
                if(this.query.endTime3 !== ""){
                    if(this.query.endTime4 !== ""){
                        this.selectData.finishTimeMin = this.query.endTime3 + " " + this.query.endTime4
                    }
                    else{
                        this.$message.error('请输入完整的结审时间范围');
                        return
                    }
                }
                this.getData()

            },

            // 审核操作
            handleDelete(index, row) {
                if(row.status == "绩效待评审"){
                    this.$router.push('/PerformanceReview?pid='+row.pid);
                }
                else if(row.node === '结审' && row.status === '项目结审'){
                    this.$router.push('/read-onlyPerformance?pid='+row.pid);
                }
                else{
                    this.$router.push('/Review?pid='+row.pid);
                }
            },

            // 查看操作
            handleEdit(index, row) {
                this.$router.push('/projectDetails?pid='+row.pid);
            },

            // 分页导航
            handlePageChange(val) {
                this.$set(this.query, 'pageIndex', val);
                this.$set(this.selectData,'pageNum',val)
                this.getData();
            }
        }
    };
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
    .notUse{
        color:#97a8be;
        pointer-events: none;
    }
</style>
<style>
    .handle-box{
        float: left;
    }
    .el-input__inner {
        /*border: 1px;*/
        pointer-events: auto;
    }
</style>