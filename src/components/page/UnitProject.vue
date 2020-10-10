<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 单位项目列表
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <span class="spanSty">项目进度：</span>
                <el-select v-model="query.node" placeholder="全部" class="handle-select mr10" style="width:150px;">
                    <el-option key="1" label="全部" value="全部"></el-option>
                    <el-option key="2" label="预算" value="预算"></el-option>
                    <el-option key="3" label="标书" value="标书"></el-option>
                    <el-option key="4" label="合同" value="合同"></el-option>
                    <el-option key="5" label="结算" value="结算"></el-option>
                    <el-option key="6" label="绩效" value="绩效"></el-option>
                    <el-option key="7" label="结审" value="结审"></el-option>
                </el-select> 
                <span class="spanSty" style="margin-left:15px">创建时间：</span>
                <el-date-picker
                    v-model="query.createTime"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
                <el-button type="primary" icon="el-icon-search" style="margin-left:40px" @click="handleSearch">查询</el-button>
                <br><br>
                <span class="spanSty">项目类型：</span>
                <el-select v-model="query.type" placeholder="全部" class="handle-select mr10" style="width:150px;">
                    <el-option key="1" label="全部" value="全部"></el-option>
                    <el-option key="2" label="货物类采购" value="货物类采购"></el-option>
                    <el-option key="3" label="基建类工程" value="基建类工程"></el-option>
                    <el-option key="4" label="信息化类项目" value="信息化类项目"></el-option> 
                </el-select>
                <span class="spanSty" style="margin-left:15px">结审时间：</span>
                <el-date-picker
                    v-model="query.finishTime"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
                <el-button type="primary" icon="el-icon-creat" @click="handleCreat" style="margin-left:40px">新建项目</el-button>
            </div>
            <el-table
                :data="resultData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="pid" label="项目编号" width="100" align="center"></el-table-column>
                <el-table-column prop="pname" label="项目名称"  width="200" align="center"></el-table-column>
                <el-table-column prop="cid" label="所属单位" align="center"></el-table-column>
                <el-table-column prop="type" label="项目类型" align="center"></el-table-column>
                <el-table-column prop="node" label="项目进度" align="center"></el-table-column>
                <el-table-column prop="status" label="项目状态" align="center"></el-table-column>
                <el-table-column prop="timedOut" label="是否超时" align="center"></el-table-column>
                <el-table-column prop="parentPid" label="父项目" align="center"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
                <el-table-column prop="finishTime" label="结审时间" align="center"></el-table-column>
                <el-table-column label="操作" width="220" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            @click="CreatSubproject(scope.$index, scope.row)"
                        >创建子项目</el-button>
                        <el-button
                            style="margin-left:20px;"
                            type="text"
                            @click="handleDetails(scope.$index, scope.row)"
                        >查看</el-button>
                        <el-button
                            style="margin-left:20px;"
                            type="text"
                            @click="handleSubmit(scope.$index, scope.row)"
                            :class="((scope.row.status !== null &&
                                        scope.row.status[scope.row.status.length - 2] === '提' &&
                                        scope.row.status[scope.row.status.length - 1] === '交')
                                        )? '':'notUse'"
                        >送审</el-button>
                        <br>
                        <el-button
                            v-show = "scope.row.node == '新建'"
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                            v-show = "scope.row.node == '新建'"
                            style="color:red;"
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

        <!-- 新建父级项目弹出框 -->
        <el-dialog title="新建项目" :visible.sync="creatVisible_p" width="40%">
            <el-form ref="creatForm_p" :model="creatForm_p" label-width="150px" label-position="left">
                <el-form-item label="项目名称：">
                    <el-input v-model="creatForm_p.pname"></el-input>
                </el-form-item>
                <el-form-item label="项目类型：">
                    <el-select v-model="creatForm_p.type" class="handle-select mr10" style="width:150px;">
                        <el-option key="1" label="货物类采购" value="货物类采购"></el-option>
                        <el-option key="2" label="基建类工程" value="基建类工程"></el-option>
                        <el-option key="3" label="信息化类项目" value="信息化类项目"></el-option> 
                    </el-select> 
                </el-form-item>
                <el-form-item label="所属单位：">
                    <el-input v-model="user.cname" :readonly="true"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelCreat_p">取 消</el-button>
                <el-button type="primary" @click="saveCreat_p">提 交</el-button>
            </span>
        </el-dialog>

        <!-- 新建子级项目弹出框 -->
        <el-dialog title="新建子级项目" :visible.sync="creatVisible_s" width="40%">
            <el-form ref="creatForm_s" :model="creatForm_s" label-width="150px" label-position="left">
                <el-form-item label="项目名称：">
                    <el-input v-model="creatForm_s.pname"></el-input>
                </el-form-item>
                <el-form-item label="项目类型：">
                    <el-select v-model="creatForm_s.type " class="handle-select mr10" style="width:150px;">
                        <el-option key="1" label="货物类采购" value="货物类采购"></el-option>
                        <el-option key="2" label="基建类工程" value="基建类工程"></el-option>
                        <el-option key="3" label="信息化类项目" value="信息化类项目"></el-option> 
                    </el-select> 
                </el-form-item>
                <el-form-item label="所属单位：">
                    <el-input v-model="user.cname" :readonly="true"></el-input>
                </el-form-item>
                <el-form-item label="父项目编号：">
                    <el-input v-model="creatForm_s.parentPid" :readonly="true"></el-input>
                </el-form-item>
                <el-form-item label="父项目名称：">
                    <el-input v-model="creatForm_s.parentName" :readonly="true"></el-input> 
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelCreat_s">取 消</el-button>
                <el-button type="primary" @click="saveCreat_s">提 交</el-button>
            </span>
        </el-dialog>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="editForm" :model="editForm" label-width="100px">
                <el-form-item label="父项目编号：" v-show= "editForm.parentPid != null">
                    <el-input v-model="editForm.parentPid"></el-input>
                </el-form-item>
                <el-form-item label="项目名称：">
                    <el-input v-model="editForm.pname"></el-input>
                </el-form-item>
                <el-form-item label="项目类型：">
                    <el-select v-model="editForm.type" class="handle-select mr10" style="width:150px;">
                        <el-option key="1" label="货物类采购" value="货物类采购"></el-option>
                        <el-option key="2" label="基建类工程" value="基建类工程"></el-option>
                        <el-option key="3" label="信息化类项目" value="信息化类项目"></el-option>
                    </el-select> 
                </el-form-item>
                <el-form-item label="所属单位：">
                    <el-input v-model="user.cname" :readonly="true"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelEdit">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 详情弹出框 -->
        <el-dialog title="详情" :visible.sync="detailVisible" width="30%">
            <el-form ref="detailForm" :model="detailForm" label-width="130px" label-position="left" style="margin-left:45px;">
                <el-form-item label="项目编号：">
                    <span>{{detailForm.pid}}</span>
                </el-form-item>
                <el-form-item label="项目名称：">
                    <span>{{detailForm.pname}}</span>
                </el-form-item>
                <el-form-item label="所属单位编号：">
                    <span>{{detailForm.cid}}</span>
                </el-form-item>
                <el-form-item label="所属单位名称：">
                    <span>{{detailForm.cname}}</span>
                </el-form-item>
                <el-form-item label="项目文号：">
                    <span>{{detailForm.fid}}</span>
                </el-form-item>
                <el-form-item label="项目类型：">
                    <span>{{detailForm.type}}</span>
                </el-form-item>
                <el-form-item label="项目进度：">
                    <span>{{detailForm.node}}</span>
                </el-form-item>
                <el-form-item label="项目状态：">
                    <span>{{detailForm.status}}</span>
                </el-form-item>
            </el-form>
        </el-dialog>

    </div>
