<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 绩效评价指标管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <!-- <el-button
                    type="primary"
                    icon="el-icon-delete"
                    class="handle-del mr10"
                    @click="delAllSelection"
                >批量删除</el-button> -->
                <span class="spanSty">评价类型：</span>
                <el-select v-model="query.category" placeholder="全部" class="handle-select mr10" style="width:150px;">
                    <el-option key="1" label="全部" value="全部"></el-option>
                    <el-option key="2" label="经济性" value="经济性"></el-option>
                    <el-option key="3" label="效率性" value="效率性"></el-option>
                    <el-option key="4" label="效果性" value="效果性"></el-option>
                </el-select> 
                <span class="spanSty">重要性：</span>
                <el-select v-model="query.importance" placeholder="全部" class="handle-select mr10" style="width:150px;">
                    <el-option key="1" label="全部" value="全部"></el-option>
                    <el-option key="2" label="重要" value="重要"></el-option>
                    <el-option key="3" label="较重要" value="较重要"></el-option>
                    <el-option key="4" label="一般" value="一般"></el-option>
                </el-select>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
                <el-button type="primary" icon="el-icon-creat" @click="handleCreat">新增</el-button>
                <span style="color:red;margin-left:20px;" v-if="isSearch">{{text}}类型总分值为{{categorySum}}分</span>
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
                <el-table-column prop="eid" label="指标编号" width="150" align="center"></el-table-column>
                <el-table-column prop="ename" label="评价指标名称"  width="350" align="center"></el-table-column>
                <el-table-column prop="category" label="评价类型" align="center"></el-table-column>
                <el-table-column prop="importance" label="重要性" align="center"></el-table-column>
                <el-table-column prop="ratio" label="分值占比%" align="center"></el-table-column>
                <el-table-column label="操作" width="220" align="center">
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
                        <el-button
                            style="margin-left:25px;"
                            type="text"
                            @click="handleDetails(scope.$index, scope.row)"
                        >详情</el-button>
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
            <el-form ref="editForm" :rules="rules" :model="editForm" label-width="150px" label-position="left">
                <el-form-item label="评价指标名称：">
                    <el-input v-model="editForm.ename"></el-input>
                </el-form-item>
                <el-form-item label="评价指标详细描述：">
                    <el-input type="textarea" rows="5" v-model="editForm.description"></el-input>
                </el-form-item>
                <el-form-item label="评价类型：">
                    <el-select v-model="editForm.category" class="handle-select mr10" style="width:150px;">
                        <el-option key="2" label="经济性" value="经济性"></el-option>
                        <el-option key="3" label="效率性" value="效率性"></el-option>
                        <el-option key="4" label="效果性" value="效果性"></el-option>
                    </el-select> 
                </el-form-item>
                <el-form-item label="重要性：">
                    <el-select v-model="editForm.importance" class="handle-select mr10" style="width:150px;">
                        <el-option key="2" label="重要" value="重要"></el-option>
                        <el-option key="3" label="较重要" value="较重要"></el-option>
                        <el-option key="4" label="一般" value="一般"></el-option>
                    </el-select> 
                </el-form-item>
                <el-form-item label="分值比：">
                    <el-input-number v-model="editForm.ratio" controls-position="right"
                    @change="handleChange" :min="0" :max="100"></el-input-number>
                </el-form-item>
                <el-form-item label="有关文档：">
                    <el-input type="textarea" rows="5" v-model="editForm.neededFiles"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelEdit">取 消</el-button>
                <el-button type="primary" @click="saveEdit('editForm')">提 交</el-button>
            </span>
        </el-dialog>

        <!-- 新增弹出框 -->
        <el-dialog title="新增" :visible.sync="creatVisible" width="40%">
            <el-form ref="creatForm" :rules="rules" :model="creatForm" label-width="150px" label-position="left">
                <el-form-item label="评价指标名称：" prop="ename">
                    <el-input v-model="creatForm.ename"></el-input>
                </el-form-item>
                <el-form-item label="评价指标详细描述：" prop="description">
                    <el-input type="textarea" rows="5" v-model="creatForm.description"></el-input>
                </el-form-item>
                <el-form-item label="评价类型：" prop="category">
                    <el-select v-model="creatForm.category" class="handle-select mr10" style="width:150px;">
                        <el-option key="2" label="经济性" value="经济性"></el-option>
                        <el-option key="3" label="效率性" value="效率性"></el-option>
                        <el-option key="4" label="效果性" value="效果性"></el-option>
                    </el-select> 
                </el-form-item>
                <el-form-item label="重要性：" prop="importance">
                    <el-select v-model="creatForm.importance" class="handle-select mr10" style="width:150px;">
                        <el-option key="2" label="重要" value="重要"></el-option>
                        <el-option key="3" label="较重要" value="较重要"></el-option>
                        <el-option key="4" label="一般" value="一般"></el-option>
                    </el-select> 
                </el-form-item>
                <el-form-item label="分值比：" prop="ratio">
                    <el-input-number v-model="creatForm.ratio" controls-position="right"
                    @change="handleChange" :min="0" :max="100"></el-input-number>
                </el-form-item>
                <el-form-item label="有关文档：" prop="neededFiles">
                    <el-input type="textarea" rows="5" v-model="creatForm.neededFiles"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelCreat">取 消</el-button>
                <el-button type="primary" @click="saveCreat('creatForm')">提 交</el-button>
            </span>
        </el-dialog>

        <!-- 详情弹出框 -->
        <el-dialog title="详情" :visible.sync="detailVisible" width="30%">
            <span>{{description}}</span>
        </el-dialog>
    </div>
