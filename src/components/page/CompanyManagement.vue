<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 单位管理
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
                <el-input v-model="query.company" placeholder="单位名称" class="handle-input mr10"></el-input>
                <el-input v-model="query.supCompany" placeholder="上级单位名称" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" icon="el-icon-news" @click="addCompany">新增</el-button>
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
                <el-table-column prop="cid" label="单位编号" align="center"></el-table-column>
                <el-table-column prop="cname" label="单位名称" align="center"></el-table-column>
                <el-table-column prop="cshortname" label="单位简称" align="center"></el-table-column>
                <el-table-column prop="fname" label="上级单位" align="center"></el-table-column>
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

        <!-- 编辑编辑框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="单位名称">
                    <el-input v-model="form.cname"></el-input>
                </el-form-item>
                <el-form-item label="上级单位">
                    <el-cascader :options="options" v-model="form.fname" style="width: 100%"></el-cascader>
                </el-form-item>
                <el-form-item label="单位简称">
                    <el-input v-model="form.cshortname"></el-input>
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
                <el-form-item label="单位名称">
                    <el-input v-model="cname" style="width: 70%"></el-input>
                </el-form-item>
                <el-form-item label="上级单位名称" >
                    <el-cascader id="fName"
                                 :options="options"
                                 v-model="form.fname"
                                 filterable
                                 style="width: 70%;"
                    ></el-cascader>
                </el-form-item>
                <el-form-item label="单位简称">
                    <el-input v-model="cshortname" style="width: 70%"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="handAddCompany">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { sendPostRequest } from '../../api/index';
    import { sendGetRequest } from '../../api/index';
    import { sendPutRequest } from '../../api/index';
    import { sendDelRequest } from '../../api/index';
    import index from "../../router";
    export default {
        name: "CompanyManagement",
        data() {
            return {
                query: {
                    address: 'address',
                    name: 'name',
                    pageIndex: 1,
                    pageSize: 10,
                    company: null,
                    supCompany: null
                },
                selectData:{},
                tableData: [],
                multipleSelection: [],
                delList: [],
                editVisible: false,
                addVisible: false,
                pageTotal: 0,
                form: {},
                add:{},
                idx: -1,
                id: -1,
                options: [],
                allCompanyData:[],
                cname:'',
                cshortname:'',
            };
        },
        created() {
            this.selectData.cname = ''
            this.selectData.fname = ''
            this.selectData.page = {
                pageNum: 1,
                pageSize: 10,
            }
            this.getData();
        },
        methods: {
            // 获取 easy-mock 的模拟数据
            getData() {
                let url = 'company/vague'
                sendPostRequest(url,this.selectData).then(function(response) {
                    //console.log(response['data'])
                    this.tableData = response['data']['data']['list']
                    this.$set(this, 'pageTotal', response['data']['data']['total'])
                    this.$set(this.query, 'pageSize', response['data']['data']['pageSize'])
                    if(this.options == ''){
                        this.getOptionData()
                    }
                }.bind(this)).catch(function (error) {
                    console.log(error);
                })
            },
            getOptionData(){
                let url = 'company'
                sendGetRequest(url).then(function (response) {
                    console.log(response)
                    if (response['data'].code == 200) {
                        let companyData = response['data']['data']
                        this.allCompanyData = response['data']['data']
                        for(let i = 0; i < companyData.length; i++){
                            let data = {}
                            data.value =companyData[i]['cid']
                            data.label = companyData[i]['cname']
                            this.options.push(data)
                        }
                    }else{
                        this.getOptionData()
                    }
                }.bind(this)).catch(function (error) {
                    this.getOptionData()
                    console.log(error)
                })
            },
            createOption(){

            },
            // 触发搜索按钮
            handleSearch() {
                this.$set(this.query, 'pageIndex', 1);
                this.selectData.cname = this.query.company
                this.selectData.fname = this.query.supCompany
                this.selectData.page = {
                    pageNum: 1,
                    pageSize: 10,
                }
                this.getData()
            },
            //触发新增操作
            addCompany(){
                var _this = this;
                this.cname = ''
                this.cshortname = ''
                this.form.fname = ''
                this.addVisible = true;
            },
            //新增操作
            handAddCompany(){
                let companyData ={
                    "cname": this.cname,
                    "cshortname": this.cshortname,
                    "parentCid": this.form.fname[0],
                }
                if(companyData.cname === ''){
                    this.$message.error('请输入单位名称');
                    return
                }else if(companyData.cshortname === '' ){
                    this.$message.error('请输入单位简称');
                    return
                }else if(companyData.parentCid === '' || companyData.parentCid === undefined){
                    this.$message.error('请输入上级单位名称');
                    return
                }
                let url = 'company'
                sendPostRequest(url,companyData).then(function (response) {
                    if (response['data'].code == 200) {
                        this.$message.success('新增成功');
                        this.addVisible = false;
                        this.getData()
                    }else {
                        this.$message.error(response['data'].msg);
                    }
                }.bind(this)).catch(function (error) {
                    console.log(error);
                    this.$message.error('新增失败');
                })
            },
            // 删除操作
            handleDelete(index, row) {
                console.log(1233)
                // 二次确认删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        let url = 'company'
                        sendDelRequest(url,[row['cid']]).then(function (response) {
                            console.log(response)
                            if (response['data'].code == 200) {
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
                if (length == 0) {
                    return
                }
                let str = '';
                let dels = [];
                let that = this
                this.delList = this.delList.concat(this.multipleSelection);
                for (let i = 0; i < length; i++) {
                    str += this.multipleSelection[i]['cid'] + ' ';
                    dels.push(this.multipleSelection[i]['cid'])
                }
                let url = 'company'
                sendDelRequest(url,dels).then(function (response) {
                    if (response['data'].code == 200) {
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
                this.form.fname = [row['parentCid']]
                this.editVisible = true;
            },
            // 保存编辑
            saveEdit() {
                let companyData ={
                    "cid": this.form.cid,
                    "cname": this.form.cname,
                    "cshortname": this.form.cshortname,
                    "parentCid": this.form.fname[0],
                }
                let url = 'company'
                sendPutRequest(url,companyData).then(function (response) {
                    if (response['data'].code == 200) {
                        this.$message.success('编辑成功');
                        this.editVisible = false;
                        this.getData()
                    }else {
                        this.$message.error('编辑失败');
                    }
                }.bind(this)).catch(function (error) {
                    console.log(error);
                    this.$message.error('编辑失败');
                })
            },
            // 分页导航
            handlePageChange(val) {
                this.$set(this.query, 'pageIndex', val);
                this.$set(this.selectData, 'page', {
                        pageNum: val,
                        pageSize: 10,
                });
                this.getData()
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