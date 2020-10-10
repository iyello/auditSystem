<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 模板管理
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
                <span class="spanSty">模板类别：</span>
                <el-select v-model="query.mould" placeholder="全部" class="handle-select mr10" style="width:150px;">
                    <el-option key="1" label="全部" value="全部"></el-option>
                    <el-option key="2" label="审计报告" value="审计报告"></el-option>
                    <el-option key="3" label="送审资料清单" value="送审资料清单"></el-option>
                    <el-option key="4" label="退回函" value="退回函"></el-option>
                </el-select> 
                <span class="spanSty">项目类型：</span>
                <el-select v-model="query.project" placeholder="全部" class="handle-select mr10" style="width:150px;">
                    <el-option key="1" label="全部" value="全部"></el-option>
                    <el-option key="2" label="货物类采购" value="货物类采购"></el-option>
                    <el-option key="3" label="基建类工程" value="基建类工程"></el-option>
                    <el-option key="4" label="信息化类项目" value="信息化类项目"></el-option> 
                </el-select>
                <span class="spanSty">项目进度：</span>
                <el-select v-model="query.schedule" placeholder="全部" class="handle-select mr10">
                    <el-option key="1" label="全部" value="全部"></el-option>
                    <el-option key="2" label="预算" value="预算"></el-option>
                    <el-option key="3" label="标书" value="标书"></el-option>
                    <el-option key="4" label="合同" value="合同"></el-option>
                    <el-option key="5" label="结算" value="结算"></el-option>
                </el-select>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
                <el-button type="primary" icon="el-icon-creat" @click="handleCreat">新增</el-button>
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
                <el-table-column prop="tname" label="模板名称" width="500" align="center"></el-table-column>
                <el-table-column prop="category" label="模板类别"  align="center"></el-table-column>
                <el-table-column prop="ptype" label="项目类型" align="center"></el-table-column>
                <el-table-column prop="pnode" label="项目进度" align="center"></el-table-column>
                <el-table-column label="操作" width="230" align="center">
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
                        <!-- <el-button
                            style="margin-left:30px;"
                            type="text"
                            @click="handlePreview(scope.$index, scope.row)"
                        >预览</el-button> -->
                        <el-button
                            style="margin-left:20px;"
                            type="text"
                            @click="handleDownload(scope.$index, scope.row)"
                        >下载</el-button>
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
            <!-- <el-form ref="editForm" :model="editForm" label-width="70px">
                <el-form-item label="模板名称">
                    <el-input v-model="editForm.tname"></el-input>
                </el-form-item>
                <el-form-item label="模板类别">
                    <el-select v-model="editForm.category" class="handle-select mr10" style="width:150px;">
                        <el-option key="1" label="审计报告" value="审计报告"></el-option>
                        <el-option key="2" label="送审资料清单" value="送审资料清单"></el-option>
                        <el-option key="3" label="退回函" value="退回函"></el-option>
                    </el-select> 
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelEdit">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span> -->
            <el-form ref="editForm" :rules="rules" :model="editForm" label-width="80px" label-position="left" enctype="multipart/form-data">
                <el-form-item label="模板名称" prop="tname">
                    <el-input v-model="editForm.tname"></el-input>
                </el-form-item>
                <el-form-item label="模板类别" prop="category">
                    <el-select v-model="editForm.category" placeholder="请选择" class="handle-select mr10" style="width:150px;">
                        <el-option key="1" label="审计报告" value="审计报告"></el-option>
                        <el-option key="2" label="送审资料清单" value="送审资料清单"></el-option>
                        <el-option key="3" label="退回函" value="退回函"></el-option>
                    </el-select> 
                </el-form-item>
                <el-form-item label="项目类别" prop="ptype">
                    <el-select v-model="editForm.ptype" placeholder="请选择" class="handle-select mr10" style="width:150px;">
                        <el-option key="1" label="货物类采购" value="货物类采购"></el-option>
                        <el-option key="2" label="基建类工程" value="基建类工程"></el-option>
                        <el-option key="3" label="信息化类项目" value="信息化类项目"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="项目进度" prop="pnode">
                    <el-select v-model="editForm.pnode" placeholder="请选择" class="handle-select mr10">
                        <el-option key="1" label="预算" value="预算"></el-option>
                        <el-option key="2" label="标书" value="标书"></el-option>
                        <el-option key="3" label="合同" value="合同"></el-option>
                        <el-option key="4" label="结算" value="结算"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="文档">
                    <ul class="el-upload-list el-upload-list--text">
                        <li tabindex="0" class="el-upload-list__item is-ready">
                            <a class="el-upload-list__item-name">
                                <i class="el-icon-document">{{turl}}</i>
                            </a>
                        </li>
                    </ul>
                </el-form-item>
                <el-form-item label="" prop="file"> 
                    <el-upload drag action="#" 
                        :on-change="handleGetFile_e" 
                        :auto-upload="false" 
                        :limit="1" >
                            <i class="el-icon-upload"></i>
                            <div class="el-upload__text">重新托选 或
                            <em>重新上传</em>
                            </div>
                            <div class="el-upload__tip" slot="tip">只能上传单个excel、word文件</div>
                    </el-upload>
                </el-form-item>
                <!-- <el-form-item label="" prop="file">
                    <el-upload drag action="#" 
                        :on-change="handleGetFile" 
                        :auto-upload="false" 
                        :limit="1" >
                            <i class="el-icon-upload"></i>
                            <div class="el-upload__text">托选文件 或
                            <em>选择文件</em>
                            </div>
                            <div class="el-upload__tip" slot="tip">只能上传单个excel、word文件</div>
                    </el-upload>
                </el-form-item> -->
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelEdit">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 新增弹出框 -->
        <el-dialog title="新增"  :visible.sync="creatVisible" width="30%">
            <el-form ref="creatForm" :rules="rules" :model="creatForm" label-width="80px" label-position="left" enctype="multipart/form-data">
                <el-form-item label="模板名称" prop="tname">
                    <el-input v-model="creatForm.tname"></el-input>
                </el-form-item>
                <el-form-item label="模板类别" prop="category">
                    <el-select v-model="creatForm.category" placeholder="请选择" class="handle-select mr10" style="width:150px;">
                        <el-option key="1" label="审计报告" value="审计报告"></el-option>
                        <el-option key="2" label="送审资料清单" value="送审资料清单"></el-option>
                        <el-option key="3" label="退回函" value="退回函"></el-option>
                    </el-select> 
                </el-form-item>
                <el-form-item label="项目类别" prop="ptype">
                    <el-select v-model="creatForm.ptype" placeholder="请选择" class="handle-select mr10" style="width:150px;">
                        <el-option key="1" label="货物类采购" value="货物类采购"></el-option>
                        <el-option key="2" label="基建类工程" value="基建类工程"></el-option>
                        <el-option key="3" label="信息化类项目" value="信息化类项目"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="项目进度" prop="pnode">
                    <el-select v-model="creatForm.pnode" placeholder="请选择" class="handle-select mr10">
                        <el-option key="1" label="预算" value="预算"></el-option>
                        <el-option key="2" label="标书" value="标书"></el-option>
                        <el-option key="3" label="合同" value="合同"></el-option>
                        <el-option key="4" label="结算" value="结算"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="文档上传" prop="file">
                    <el-upload drag action="#" 
                        :on-change="handleGetFile" 
                        :auto-upload="false" 
                        :limit="1" >
                            <i class="el-icon-upload"></i>
                            <div class="el-upload__text">托选文件 或
                            <em>选择文件</em>
                            </div>
                            <div class="el-upload__tip" slot="tip">只能上传单个excel、word文件</div>
                    </el-upload>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelCreat">取 消</el-button>
                <el-button type="primary" @click="saveCreat('creatForm')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { MouldData } from '../../api/index';//一页数据接口