</template>

<script>
import { UnitProject } from '../../api/index';//全部数据接口
import { EditUnitProject } from '../../api/index';//编辑接口
import { CreatParentProject } from '../../api/index';//新建父项目接口
import { CreatSubProject } from '../../api/index';//新建子项目接口
import { DeleteUnitProject } from '../../api/index';//删除接口
import { SearchUnitProject } from '../../api/index';//查询接口
import { GetUnits } from '../../api/index';//获取单位id和名称接口
import { DetailUnitProject } from '../../api/index';//查看项目详情

export default {
    name: 'basetable',
    data() {
        return {
            query: {
                node: '', //项目进度
                type: '', //项目类型
                createTime: '',
                finishTime: '',
                pageIndex: 1,
                pageSize: 10,
            },
            query_send: {},
            resultData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            creatVisible_p: false,
            creatVisible_s: false,
            detailVisible: false,
            pageTotal: 0,
            editForm: {},
            detailForm: {},//详情
            creatForm_p: {}, //新建父级
            creatForm_s: {}, //新建子级
            idx: -1,
            id: -1 ,
            unitsListItems: [],//所有单位id和名称
            user: {},//存储登录用户信息，uid，cid，cname
        };
    },
    computed: {
    },
    created() {
        this.getUser(); //获取单位id和名称
        this.getData(); 
    },
    methods: {
        // 开始，获取后台所有数据
        getData() {
            UnitProject(this.query,this.user).then(res => {
                if(res.code === 200){
                    this.resultData = res.data.datas;
                    this.pageTotal = res.data.intotal;//获取数据数目
                }    
            }).catch(err =>{
                alert(err);
               
                })
            ;
        },
        getUser() {
            this.user.cid = "1575354095713";
            this.user.uid = "1";
            //获取所有单位
            GetUnits().then(res => {
                if(res.code === 200){
                    this.unitsListItems = res.data;  
                }      
            }).catch(err =>{
                alert(err);
            });
            for(let i=0;i<this.unitsListItems.length;i++){
                if(this.unitsListItems[i].cid == this.user.cid){
                    this.user.cname=this.unitsListItems[i].cname;
                    break;
                }
            }
            
        },
        //数据分页存储
        split_array:(arr,len)=> {
            console.log("可执行")
            let arr_length = arr.length;
            let newArr = [];
            for(let i=0;i<arr_length;i+=len){
                newArr.push(arr.slice(i,i+len));
            }
            return newArr;
        },
        getQuery() {
            this.query_send = { //用来传给后端
                node: "none", //项目进度
                type: "none", //项目类型
                createTimeMin: "none",
                createTimeMax: "none",
                finishTimeMin: "none",
                finishTimeMax: "none",
                pageIndex: 1,
                pageSize: 10,
            };
            console.log("query"+ this.query.createTime[0]);
            //判断有没有选择
            if(this.query.node != "全部" && this.query.node != ""){
                console.log("1")
                this.query_send.node = this.query.node;
            }
            if(this.query.type != "全部" && this.query.type != ""){
                console.log("2")
                this.query_send.type = this.query.type;
            }
            if(this.query.createTime != "" && this.query.createTime != undefined){
                console.log("3")
                this.query_send.createTimeMin = this.query.createTime[0];
                this.query_send.createTimeMax = this.query.createTime[1];
            }
            if(this.query.finishTime != "" && this.query.finishTime != undefined){
                console.log("5")
                this.query_send.finishTimeMin = this.query.finishTime[0];
                this.query_send.finishTimeMax = this.query.finishTime[1];
            }
        },
        //送审
        handleSubmit(index, row){
            this.$router.push('/Review2?pid='+row.pid);
        },
        // 触发查询按钮
        handleSearch() {
            this.getQuery(); //未填的查询，置为none
            SearchUnitProject(this.query_send,this.user).then(res => {
                if(res.code === 200){
                    this.resultData = res.data.datas;
                    this.pageTotal = res.data.intotal;//获取数据数目
                    this.$set(this.query, 'pageIndex', 1);
                }
                else{
                    alert(res.msg);
                }
            }).catch(err =>{
                alert(err);
            })
            ;
            
            
        },
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
            .then(() => {
                //row为要删除的一组数据
                DeleteUnitProject(row).then(res =>{
                    if(res.code === 200){
                        this.$message.success('删除成功');
                        this.getData();
                    } 
                }).catch(err =>{
                    alert(err);
                })  
            })
            .catch(() => {});
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        //批量删除 第二版再写
        delAllSelection() {
            // //multipleSelection数组内容为选择的模板信息
            // const length = this.multipleSelection.length;
            // //储存要删除模板的id
            
            // for (let i = 0; i < length; i++) {
            //     this.delarr.push(this.multipleSelection[i].tid)
            // }
            // this.$message.error(`删除了 ${length} 行数据`);
            // this.resultData = this.resultData.filter(item => item.tid.filter(item => item.tid));
            // this.multipleSelection = [];
            // DeleteMouldData(this.delarr).then(res =>{
            //     this.$message.error(`删除了 ${length} 行数据`);
            //     this.resultData = this.resultData.filter(item => item !== this.multipleSelection);
            //     this.multipleSelection = [];
            // }).catch(err =>{
            //     alert(err);
            // })
            
        },
        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            this.editForm = Object.assign({}, row);;//Object.assign(目标对象,源对象),不可this.editForm = row，这样目标对象会被改写
            this.editVisible = true;
            this.getUser();
        },
        // 保存编辑
        saveEdit() {
            //接口，传某条新的list->后端，form即为编辑后的一组数组
            EditUnitProject(this.editForm,this.user).then(res => {
                if(res.code === 200){
                    this.$set(this.resultData, this.idx, this.editForm);//this.$setset( 数据源, 具体数据, 新值 )
                    this.$message.success(`修改第 ${this.idx + 1} 行成功`);
                    this.editVisible = false;
                }      
            }).catch(err =>{
                alert(err);
                this.$set(this.resultData, this.idx, this.editForm);//this.$setset( 数据源, 具体数据, 新值 )
                this.$message.success(`修改第 ${this.idx + 1} 行成功`);
                this.editVisible = false;
            });
            
        },
        //取消编辑
        cancelEdit() {
            this.editVisible = false;
        },
        // 分页导航
        handlePageChange(val) {  //val 为选中数据的集合
            this.$set(this.query, 'pageIndex', val);
            this.getData();
        },
        //新建父级项目
        handleCreat() {
            this.creatVisible_p = true;
            this.getUser();
        },
        // 保存新建父级项目
        saveCreat_p() {
            //接口，将新建的模板信息返回给后端
            CreatParentProject(this.creatForm_p,this.user).then(res => {
                if(res.code === 200){
                    this.creatVisible_p = false;
                    this.$message.success(`新建 1 行成功`);
                    this.getData();
                } 
                else{
                    alert(res.msg);
                }    
            }).catch(err =>{
                alert(err);
            });
        },
        //取消新建
        cancelCreat_p() {
            this.creatVisible_p = false;
        },
        //新建子级项目
        CreatSubproject(index,row) {
            this.creatVisible_s = true;
            //获取单位用户
            this.getUser();
            this.creatForm_s.parentPid = row.pid; //显示父级id
            this.creatForm_s.parentName = row.pname; //显示父级名称
        },
        // 保存新建子级项目
        saveCreat_s() {
            //接口，将新建的模板信息返回给后端
            CreatSubProject(this.creatForm_s,this.user).then(res => {
                if(res.code === 200){
                    this.creatVisible_s = false;
                    this.$message.success(`新建 1 行成功`);
                    this.getData();
                } 
                else{
                    alert(res.msg);
                }      
            }).catch(err =>{
                alert(err);
            });
        },
        //取消新建
        cancelCreat_s() {
            this.creatVisible_s = false;
        },
        //点击详情
        handleDetails(index, row) {
            this.$router.push('/projectDetails_user?pid='+row.pid);//跳转
        },

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
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
.spanSty{
    color:#606266;
    font-size:14px;
}
.el-upload--text{
    width:0px;
    height:0px;
}
.notUse{
    color:#97a8be;
    pointer-events: none;
}
</style>
<style>
    .el-input__inner {
        pointer-events: auto;
    }
</style>