</template>

<script>
import { Evaluation_index } from '../../api/index';//分页获取全部数据接口
import { allEvaluation_index } from '../../api/index';//获取全部数据接口
import { EditEvaluation_index } from '../../api/index';//编辑接口
import { CreatEvaluation_index } from '../../api/index';//新增接口
import { DeleteEvaluation_index } from '../../api/index';//删除接口
import { SearchEvaluation_index } from '../../api/index';//查询接口

export default {
    name: 'basetable',
    data() {
        return {
            query: {
                category: '',
                importance: '',
                pageIndex: 1,
                pageSize: 20
            },
            text:'',//查询的评价类型
            isSearch:false,//显示查询提示
            categorySum: 0,//查询类型的总值
            resultData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            creatVisible: false,
            detailVisible: false,
            pageTotal: 0,
            description:'',
            editForm: {},
            creatForm: {},
            idx: -1,
            id: -1 ,
            creatForm: {
                ename: "",
                description: "",
                category: "",
                importance: "",
                ratio: "",
                neededFiles: ""
            },
            // 校验规则
            rules: {
                ename: [
                    {   
                        required: true, //是否必填
                        message: '名称不能为空', //规则
                        trigger: 'blur'  //何事件触发
                    },
                ],
                description: [
                    {   
                        required: true, //是否必填
                        message: '指标详细描述不能为空', //规则
                        trigger: 'blur'  //何事件触发
                    }
                ],
                category: [
                    {   
                        required: true, //是否必填
                        message: '评价类型不能为空', //规则
                        trigger: 'change'  //何事件触发
                    }
                ],
                importance: [
                    {   
                        required: true, //是否必填
                        message: '重要性不能为空', //规则
                        trigger: 'change'  //何事件触发
                    }
                ],
                ratio: [
                    {   
                        required: true, //是否必填
                        message: '分值比不能为空', //规则
                        trigger: 'change'  //何事件触发
                    }
                ],
                neededFiles: [
                    {   
                        required: true, //是否必填
                        message: '有关文档不能为空', //规则
                        trigger: 'blur'  //何事件触发
                    }
                ]
            },
        };
    },
    computed: {
    },
    created() {
        this.getData();
    },
    methods: {
        // 开始，获取后台所有数据
        getData() {
            Evaluation_index(this.query).then(res => {
                if(res.code === 200){
                    this.resultData = res.data.list;
                    this.pageTotal = res.data.total;//获取数据数目
                    // this.pageTotal = res.data.pageNum || 50; //获取页数
                }
                else{
                    alert(res.msg);
                }
                
            }).catch(err =>{
                alert(err);
            });
            //获取总分值，增加提示
            allEvaluation_index().then(res => {
                if(res.code === 200){
                    let sum = 0;
                    res.data.evaCategoryDtos.forEach(element =>{
                        sum += parseInt(element['sumRatio']);
                    })
                    if(sum >= 100){
                        this.$message({
                            type: 'warning',
                            message: '总分值为'+ sum +'，注意总分值不能超过100',
                            duration: 4000,
                            showClose: true,
                        })
                    }
                }
                else{
                    alert(res.msg);
                }
            }).catch(err =>{
                alert(err);
            });
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
        //获取查询类型总分值
        getCategorySum(data,c){
            if(c === null){ //查询类型为全部
                this.text = "全部";
                this.categorySum = parseInt(data[0].sumRatio) + parseInt(data[1].sumRatio) + parseInt(data[2].sumRatio);
            }
            else{
                this.text = c;
               for(let i=0;i<data.length;i++){
                    if(data[i].category === c){
                        this.categorySum = data[i].sumRatio;
                    }
                } 
            }
            
        },
        // 触发查询按钮
        handleSearch() {
            //判断有没有选择
            if(this.query.category === "全部" || this.query.category === ""){
                this.query.category = null;
            }
            if(this.query.importance === "全部" || this.query.importance=== ""){
                this.query.importance = null;
            }
            //调用查询接口
            SearchEvaluation_index(this.query).then(res => {
                if(res.code === 200){
                    this.isSearch = true; //显示提示
                    this.resultData = res.data.list;
                    this.pageTotal = res.data.total;//获取数据数目
                    this.getCategorySum(res.data.evaCategoryDtos,this.query.category);
                    this.$set(this.query, 'pageIndex', 1);
                }
                else{
                    alert(res.msg);
                    this.resultData = [];
                    this.pageTotal = 0;//条目为0
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
                DeleteEvaluation_index(row).then(res =>{
                    if(res.code === 200){
                        this.$message.success('删除成功');
                        this.getData();
                    }
                    else{
                        alert(res.msg);
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
            this.editForm = Object.assign({}, row);//Object.assign(目标对象,源对象),不可this.editForm = row，这样目标对象会被改写
            this.editVisible = true;
        },
        // 保存编辑
        saveEdit(formName) {
            this.$refs[formName].validate((valid)=>{//校验规则
                if(valid){
                    //接口，传某条新的list->后端，form即为编辑后的一组数组
                    EditEvaluation_index(this.editForm).then(res => {
                        if(res.code === 200){
                            this.$set(this.resultData, this.idx, this.editForm);//this.$setset( 数据源, 具体数据, 新值 )
                            this.$message.success(`修改成功`);
                            this.editVisible = false;
                        }
                        else{
                            alert(res.msg);
                        }  
                    }).catch(err =>{
                        alert(err);
                    });
                }else{
                    return false;
                }
            })            
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
        //新增模板
        handleCreat() {
            allEvaluation_index().then(res => {
                if(res.code === 200){
                    let sum = 0;
                    res.data.evaCategoryDtos.forEach(element =>{
                        sum += parseInt(element['sumRatio']);
                    })
                    console.log(sum);
                    if(sum >= 100){
                        this.$message({
                            type: 'warning',
                            message: '总分值超过100，不能新增',
                            duration: 2000,
                            showClose: true,
                        })
                        return false;
                    }else{
                        this.creatVisible = true; //可新增
                    }
                }
                else{
                    alert(res.msg);
                }
            }).catch(err =>{
                alert(err);
            });
        },
        // 保存新增
        saveCreat(formName) {
            this.$refs[formName].validate((valid)=>{//校验规则
                if(valid){
                    //接口，将新增的模板信息返回给后端
                    CreatEvaluation_index(this.creatForm).then(res => {
                        if(res.code === 200){
                            this.creatVisible = false;
                            this.$message.success(`新增成功`);
                            //表单重置
                            this.$refs.creatForm.resetFields();
                            this.getData();
                        }
                        else{
                            alert(res.msg);
                            //表单重置
                            this.$refs.creatForm.resetFields();
                        }
                    }).catch(err =>{
                        alert(err);
                        //表单重置
                        this.$refs.creatForm.resetFields();
                    });
                }else{
                    return false;
                }
            })
        },
        //取消新增
        cancelCreat() {
            this.creatVisible = false;
            //表单重置
            this.$refs.creatForm.resetFields(); 
        },
        //点击详情
        handleDetails(index, row) {
            this.detailVisible = true;
            this.description = row.description
        },

        //文件上传
        handleRemove(file) {
            console.log(file);
        },
        handlePreview(file) {
            console.log(file);
        },
        handleExceed(files) {
            this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件`);
        },
        beforeRemove(file, fileList) {
            return this.$confirm(`确定移除 ${ file.name }？`);
        },
        //计数器
        handleChange(value) {
            console.log(value);
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
.spanSty{
    color:#606266;
    font-size:14px;
}
.el-upload--text{
    width:0px;
    height:0px;
}
</style>

<style>
.el-input__inner {
    pointer-events: auto;
}
</style>