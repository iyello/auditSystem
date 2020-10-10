<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 权限管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box" style="width: 100%">
                <el-button
                        type="primary"
                        icon="el-icon-delete"
                        class="handle-del mr10"
                        @click="delAllSelection"
                >批量删除</el-button>
                <el-input v-model="selectData.aname" placeholder="名称" class="handle-input mr10" style="width: 18%"></el-input>
                <el-cascader :options="ModuleList" v-model="selectData.module" placeholder="模块" style="width: 18%;margin-right: 10px"></el-cascader>
<!--                <el-input v-model="selectData.module" placeholder="模块" class="handle-input mr10" style="width: 18%"></el-input>-->
                <el-input v-model="selectData.submodule" placeholder="子模块" class="handle-input mr10" style="width: 18%"></el-input>
                <el-input v-model="selectData.action" placeholder="动作" class="handle-input mr10" style="width: 18%"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" icon="el-icon-news" @click="addPermission">新增</el-button>
            </div>
            <el-table
                    :data="tableData"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
                    @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>y
                <el-table-column prop="aid" label="ID" align="center"></el-table-column>
                <el-table-column prop="aname" label="名称" align="center"></el-table-column>
                <el-table-column prop="module" label="模块" align="center"></el-table-column>
                <el-table-column prop="submodule" label="子模块" align="center"></el-table-column>
                <el-table-column prop="action" label="动作" align="center"></el-table-column>
                <el-table-column prop="method" label="method" align="center"></el-table-column>
                <el-table-column prop="url" label="URL" align="center"></el-table-column>
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
                        :current-page="query.pageIndex"
                        :page-size="query.pageSize"
                        :total="pageTotal"
                        @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="名称" style="width: 70%;margin-left: 15%">
                    <el-input v-model="form.aname"></el-input>
                </el-form-item>
                <el-form-item label="模块" style="width: 70%;margin-left: 15%">
                    <el-input v-model="form.module"></el-input>
                </el-form-item>
                <el-form-item label="子模块" style="width: 70%;margin-left: 15%">
                    <el-input v-model="form.submodule"></el-input>
                </el-form-item>
                <el-form-item label="动作" style="width: 70%;margin-left: 15%">
                    <el-input v-model="form.action"></el-input>
                </el-form-item>
                <el-form-item label="method" style="width: 70%;margin-left: 15%">
                    <el-input v-model="form.method"></el-input>
                </el-form-item>
                <el-form-item label="URL" style="width: 70%;margin-left: 15%">
                    <el-input v-model="form.url"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑新增框 -->
        <el-dialog title="新增" :visible.sync="addVisible" width="40%">
            <el-form ref="add" :model="add" label-width="140px" style="margin-left: 7%">
                <el-form-item label="名称">
                    <el-input v-model="add.aname" style="width: 70%"></el-input>
                </el-form-item>
                <el-form-item label="模块">
                    <el-cascader
                            :options="ModuleList2"
                            v-model="add.module"
                            style="width: 70%"
                            @change="getSubModule"
                    ></el-cascader>
<!--                    <el-input v-model="add.module" style="width: 70%"></el-input>-->
                </el-form-item>
                <el-form-item label="子模块">
                    <el-cascader :options="subModuleList" v-model="add.submodule" style="width: 70%"></el-cascader>
