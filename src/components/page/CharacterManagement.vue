<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 角色管理
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
                <el-input v-model="selectData.rname" placeholder="角色名称" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" icon="el-icon-news" @click="newCharacter">新增</el-button>
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
                <el-table-column prop="rid" label="编号" align="center"></el-table-column>
                <el-table-column prop="rname" label="角色名称" align="center"></el-table-column>
                <el-table-column prop="description" label="角色描述" align="center"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click="handleEdit(scope.$index, scope.row)"
                                id="scope.row.description"
                                :class="scope.row.description === '系统管理员'? 'success':''"
                        >角色权限管理</el-button>
                        <el-button
                                type="text"
                                icon="el-icon-delete"
                                class="red"
                                @click="handleDelete(scope.$index, scope.row)"
                                :class="scope.row.description === '系统管理员'? 'success':''"
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
        <el-dialog title="权限管理" :visible.sync="editVisible" width="60%" style="margin-top: -50px">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="角色" style="margin-top: -20px">
                    <el-input v-model="name" style="width:200px" id="character"></el-input>
                </el-form-item>


                <div class="container">
                    <table class="Managementtable" id="testTb1" border="1">
                        <tr>
                            <th><p></p></th>
                            <th><p>模块</p></th>
                            <th style="width:150px;"><p>子模块</p></th>
                            <th style="width:200px;"><p>动作</p></th>
                        </tr>
                        <tr>
                            <td style="width: 60px;height: 300px"><i class="el-icon-lx-add" style="vertical-align: center"></i></td>
                            <td style="vertical-align:top;width: 250px">
                                <div>
                                    <el-select v-model="form.region" id="module" placeholder="请选择" class="DropDownBox" @change="executedata">
                                        <el-option key="xmgl" label="项目管理" value="项目管理"></el-option>
                                        <el-option key="tjbb" label="统计报表" value="统计报表"></el-option>
                                        <el-option key="dwgl" label="单位管理" value="单位管理"></el-option>
                                        <el-option key="yhgl" label="用户管理" value="用户管理"></el-option>
                                        <el-option key="jsgl" label="角色管理" value="角色管理"></el-option>
                                        <el-option key="zlgl" label="资料管理" value="资料管理"></el-option>
                                    </el-select>
                                </div>
                            </td>
                            <td id="submodule">
                                <div>
                                    <el-form-item>
                                        <el-cascader style="margin-left: -70px; width: 90%; margin-top: 10px"
                                                     :options="subModule"
                                                     v-model="form.subModule"
                                                     @change="showSubModule"></el-cascader>
                                    </el-form-item>
                                </div>
                            </td>
                            <td>
                                <div id="actionbox"></div>
                            </td>
                        </tr>
                    </table>
                </div>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑新增框 -->
        <el-dialog title="新增" :visible.sync="addVisible" width="40%">
            <el-form ref="add" :model="add" label-width="140px" style="margin-left: 7%">
                <el-form-item label="角色名称">
                    <el-input v-model="add.rname" style="width: 70%"></el-input>
                </el-form-item>
                <el-form-item label="角色描述">
                    <el-input v-model="add.description" style="width: 70%"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="handAddCharacter">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>