import { EditMouldData } from '../../api/index';//编辑接口
import { CreatMouldData } from '../../api/index';//新增接口
import { DeleteMouldData } from '../../api/index';//删除接口
import { SearchMouldData } from '../../api/index';//查询接口

export default {
    name: 'basetable',
    data() {
        return {
            query: {
                mould: '',
                project: '',
                schedule: '',
                pageIndex: 1,
                pageSize: 20 //一页数据条数
            },
            resultData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            creatVisible: false,
            pageTotal: 0,
            editForm: {
                tname: "",
                category: "",
                ptype: "",
                pnode: "",
                file: ""
            },
            creatForm: {
                tname: "",
                category: "",
                ptype: "",
                pnode: "",
                file: ""
            },
            idx: -1,
            id: -1 ,
            fileName: '',
            fileList: [],
            files: '',
            domain: '',
            baseurl: 'http://134.175.42.212:8080/audit_manager' ,//域名
            // addNewLoading: false,
            turl:'',
            // 校验规则
            rules: {
                tname: [
                    {   
                        required: true, //是否必填
                        message: '名称不能为空', //规则
                        trigger: 'blur'  //何事件触发
                    },
                ],
                category: [
                    {   
                        required: true, //是否必填
                        message: '模板类别不能为空', //规则
                        trigger: 'change'  //何事件触发
                    }
                ],
                ptype: [
                    {   
                        required: true, //是否必填
                        message: '项目类别不能为空', //规则
                        trigger: 'change'  //何事件触发
                    }
                ],
                pnode: [
                    {   
                        required: true, //是否必填
                        message: '项目进度不能为空', //规则
                        trigger: 'change'  //何事件触发
                    }
                ],
                file: [
                    {   
                        required: true, //是否必填
                        message: '请上传文件', //规则
                        trigger: 'blur'  //何事件触发
                    }
                ]
            },
        };
    },
    computed: {
        // tableData() {
        // // 获取一页的数据
        // return this.resultData
        //     .slice(
        //     (this.query.pageIndex - 1) * this.query.pageSize,
        //     this.query.pageIndex * this.query.pageSize
        //     );
        //     //slice(star,end)函数返回从star到end前的函数、不包括end
        // }
    },
    created() {
        this.getData();
    },
    mounted() {
    },
    methods: {
        // 开始，获取后台一页数据
        getData() {
            MouldData(this.query).then(res => {
                if(res.code === 200){
                    this.resultData = res.data.list;
                    this.pageTotal = res.data.total; //获取全部数据长度
                    // this.pageTotal = res.data.pageNum || 50; //获取页数
                }
                
            }).catch(err =>{
                alert(err);
                })
            ;
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
        // 触发查询按钮
        handleSearch() {
            //判断有没有选择
            if(this.query.mould === "全部" || this.query.mould === ""){
                this.query.mould = null;
            }
            if(this.query.project === "全部" || this.query.project=== ""){
                this.query.project = null;
            }
            if(this.query.schedule === "全部" || this.query.schedule === ""){
                this.query.schedule = null;
            }
            //调用查询接口
            MouldData(this.query).then(res => {
                console.log(res.code);
                if(res.code === 200){
                    console.log(res.data);
                    this.resultData = res.data.list;
                    this.pageTotal = res.data.total;//获取数据数目
                    this.$set(this.query, 'pageIndex', 1);
                }
                else{
                    alert(res.msg);
                    this.resultData = [];
                    this.pageTotal = 0;
                }
            }).catch(err =>{
                alert(err);
            }) 
        },
        // 删除操作
        handleDelete(index, row) {
            //二次确认删除
            this.$confirm('确定要删除吗？','提示',{
                type: 'warning'
            })
            .then(()=>{
                DeleteMouldData(row).then(res =>{
                    if(res.code === 200){
                        this.$message.success('删除成功');
                        this.getData(); //重新获取数据
                    }
                    else{
                        alert(res.msg);
                    }
                }).catch(err =>{
                    alert(err);
                }) 
            })
             
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
            let url = this.editForm.turl;
            this.turl = url.substring(url.lastIndexOf('/')+1); //获取文件名和后缀
        },
        // 保存编辑
        saveEdit() {
            // console.log("编辑数据",JSON.stringify(this.editForm));
            //接口，传某条新的list->后端，form即为编辑后的一组数组
            // 创建formData表单
            // console.log(this.editForm);
            let editNewFormData = new FormData();
            editNewFormData.append("file", this.editForm.file);
            editNewFormData.append("category", this.editForm.category);
            editNewFormData.append("pnode", this.editForm.pnode);
            editNewFormData.append("ptype", this.editForm.ptype);
            editNewFormData.append("tname", this.editForm.tname);
            editNewFormData.append("tid", this.editForm.tid);
            EditMouldData(editNewFormData,this.editForm.tid).then(res => {
                if(res.code === 200){
                    if(this.editForm.file != undefined){
                        this.editForm.turl = this.editForm.file.name; //添加turl属性并赋值，使视图更新
                    }
                    this.$set(this.resultData,this.idx, this.editForm);//this.$setset( 数据源, 具体数据, 新值 )
                    this.$message.success(`修改成功`);
                    this.editVisible = false;
                } 
                else{
                    alert(res.msg);
                }     
            }).catch(err =>{
                alert(err);
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
        //新增模板
        handleCreat() {
            this.creatVisible = true;
        },
        //文件上传前操作 限制格式和大小
        // beforeUpload(file){
        //     this.files = file;
        //     const extension = file.name.split('.')[1] === 'xls'
        //     const extension2 = file.name.split('.')[1] === 'xlsx'
        //     const extension3 = file.name.split('.')[1] === 'doc'
        //     const extension4 = file.name.split('.')[1] === 'docx'
        //     const isLt2M = file.size / 1024 / 1024 < 5
        //     if (!extension && !extension2 && !extension3 && !extension4) {
        //     this.$message.warning('上传模板只能是 xls、xlsx、doc、docx格式!')
        //     return
        //     }
        //     if (!isLt2M) {
        //     this.$message.warning('上传模板大小不能超过 5MB!')
        //     return
        //     }
        //     this.fileName = file.name;
        //     return false // 返回false不会自动上传
        // },
        // 选择文件的时候提取到文件内容
        handleGetFile(file) {
            this.creatForm.file = file.raw;
        },
        handleGetFile_e(file) {
            this.editForm.file = file.raw;
        },
        // 保存新增
        saveCreat(formName) {
            this.$refs[formName].validate((valid) => { //校验规则
                if (valid) {
                    // this.addNewLoading = true;
                    // 创建formData表单
                    let addNewFormData = new FormData();
                    addNewFormData.append("file", this.creatForm.file);
                    addNewFormData.append("category", this.creatForm.category);
                    addNewFormData.append("pnode", this.creatForm.pnode);
                    addNewFormData.append("ptype", this.creatForm.ptype);
                    addNewFormData.append("tname", this.creatForm.tname);
                    //接口，将新增的模板信息返回给后端
                    CreatMouldData(addNewFormData).then(res => {
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
                }else {
                    return false;
                }
            });
                    
        },
        //取消新增
        cancelCreat() {
            this.creatVisible = false;
            //表单重置
            this.$refs.creatForm.resetFields(); 
        },
        //预览操作 暂时不用写
        // handlePreview(index, row) {
        //     if (!/\.(pdf|PDF)$/.test(row.turl)) {
        //         // 不是pdf格式
        //         //新开窗口预览，微软提供的在线预览网址
        //         window.open(
        //             "https://view.officeapps.live.com/op/view.aspx?src=" + this.domain + "/zhengCe?id=" + row.tid,
        //             "_blank"
        //         );
        //         return false;
        //     } else {
        //         // pdf 格式
        //         let url = this.domain + "/anli?id=" + row.tid;
        //         this.viewVisible = true;
        //         this.pdfsrc = url;
        //     }

        // },
        //下载操作
        handleDownload(index, row) {
            let a = document.createElement('a');
            a.href = this.baseurl + row.turl; // 这里的请求方式为get ，域名+url
            a.click();
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
</style>
