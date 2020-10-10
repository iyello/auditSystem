<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 模块管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button
                        type="primary"
                        icon="el-icon-delete"
                        class="handle-del mr10"
                        @click="delAllSelection"
                >批量删除</el-button>
                <el-cascader :options="ModuleList" v-model="query.moduleName" placeholder="模块" style="margin-right: 10px"></el-cascader>
                <el-input v-model="query.subModuleName" placeholder="子模块名称" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" icon="el-icon-news" @click="addModuleBox">新增模块</el-button>
                <el-button type="primary" icon="el-icon-news" @click="addSubModuleBox">新增子模块</el-button>
            </div>
            <el-table
                    :data="tableData"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
                    @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="modID" label="编号" align="center"></el-table-column>
                <el-table-column prop="module" label="模块名称" align="center"></el-table-column>
                <el-table-column prop="subModule" label="子模块名称" align="center"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                                type="text"
                                icon="el-icon-delete"
                                class="red"
                                @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                        background
                        layout="total, prev, pager, next"
                        :current-page="query.pageNum"
                        :page-size="query.pageSize"
                        :total="pageTotal"
                        @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 编辑编辑框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="editForm" :model="editForm" label-width="70px">
                <el-form-item label="模块名称">
                    <el-input v-model="editForm.module"></el-input>
                </el-form-item>
                <el-form-item label="子模块">
                    <el-input v-model="editForm.subModule"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑新增框  模块 -->
        <el-dialog title="新增模块" :visible.sync="addModuleVisible" width="40%">
            <el-form ref="form" :model="form" label-width="140px" style="margin-left: 7%">
                <el-form-item label="模块名称">
                    <el-input v-model="form.moduleName" style="width: 70%"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addModuleVisible = false">取 消</el-button>
                <el-button type="primary" @click="addModule">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑新增框  子模块 -->
        <el-dialog title="新增子模块" :visible.sync="addSubModuleVisible" width="30%">
            <el-form ref="form" :model="form" label-width="140px" style="margin-left: 7%">
                <el-form-item label="模块名称">
                    <el-cascader :options="ModuleList" v-model="form.moduleName" style="width: 70%"></el-cascader>
                </el-form-item>
                <el-form-item label="子模块名称">
                    <el-input v-model="form.subModuleName" style="width: 70%"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addSubModuleVisible = false">取 消</el-button>
                <el-button type="primary" @click="addSubModule">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {sendDelRequest, sendGET_J_Request, sendGetRequest, sendPostRequest, sendPutRequest} from "../../api";

    export default {
        name: "ModuleManagement",
        data() {
            return {
                query: {
                    moduleName:'',
                    pageNum: 1,
                    pageSize: 15,
                    subModuleName:''
                },
                ModuleList:[],
                tableData: [],
                multipleSelection: [],
                delList: [],
                editVisible: false,
                pageTotal: 0,
                form: {
                    moduleName:'',
                    subModuleName:''
                },
                editForm: {},
                idx: -1,
                id: -1,
                addModuleVisible : false,
                addSubModuleVisible : false
            };
        },
        created() {
            this.getData();
            this.getModuleList();
        },
        methods: {
            getModuleList(){
                let url1 = 'module/moduleNames'
                sendGetRequest(url1).then(function(response) {
                    this.ModuleList = []
                    this.ModuleList.splice(this.ModuleList.length,0,{
                        label:"所有模块",
                        value:""
                    })
                    for(let i = 0;i<response.data.data.length;i++){
                        this.ModuleList.splice(this.ModuleList.length,0,{
                            label:response.data.data[i],
                            value:response.data.data[i]
                        })
                    }
                }.bind(this)).catch(function (error) {
                    console.log(error);
                })
            },
            getData() {
                let url2 = 'module/modules'
                if(Array.isArray(this.query.moduleName)){
                    this.query.moduleName = this.query.moduleName[0];
                }
                if(Array.isArray(this.query.subModuleName)){
                    this.query.subModuleName = this.query.subModuleName[0];
                }
                sendGET_J_Request(url2,this.query).then(function(response) {
                    this.tableData = response.data.data.datas
                    this.pageTotal = response.data.data.intotal
                }.bind(this)).catch(function (error) {
                    console.log(error);
                })
            },
            addModuleBox(){
                this.form.moduleName = ''
                this.addModuleVisible = true
            },
            addSubModuleBox(){
                this.form.moduleName = ''
                this.form.subModuleName = ''
                this.addSubModuleVisible = true
            },
            addModule(){
                let url = 'module?moduleName=' + this.form.moduleName
                sendPostRequest(url,[]).then(function(response) {
                    if(response.data.code === 200){
                        this.$message.success(response.data.msg);
                        this.getModuleList()
                        this.getData()
                    }else {
                        this.$message.error(response.data.msg);
                    }
                }.bind(this)).catch(function (error) {
                    console.log(error);
                })
                this.addModuleVisible = false
            },
            addSubModule(){
                if(Array.isArray(this.form.moduleName)){
                    this.form.moduleName = this.form.moduleName[0]
                }
                let url = 'module/subModule?moduleName=' + this.form.moduleName + '&subModuleName=' + this.form.subModuleName
                sendPostRequest(url,[]).then(function(response) {
                    if(response.data.code === 200){
                        this.$message.success(response.data.msg);
                        this.getData()
                    }else {
                        this.$message.error(response.data.msg);
                    }
                }.bind(this)).catch(function (error) {
                    console.log(error);
                })
                this.addSubModuleVisible = false
            },
            // 触发搜索按钮
            handleSearch() {
                this.$set(this.query, 'pageNum', 1);
                this.getData();
            },
            // 删除操作
            handleDelete(index, row) {
                // 二次确认删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        let url = 'module/' + row.modID
                        sendDelRequest(url).then(function(response) {
                            if(response.data.code === 200){
                                this.$message.success(response.data.msg);
                                this.getData()
                            }else {
                                this.$message.error(response.data.msg);
                            }
                        }.bind(this)).catch(function (error) {
                            console.log(error);
                        })
                    })
                    .catch(() => {});
            },
            // 多选操作
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            delAllSelection() {
                let delList = []
                for(let i = 0;i < this.multipleSelection.length;i++){
                    delList.splice(delList.length,0,this.multipleSelection[i].modID)
                }
                console.log(delList)
                this.multipleSelection = [];
                // 二次确认删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        let url = 'module'
                        sendDelRequest(url,delList).then(function(response) {
                            console.log(response)
                            if(response.data.code === 200){
                                this.$message.success(response.data.msg);
                                this.getData()
                            }else {
                                this.$message.error(response.data.msg);
                            }
                        }.bind(this)).catch(function (error) {
                            console.log(error);
                        })
                    })
                    .catch(() => {});
            },
            // 编辑操作
            handleEdit(index, row) {
                this.idx = index;
                this.editForm = JSON.parse(JSON.stringify(row));
                this.editVisible = true;
            },
            // 保存编辑
            saveEdit() {
                let url = 'module'
                sendPutRequest(url,this.editForm).then(function(response) {
                    if(response.data.code === 200){
                        this.$message.success(response.data.msg);
                        this.getModuleList()
                        this.getData()
                    }else {
                        this.$message.error(response.data.msg);
                    }
                }.bind(this)).catch(function (error) {
                    console.log(error);
                })
                this.editVisible = false;
            },
            // 分页导航
            handlePageChange(val) {
                this.$set(this.query, 'pageNum', val);
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
</style>
<style>
    .el-input__inner {
        pointer-events: auto;
    }
</style>