<!--                    <el-input v-model="add.submodule" style="width: 70%"></el-input>-->
                </el-form-item>
                <el-form-item label="动作">
                    <el-input v-model="add.action" style="width: 70%"></el-input>
                </el-form-item>
                <el-form-item label="method">
                    <el-input v-model="add.method" style="width: 70%"></el-input>
                 </el-form-item>
                <el-form-item label="URL">
                    <el-input v-model="add.url" style="width: 70%"></el-input>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="handAddPermission">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { sendPostRequest } from '../../api/index';
    import { sendGetRequest } from '../../api/index';
    import { sendPutRequest } from '../../api/index';
    import { sendDelRequest } from '../../api/index';
    export default {
        name: 'PermissionManager',
        data() {
            return {
                query: {
                    aname: '',
                    pageIndex: 1,
                    pageSize: 10
                },
                tableData: [],
                ModuleList:[],
                ModuleList2:[],
                subModuleList:[],
                multipleSelection: [],
                delList: [],
                editVisible: false,
                addVisible: false,
                pageTotal: 1,
                form: {},
                add:{},
                idx: -1,
                id: -1,
                pageNow: 1,
                allPage: 1,
                allData: [],
                selectData:{
                    "aname":'',
                    "module":'',
                    "submodule":'',
                    "action":'',
                }
            };
        },
        created() {
            this.selectData.page = {
                pageNum: 1,
                pageSize: 10,
            }
            this.getData();
            this.getModuleList();
        },
        methods: {
            getModuleList(){
                let url1 = 'module/moduleNames'
                sendGetRequest(url1).then(function(response) {
                    this.ModuleList.splice(this.ModuleList.length,0,{
                        label:"所有模块",
                        value:""
                    })
                    for(let i = 0;i<response.data.data.length;i++){
                        this.ModuleList.splice(this.ModuleList.length,0,{   //搜索框，可选择所有模块
                            label:response.data.data[i],
                            value:response.data.data[i]
                        })
                        this.ModuleList2.splice(this.ModuleList.length,0,{  //新增框，不可选择所有模块
                            label:response.data.data[i],
                            value:response.data.data[i]
                        })
                    }
                }.bind(this)).catch(function (error) {
                    console.log(error);
                })
            },
            getData() {
                let url = 'authority/vague'
                if(Array.isArray(this.selectData.module)){
                    this.selectData.module = this.selectData.module[0]
                }
                sendPostRequest(url,this.selectData).then(function(response) {
                    //console.log(response)
                    this.tableData = response['data']['data']['list']
                    this.$set(this, 'pageTotal', response['data']['data']['total'])
                    this.$set(this.query, 'pageSize', response['data']['data']['pageSize'])
                }.bind(this)).catch(function (error) {
                    console.log(error);
                })
            },
            getSubModule(){
                this.subModuleList = []
                let url1 = 'module/subModule?moduleName=' + this.add.module[0]
                sendGetRequest(url1).then(function(response) {
                    for(let i = 0;i<response.data.data.length;i++) {
                        this.subModuleList.splice(this.subModuleList.length, 0, {   //搜索框，可选择所有模块
                            label: response.data.data[i],
                            value: response.data.data[i]
                        })
                    }
                }.bind(this)).catch(function (error) {
                    console.log(error);
                })
            },
            // 触发搜索按钮
            handleSearch() {
                this.selectData.page = {
                    pageNum: 1,
                    pageSize: 10,
                }
                this.getData();
            },
            // 删除操作
            handleDelete(index, row) {
                // 二次确认删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        let url = 'authority'
                        sendDelRequest(url,[this.tableData[index]['aid']]).then(function(response) {
                            if(response['data'].code == 200){
                                this.$message.success('删除成功');
                                this.getData()
                            }else {
                                this.$message.error('删除失败');
                            }
                        }.bind(this)).catch(function (error) {
                            this.$message.error('删除失败')
                            this.getData()
                        })
                    })
                    .catch(() => {});
            },
            // 多选操作
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            delAllSelection() {
                const length = this.multipleSelection.length;
                if(length == 0){
                    return
                }
                let str = '';
                let dels = new Array();
                let that = this
                this.delList = this.delList.concat(this.multipleSelection);
                for (let i = 0; i < length; i++) {
                    str += this.multipleSelection[i]['aid']+ ' ';
                    dels.push(this.multipleSelection[i]['aid'])
                }
                let url = 'authority'
                sendDelRequest(url,dels).then(function(response) {
                    if(response['data'].code == 200){
                        this.$message.success(`删除了${str}`);
                        this.multipleSelection = [];
                        this.getData()
                    }else {
                        this.$message.error('删除失败');
                    }
                }.bind(this)).catch(function (error) {
                    console.log(error);
                    that.$message.error(`删除失败`);
                })
            },
            // 编辑操作
            handleEdit(index, row) {
                this.idx = index;
                this.form = JSON.parse(JSON.stringify(row));
                this.editVisible = true;
            },
            // 保存编辑
            saveEdit() {
                let url = 'authority'
                sendPutRequest(url,this.form).then(function (response) {
                    if (response['data'].code == 200) {
                        this.$message.success(`修改第 ${this.idx + 1} 行成功`);
                        this.getData()
                        this.editVisible = false;
                    }else {
                        this.$message.error('修改失败');
                    }
                }.bind(this)).catch(function (error) {
                    this.$message.error(`修改失败`);
                })
            },
            // 分页导航
            handlePageChange(val) {
                this.$set(this.query, 'pageIndex', val);
                this.selectData.page = {
                    pageNum: val,
                    pageSize: 10,
                }
                this.getData()
            },
            addPermission(){
                this.add = {}
                this.subModuleList = [];
                this.addVisible = true
            },
            //单个新增
            handAddPermission(){
                let url = 'authority'
                if(Array.isArray(this.add.module)){
                    this.add.module = this.add.module[0]
                }
                if(Array.isArray(this.add.submodule)){
                    this.add.module = this.add.submodule[0]
                }
                sendPostRequest(url,this.add).then(function (response) {
                console.log(response)
                    if (response['data'].code == 200) {
                        this.$message.success('新增成功');
                        this.getData()
                        this.addVisible = false;
                    }else {
                        this.$message.error('新增失败');
                    }
                }.bind(this)).catch(function (error) {
                    this.$message.error('新增失败');
                    console.log(response)
                })
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