<script>
    import {sendGetRequest, sendPostRequest, sendPutRequest, sendDelRequest} from "../../api";
    export default {
        name: 'CharacterManagement',
        data() {
            return {
                query: {
                    address: '',
                    name: '',
                    pageIndex: 1,
                    pageSize: 10
                },
                ManagementData: [
                    {

                        submodule: 'submodule',
                        action: 'action'
                    }
                ],
                add:{},
                imgurl: '../../assets/img/plus.png',
                tableData: [],
                multipleSelection: [],
                delList: [],
                editVisible: false,
                addVisible:false,
                pageTotal: 0,
                name:'name',
                form: {
                    name:'name1',
                    region: '',
                    subModule:''
                },
                idx: -1,
                id: -1,
                actionData:[],
                userData:[],
                rid : '',
                role:'',
                selectData:{

                },
                subModule:[],
                item: {},
            }
        },
        created() {
            this.selectData.page = {
                pageNum: 1,
                pageSize: 10,
            }
            this.getData();
        },

        methods: {
            // 获取 easy-mock 的模拟数据
            getData() {
                let url = 'role/vague'
                sendPostRequest(url,this.selectData).then(function (response) {
                    this.tableData = response['data']['data']['list']
                    this.$set(this, 'pageTotal', response['data']['data']['total'])
                    this.$set(this.query, 'pageSize', response['data']['data']['pageSize'])
                }.bind(this)).catch(function (error) {
                    console.log(error);
                })
            },


            // 触发搜索按钮
            handleSearch() {
                this.$set(this.query, 'pageIndex', 1);
                this.selectData.page = {
                    pageNum: 1,
                    pageSize: 10,
                }
                this.getData();
            },
            newCharacter(){
                this.add = {}
                this.addVisible = true
            },
            // 删除操作
            handleDelete(index, row) {
                if(row.description === '系统管理员'){
                    this.$message.error('系统管理员角色无法删除')
                    return
                }
                // 二次确认删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        let url = 'role'
                        sendDelRequest(url,[this.tableData[index]['rid']]).then(function (response) {
                            if (response['data'].code == 200) {
                                this.$message.success('删除成功');
                                this.getData()
                            }
                        }.bind(this)).catch(function (error) {
                            this.$message.error('删除失败')
                            this.getData()
                        })
                    })
                    .catch(() => {
                    });
            },
            // 多选操作
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            delAllSelection: function () {
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
                        let url ='role'
                        this.delList = this.delList.concat(this.multipleSelection);
                        for (let i = 0; i < length; i++) {
                            if(this.multipleSelection[i].description === '系统管理员'){
                                this.$message.error('系统管理员角色无法删除')
                                return
                            }
                            str += this.multipleSelection[i]['rid'] + ' ';
                            dels.push(this.multipleSelection[i]['rid'])
                        }
                        sendDelRequest(url,dels).then(function (response) {
                            console.log(response)
                            if (response['data'].code == 200) {
                                this.$message.success(`删除成功`);
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
            // 编辑操作
            handleEdit(index, row) {
                if(row.description === '系统管理员'){
                    this.$message.error('系统管理员默认拥有所有权限')
                    return
                }
                this.idx = index;
                this.form = row;
                this.editVisible = true;
                this.name = ''
                $("#actionbox").html('');
                $("#actionbox").append('');
                this.$set(this.form, 'region', '')
                this.$set(this, 'name', '')
                this.subModule = [];
                if(this.actionData == ''){
                    this.getActionData()
                }
                this.getRidData(row['rid'])
            },
            //获取所有action数据
            getActionData() {
                this.actionData = []
                this.role = []
                this.name = ''
                let url = 'authority'
                sendGetRequest(url).then(function (response) {
                    this.actionData = response['data']['data']
                }.bind(this)).catch(function (error) {
                    this.$message.error('查询失败')
                })
            },
            initAllAction(){
                let module = this.form.region;
                let items = document.getElementsByName("item");
                let tbBody = ''
                let actionBody = '<div style="display:inline-block;">'
                $("#actionbox").html('');
                $("#actionbox").append('');
                for (let i = 0; i < this.actionData.length; i++) {
                    actionBody = actionBody +
                        '<p id=' + this.actionData[i]['aid'] + ' style=display:none >' +
                        '<input type="checkbox" name="item" class="checkbox" '+
                        'value=' + this.actionData[i]['aid'] + '>' +
                        '<label>' + this.actionData[i]['aname'] + '</label>'+
                        '</p>'
                }
                actionBody = actionBody + '</div>'
                $("#actionbox").append(actionBody);
                for (let i = 0; i < this.userData.length; i++) {
                    for (let j = 0; j < items.length; j++) {
                        if (this.userData[i]['aid'] == items[j].value) {
                            items[j].checked = true
                            break;
                        }
                    }
                }
            },
            //获取用户权限
            getRidData(rid) {
                this.role = []
                this.role.rname = ''
                let url = 'roleAuthority/' + rid
                sendGetRequest(url).then(function (response) {
                    this.userData = response['data']['data']
                    this.rid = rid
                    for(let i = 0; i < this.tableData.length;i++){
                        if(this.tableData[i]['rid'] == rid){
                            this.role = this.tableData[i]
                            this.$set(this, 'name', this.role['rname'])
                            break
                        }
                    }
                    this.initAllAction()
                }.bind(this)).catch(function (error) {
                    this.$message.error('查询失败')
                })
            },
            showSubModule(){
                let module = this.form.region;
                let items = document.getElementsByName("item");
                for (let i = 0; i < this.actionData.length; i++) {
                    if(this.actionData[i]['module'] === module){
                        document.getElementById(this.actionData[i]['aid']).style.display= "";
                        if(this.form.subModule[0] == -1){
                            continue
                        }
                        if (this.actionData[i]['submodule'] !== this.form.subModule[0]) {
                            document.getElementById(this.actionData[i]['aid']).style.display= "none";
                        }
                    }
                }
            },
            executedata() {
                let module = this.form.region;
                let items = document.getElementsByName("item");
                for (let i = 0; i < this.actionData.length; i++) {
                    if (this.actionData[i]['module'] === module) {
                        document.getElementById(this.actionData[i]['aid']).style.display= "";
                    }else{
                        document.getElementById(this.actionData[i]['aid']).style.display= "none";
                    }
                }
                this.subModule = [];
                this.subModule.push({
                    label:'所有',
                    value:'-1',
                })
                let k = 1
                for(let i = 0; i<this.actionData.length;i++){
                    if (this.actionData[i]['module'] === module) {
                        for(let j = 0;j<this.subModule.length;j++){
                            if(this.subModule[j].value === this.actionData[i]['submodule']){
                                k = 0;
                                break;
                            }
                        }
                        if(k){
                            this.subModule.push({
                                label:this.actionData[i+1]['submodule'],
                                value:this.actionData[i+1]['submodule'],
                            })
                        }
                        k = 1;
                    }
                }
            },
            // 保存编辑
            saveEdit() {
                this.subModule = [];
                this.save()
            },
            // 分页导航
            handlePageChange(val) {
                this.$set(this.query, 'pageIndex', val);
                this.selectData.page = {
                    pageNum: val,
                    pageSize: 10,
                }
                this.getData();
            },
            save() {
                let per_del = []
                let per_new = []
                let roleAuthoritylist = []
                let dellist = []
                let module = this.form.region
                let items = document.getElementsByName("item");
                for (let j = 0; j < items.length; j++) {
                    let k = 1
                    if (items[j].checked === true) {
                        for (let i = 0; i < this.userData.length ;i++){
                            if(items[j].value == this.userData[i]['aid']){
                                k = 0
                                break;
                            }
                        }
                        if(k){
                            per_new.push(items[j].value)
                        }
                    }else {
                        per_del.push(items[j].value)
                    }
                }
                for (let i = 0; i < per_del.length; i++) {
                    for (let j = 0; j < this.userData.length; j++) {
                        if (this.userData[j]['aid'] == per_del[i]) {
                            dellist.push(this.userData[j]['id'])
                            break;
                        }
                    }
                }
                let k = 1   //rname是否修改
                if(this.role['rname'] !== this.name){
                    this.role['rname'] = this.name
                    k = 0
                }

                for (let i = 0; i < per_new.length; i++) {
                    let action
                    let rid = this.rid
                    let role = this.role
                    let authority = {}
                    let roleAuthority = {}
                    for (let j = 0; j < this.actionData.length; j++) {
                        if (this.actionData[j]['aid'] === per_new[i]) {
                            action = this.actionData[j]['action']
                            break;
                        }
                    }

                    authority.aid = per_new[i]
                    authority.action = action
                    roleAuthority.aid = per_new[i]
                    roleAuthority.rid = rid
                    roleAuthority.role = role
                    roleAuthority.authority = authority
                    roleAuthoritylist[i] = roleAuthority
                }
                if(k == 0){
                    this.changerName(this.role,dellist,roleAuthoritylist)
                }else{
                    this.changeRole(dellist,roleAuthoritylist)
                }
            },
            changerName(newrole,dellist,roleAuthoritylist){
                let url = 'role'
                sendPutRequest(url,newrole).then(function (response) {
                    if (response['data'].code === 200) {
                        if(dellist.length > 0 || roleAuthoritylist.length > 0){
                            this.changeRole(dellist,roleAuthoritylist)
                        }else{
                            this.$message.success(`修改成功`);
                            this.getData()
                            this.editVisible = false;
                        }
                    }else{
                        this.$message.error(`修改失败`);
                    }
                }.bind(this)).catch(function (error) {
                    this.$message.error(`修改失败`);
                })
            },
            changeRole(dellist,roleAuthoritylist){
                let df = -1
                let af = -1
                if(dellist.length === 0){
                    df = 1
                }
                if(roleAuthoritylist.length === 0){
                    af = 1
                }
                if (dellist.length > 0) {
                    let url = 'roleAuthority'
                    sendDelRequest(url,dellist).then(function (response) {
                        //console.log(response)
                        if (response['data'].code === 200) {
                            df = 1
                            this.showMessage(df,af)
                        }else {
                            this.$message.error('修改失败');
                        }
                    }.bind(this)).catch(function (error) {
                        df = 0
                        this.showMessage(df,af)
                    })
                }
                if (roleAuthoritylist.length > 0) {
                    let url = 'roleAuthority/J'
                    sendPostRequest(url,roleAuthoritylist).then(function (response) {
                        //console.log(response)
                        if (response['data'].code === 200) {
                            af = 1
                            this.showMessage(df,af)
                        }else {
                            this.$message.error('修改失败');
                        }
                    }.bind(this)).catch(function (error) {
                        af = 0
                        this.showMessage(df,af)
                    })
                }
            },
            showMessage(df,af){
                if(df == -1 || af == -1){
                    return
                }else if(df == af == 1){
                    this.$message.success('修改成功');
                    this.getData()
                    this.editVisible = false;
                }else if(df == 0 || af == 0){
                    this.$message.error('修改失败');
                    this.getData()
                    this.editVisible = false;
                }
            },
            handAddCharacter(){
                let url = 'role'
                if(!this.add.rname || !this.add.description){
                    this.$message.error('角色信息缺失')
                    return
                }
                sendPostRequest(url,this.add).then(function (response) {
                    if (response['data'].code == 200) {
                        this.$message.success('新增成功');
                        this.getData()
                        this.addVisible = false;
                    }else {
                        this.$message.error('新增失败');
                    }
                }.bind(this)).catch(function (error) {
                    console.log(error)
                    this.$message.error('新增失败');
                })
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
    .item-choose{

    }
    .el-table--enable-row-hover .el-table__body tr:hover>td{
        background-color: #FFFFFF !important;
    }

    .DropDownBox{
        height: 24px;
        box-sizing: border-box;
        outline: none;
        line-height: 22px;
        text-align: left;
        font-size: 12px;
        font-weight: 400;
        font-family: 微软雅黑;
        margin-top:10px;
        margin-bottom:20px;
    }
    table,table tr th, table tr td {
        border:1px solid #CCC;
        white-space: nowrap;
        text-align: center;
        font-size: 16px;
        font-weight: 400;
        font-style: normal;
        text-decoration: none;
        font-family: 微软雅黑;
    }
    .Managementtable{
        margin-top:20px;
        width: 100%;
        border: 1.1px solid #000;
        border-collapse: collapse;
    }
    p{
        word-break:break-word;
        font-size: 15px;
        padding: 10px;
        margin-top:10px;
        margin-bottom: 10px;
    }
    .checkbox{
        height:15px;
        width:15px;

    }
    #submodule{
        vertical-align:top;
    }
    #actionbox{
        width: 80%;
        text-align: left;
        margin-left: 10%;
        margin-right: 10%;
    }
    .success{
        color:#97a8be;
    }
</style>
<style>
    .el-input__inner {
        pointer-events: auto;
    }
</style>