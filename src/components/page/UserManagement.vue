<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 用户管理
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
                <el-input v-model="selectData.username" placeholder="用户账号" class="handle-input mr10" style="width: 14%"></el-input>
                <el-input v-model="selectData.realname" placeholder="用户名" class="handle-input mr10" style="width: 14%"></el-input>
                <el-input v-model="selectData.rname" placeholder="角色" class="handle-input mr10" style="width: 14%"></el-input>
                <el-input v-model="selectData.cname" placeholder="所属单位" class="handle-input mr10" style="width: 14%"></el-input>
                <el-input v-model="selectData.isusable" placeholder="是否可用" class="handle-input mr10" style="width: 14%"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" icon="el-icon-news" @click="handleaddSearch">新增</el-button>
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
                <el-table-column prop="username" label="用户账号" align="center"></el-table-column>
                <el-table-column prop="realname" label="用户名" align="center"></el-table-column>
                <el-table-column prop="rname" label="角色" align="center"></el-table-column>
                <el-table-column prop="cname" label="所属单位" align="center"></el-table-column>
                <el-table-column prop="isusable" label="是否可用" align="center"></el-table-column>
                <el-table-column label="操作" width="250" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-lock"
                                @click="handLogout(scope.$index, scope.row)"
                        >注销</el-button>
                        <el-button
                                type="text"
                                icon="el-icon-refresh"
                                @click="handReset(scope.$index, scope.row)"
                        >重置密码</el-button>
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
        <el-dialog title="编辑" :visible.sync="editVisible" width="40%">
            <el-form ref="form" :model="form" label-width="70px" style="width: 70%;margin-left: 15%">
                <el-form-item label="用户名">
                    <el-input v-model="form.realname"></el-input>
                </el-form-item>
                <el-form-item label="角色">
                    <el-cascader :options="roleOptions" v-model="form.rname" style="width: 100%"></el-cascader>
                </el-form-item>
                <el-form-item label="所属单位">
                    <el-cascader :options="companyOptions" v-model="form.cname" style="width: 100%"></el-cascader>
                </el-form-item>
                <el-form-item label="新密码">
                    <el-input v-model="form.nPassword" type="password" placeholder="可选"></el-input>
                </el-form-item>
                <el-form-item label="再次输入">
                    <el-input v-model="form.nPassword2" type="password" placeholder="可选"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑新增框 -->
        <el-dialog title="新增" :visible.sync="addVisible" width="40%">
            <el-form ref="form" :model="form" label-width="70px" style="width: 70%;margin-left: 15%">
                <el-form-item label="用户账号">
                    <el-input v-model="form.username"></el-input>
                </el-form-item>
                <el-form-item label="用户名">
                    <el-input v-model="form.realname"></el-input>
                </el-form-item>
                <el-form-item label="角色">
                    <el-cascader :options="roleOptions" v-model="form.rname" style="width: 100%"></el-cascader>
                </el-form-item>
                <el-form-item label="所属单位">
                    <el-cascader :options="companyOptions" v-model="form.cname" style="width: 100%"></el-cascader>
                </el-form-item>
                <el-form-item label="是否可用">
                    <el-radio-group v-model="form.isusable">
                        <el-radio label="可用"></el-radio>
                        <el-radio label="不可用"></el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAdd">确 定</el-button>
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
        name: "UserManagement",
        data() {
            return {
                query: {
                    pageIndex: 1,
                    pageSize: 15
                },
                tableData: [
                ],
                multipleSelection: [],
                delList: [],
                editVisible: false,
                addVisible:false,
                pageTotal: 0,
                form: {
                    isusable: "可用",
                    username : '',
                    realname: '',
                    cid: '',
                    rid: '',
                    nPassword:'',
                    nPassword2:''
                },
                companyOptions: [],
                roleOptions:[],
                idx: -1,
                id: -1,
                selectData:{
                    "cname":'',
                    "isusable":'',
                    "page": {
                        pageNum: 1,
                        pageSize: 15
                    },
                    "realname":'',
                    "rname":'',
                    "username":''
                }
            };
        },
        created() {
            this.getData();
            this.getCompanyOptionData()
            this.getRoleOptionData()
        },
        methods: {
            // 获取 easy-mock 的模拟数据
            getData() {
                let selData = {}
                if(this.selectData.cname != ''){
                    selData.cname = this.selectData.cname
                }
                if(this.selectData.isusable != ''){
                    if(this.selectData.isusable == '可用'){
                        selData.isusable = 1
                    }else{
                        selData.isusable = 0
                    }
                }
                if(this.selectData.page != ''){
                    selData.page = this.selectData.page
                }
                if(this.selectData.realname != ''){
                    selData.realname = this.selectData.realname
                }
                if(this.selectData.rname != ''){
                    selData.rname = this.selectData.rname
                }
                if(this.selectData.username != ''){
                    selData.username = this.selectData.username
                }
                let url = 'user/vague'
                //let url = 'user/listrc'
                sendPostRequest(url,selData).then(function (response) {
                console.log(response)
                    this.tableData = response['data']['data']['list']
                    this.$set(this, 'pageTotal', response['data']['data']['total'])
                    this.$set(this.query, 'pageSize', response['data']['data']['pageSize'])
                    for(let i = 0;i<this.tableData.length;i++){
                        if(this.tableData[i].isusable == 1){
                            this.tableData[i].isusable = '可用'
                        }else{
                            this.tableData[i].isusable = '不可用'
                        }
                    }
                }.bind(this)).catch(function (error) {
                    console.log(error);
                })
            },
            //获取单位信息
            getCompanyOptionData(){
                let url = 'company/findParent'
                sendGetRequest(url).then(function (response) {
                    if (response['data'].code == 200) {
                        let companyData = response['data']['data']['list']
                        for(let i = 0; i < companyData.length; i++){
                            let data = {}
                            data.value =companyData[i]['cid']
                            data.label = companyData[i]['cname']
                            this.companyOptions.push(data)
                        }
                    }else{
                        this.getCompanyOptionData()
                    }
                }.bind(this)).catch(function (error) {
                    this.getCompanyOptionData()
                })
            },
            //获取角色信息
            getRoleOptionData(){
                let url = 'role'
                sendGetRequest(url).then(function (response) {
                    if (response['data'].code == 200) {
                        let roleData = response['data']['data']
                        for(let i = 0; i < roleData.length; i++){
                            let data = {}
                            data.value =roleData[i]['rid']
                            data.label = roleData[i]['rname']
                            this.roleOptions.push(data)
                        }
                    }else{
                        this.getRoleOptionData()
                    }
                }.bind(this)).catch(function (error) {
                    this.getRoleOptionData()
                })
            },
            // 触发搜索按钮
            handleSearch() {
                this.$set(this.query, 'pageIndex', 1);
                console.log(this.selectData)
                this.getData();
            },
            //新增操作
            handleaddSearch(){
                this.form = {
                    isusable: "可用",
                    username : '',
                    realname: '',
                    cid: '',
                    rid: '',
                },
                this.addVisible = true
            },
            saveAdd(){
                let userData = {
                    username : this.form.username,
                    realname: this.form.realname,
                    cid: this.form.cname[0],
                    rid: this.form.rname[0],
                    isusable: this.form.isusable == "可用" ? 1:0
                }
                if(this.checkEmail(userData.username)){
                    sendPostRequest('user',userData).then(function (response) {
                        console.log(response)
                        if (response['data'].code == 200) {
                            this.$message.success('新增成功');
                            this.addVisible = false;
                            this.getData()
                        }else {
                            this.$message.error('新增失败');
                        }
                    }.bind(this)).catch(function (error) {
                        console.log(error);
                        this.$message.error('新增失败');
                    })
                }
            },
            // 删除操作
            handleDelete(index, row) {
                // 二次确认删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        let url = 'user'
                        sendDelRequest(url,[row['uid']]).then(function (response) {
                            if (response['data'].code == 200) {
                                this.$message.success('删除成功');
                                this.getData()
                            }
                            else {
                                this.$message.error('删除失败')
                            }
                        }.bind(this)).catch(function (error) {
                            this.$message.error('删除失败')
                            this.getData()
                        })
                    })
                    .catch(() => {
                        this.$message.error('删除失败')
                    });
            },
            // 多选操作
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            delAllSelection() {
                const length = this.multipleSelection.length;
                if (length == 0) {
                    return
                }
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        let str = '';
                        let dels = [];
                        let that = this
                        let url ='user'
                        this.delList = this.delList.concat(this.multipleSelection);
                        for (let i = 0; i < length; i++) {
                            str += this.multipleSelection[i]['uid'] + ' ';
                            dels.push(this.multipleSelection[i]['uid'])
                        }
                        sendDelRequest(url,dels).then(function (response) {
                            if (response['data'].code == 200) {
                                this.$message.success(`删除了${str}`);
                                this.multipleSelection = [];
                                this.getData()
                            }
                        }.bind(this)).catch(function (error) {
                            console.log(error);
                            that.$message.error(`删除失败`);
                        })
                    })
                    .catch(() => {
                    });
            },
            //注销操作
            handLogout(index, row){
                console.log(row)
                this.$confirm('确定注销该用户吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        if(row.isusable == 0){
                            this.$message.error('该用户已注销')
                            return
                        }
                        let userData = {
                            uid: row.uid,
                            username : row.username,
                            realname: row.realname,
                            cid: row.cid,
                            rid: row.rid,
                            isusable: 0,
                            password: row.password
                        }
                        //let url = 'user/updateUser1'
                        let url = 'user'
                        sendPutRequest(url,userData).then(function (response) {
                            console.log(response)
                            if (response['data'].code == 200) {
                                this.$message.success(`注销成功`);
                                this.getData()
                                this.editVisible = false;
                            }else {
                                this.$message.error('注销失败');
                            }
                        }.bind(this)).catch(function (error) {
                            this.$message.error(`注销失败`);
                        })
                    })
                    .catch(() => {
                        this.$message.error('注销失败')
                    });
            },
            //重置操作
            handReset(index, row){
                this.$confirm('确定重置密码吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        let userData = {
                            uid: row.uid,
                            username : row.username,
                            realname: row.realname,
                            cid: row.cid,
                            rid: row.rid,
                            isusable: row.isusable == "可用" ? 1:0,
                            password: "123456"
                        }
                        //let url = 'user/updateUser1'
                        let url = 'user'
                        sendPutRequest(url,userData).then(function (response) {
                            console.log(response)
                            if (response['data'].code == 200) {
                                this.$message.success(`重置成功`);
                                this.getData()
                                this.editVisible = false;
                            }else {
                                this.$message.error('重置失败');
                            }
                        }.bind(this)).catch(function (error) {
                            this.$message.error(`重置失败`);
                        })
                    })
                    .catch(() => {
                        this.$message.error('重置失败')
                    });
            },
            // 编辑操作
            handleEdit(index, row) {
                this.idx = index;
                this.form = JSON.parse(JSON.stringify(row));
                this.form.cname = row.cid
                this.form.rname = row.rid
                this.editVisible = true;
                console.log(row)
            },
            // 保存编辑
            saveEdit() {
                this.editVisible = false;
                let userData = {
                    uid: this.form.uid,
                    username : this.form.username,
                    realname: this.form.realname,
                    cid: this.form.cname[0],
                    rid: this.form.rname[0],
                    isusable: this.form.isusable == "可用" ? 1:0,
                    password: this.form.password
                }
                if(this.form.nPassword != '' || this.form.nPassword2 != ''){
                    if(this.form.nPassword !== this.form.nPassword2){
                        this.$message.error('两次密码输入不同');
                        return
                    }else{
                        userData.password = this.form.nPassword
                    }
                }
                //let url = 'user/updateUser1'
                let url = 'user'
                sendPutRequest(url,userData).then(function (response) {
                    console.log(response)
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
                this.$set(this.selectData.page, 'pageNum', val);
                this.getData()
            },
            //验证Email
            checkEmail(username){
                let reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"); //正则表达式
                if(username === ""){ //输入不能为空
                    alert("用户名不能为空!");
                    return false;
                }else if(!reg.test(username)){ //正则验证不通过，格式不对
                    alert("非法的邮箱格式!");
                    return false;
                }else{
                    return true;s
                }
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