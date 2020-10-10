<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 绩效评审详情
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                    <el-tab-pane :disabled="disabled" label="经济性评价" name="first"></el-tab-pane>
                    <el-tab-pane :disabled="disabled" label="效率性评价" name="second"></el-tab-pane>
                    <el-tab-pane :disabled="disabled" label="效果性评价" name="third"></el-tab-pane>
                </el-tabs>
                <div class="tableBox" v-loading="loading">
                <el-table
                id="table_1"
                :data="tableData_1"
                :summary-method="getSummaries"
                show-summary
                style="width: 100%;">
                    <el-table-column
                    prop=""
                    label="经济性评价："
                    width="750"
                    align="center">
                        <el-table-column
                        prop="ename"
                        label=""
                        width="150"
                        align="center">
                        </el-table-column>
                        <el-table-column
                        prop="description"
                        label=""
                        width="450"
                        align="center">
                        </el-table-column>
                        <el-table-column
                        prop="category"
                        label=""
                        width="75"
                        align="center">
                        </el-table-column>
                        <el-table-column
                        prop="importance"
                        label=""
                        width="75"
                        align="center">
                        </el-table-column>
                    </el-table-column>
                    <el-table-column
                    prop="ratio"
                    label="满分"
                    width="75"
                    align="center">
                    </el-table-column>
                    <el-table-column
                    prop="neededFiles"
                    label="有关文档(市局警令部及建设单位提供)"
                    width="450"
                    align="center">
                    </el-table-column>
                    <el-table-column 
                    prop="score"
                    label='评分'
                    width="105"
                    align="center">
                    </el-table-column>
                    <el-table-column
                    prop="name"
                    label="评级区间(0.9≤优≤1.0、0.8≤良﹤0.9、0.7≤中﹤0.8、0.6≤可﹤0.7、差﹤0.6)"
                    width="145"
                    align="center">
                    </el-table-column>
                </el-table>
<!--—————————————————    效率性评价表     ————————————————————-->
                <el-table
                id="table_2"
                :data="tableData_2"
                show-summary
                style="width: 100%">
                    <el-table-column
                    prop="type"
                    label="效率性评价："
                    width="750"
                    align="center">
                        <el-table-column
                        prop="ename"
                        label=""
                        width="150"
                        align="center">
                        </el-table-column>
                        <el-table-column
                        prop="description"
                        label=""
                        width="450"
                        align="center">
                        </el-table-column>
                        <el-table-column
                        prop="category"
                        label=""
                        width="75"
                        align="center">
                        </el-table-column>
                        <el-table-column
                        prop="importance"
                        label=""
                        width="75"
                        align="center">
                        </el-table-column>
                    </el-table-column>
                    <el-table-column
                    prop="ratio"
                    label="满分"
                    width="75"
                    align="center">
                    </el-table-column>
                    <el-table-column
                    prop="neededFiles"
                    label="有关文档"
                    width="450"
                    align="center">
                    </el-table-column>
                    <el-table-column 
                    prop="score"
                    label='评分'
                    width="105"
                    align="center">
                    </el-table-column>
                    <el-table-column
                    prop="name"
                    label="评分等级(0.9≤优≤1.0、0.8≤良﹤0.9、0.7≤中﹤0.8、0.6≤可﹤0.7、差﹤0.6)"
                    width="145"
                    align="center">
                    </el-table-column>
                </el-table>
<!--—————————————————    效果性评价表     ————————————————————-->
                <el-table
                id="table_3"
                :data="tableData_3"
                show-summary
                style="width: 100%">
                    <el-table-column
                    prop="type"
                    label="效果性评价："
                    width="750"
                    align="center">
                        <el-table-column
                        prop="ename"
                        label=""
                        width="150"
                        align="center">
                        </el-table-column>
                        <el-table-column
                        prop="description"
                        label=""
                        width="450"
                        align="center">
                        </el-table-column>
                        <el-table-column
                        prop="category"
                        label=""
                        width="75"
                        align="center">
                        </el-table-column>
                        <el-table-column
                        prop="importance"
                        label=""
                        width="75"
                        align="center">
                        </el-table-column>
                    </el-table-column>
                    <el-table-column
                    prop="ratio"
                    label="满分"
                    width="75"
                    align="center">
                    </el-table-column>
                    <el-table-column
                    prop="neededFiles"
                    label="有关文档"
                    width="450"
                    align="center">
                    </el-table-column>
                    <el-table-column 
                    prop="score"
                    label='评分'
                    width="105"
                    align="center">
                    </el-table-column>
                    <el-table-column
                    prop="name"
                    label="评级档次(0.9≤优≤1.0、0.8≤良﹤0.9、0.7≤中﹤0.8、0.6≤可﹤0.7、差﹤0.6)"
                    width="145"
                    align="center">
                    </el-table-column>
                </el-table>
                <el-table 
                :data="totalData"
                :border="true"
                :show-header="false"
                class="allTable"
                :row-style="{height:'50px'}"
                style="width: 100%">
                    <el-table-column
                    prop="name"
                    label=""
                    width="750"
                    align="center">
                    </el-table-column>
                    <el-table-column
                    prop="all"
                    label=""
                    width="75"
                    align="center">
                    </el-table-column>
                    <el-table-column
                    prop=""
                    label=""
                    width="450"
                    align="center">
                    </el-table-column>
                    <el-table-column
                    prop="allScore"
                    label=""
                    width="105"
                    align="center">
                    </el-table-column>
                    <el-table-column
                    prop=""
                    label=""
                    width="145"
                    align="center">
                    </el-table-column>
                </el-table>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
import { Evaluation_index } from '../../api/index';//全部数据接口
import { GetScore } from '../../api/index';//查询分数接口

export default {
    name: 'basetable',
    data() {
        return {
            loading:true,//加载
            pid: '',
            query: {
                category: '',
                importance: '',
                pageIndex: 1,
                pageSize: 1000
            },
            totalData: [
                {
                    name: "合计",
                    all: 0,
                    allScore: 0,
                } 
            ],//计算三个评价总和
            tableRes:[],//获取的指标数据
            tableData_1: [],
            tableData_2: [],
            tableData_3: [],
            scoreList:[],//保存获取的分数
            editVisible: false,
            pageTotal: 0,
            disabled: true,
            id: -1,
            disabled: false,
            indexTab: '',//记录点击标签前的标签页
            activeName: 'first',
            baseUrl:'http://134.175.42.212:8080/audit_manager/',//域名
        };
    },
    watch: {
        '$route' (to, from) {   //监听路由是否变化
            if(to.query.pid != from.query.pid && to.query.pid != null){  //pid不为空才请求数据
                Object.assign(this.$data, this.$options.data());//重置数据
                this.pid = to.query.pid;
                this.getEvaluations(); //全部重新获取
            }
        },
    },
    created() {
        this.check();
        if(this.$route.query.pid === null || this.$route.query.pid === undefined) {  //如pid为空，则不请求数据
            this.$message.error('无指定的项目数据');
            return
        }
        else{ //否则请求数据
            this.pid = this.$route.query.pid;
            this.getEvaluations();
        }
    },
    methods: {
        check(){
            console.log("created");
        },
        //点击标签页
        handleClick() {
            if(this.activeName == 'first'){
                document.getElementById("table_1").scrollIntoView();
            }
            if(this.activeName == 'second'){
                document.getElementById("table_2").scrollIntoView();
            }
            if(this.activeName == 'third'){
                document.getElementById("table_3").scrollIntoView();
            }
        },
        //使用promise先获取指标数据再获取分数
        getRequest() {
            return new Promise ((resolve,reject)=>{
                Evaluation_index(this.query).then(res => {
                    if(res.code === 200){
                        resolve(res);
                    }
                    else{
                      
                    }   
                }).catch(err =>{
                    reject(err);
                });
            })
        },
        // 获取评分指标数据
        getEvaluations(){
            this.getRequest({
                
            }).then(res =>{
                if(res.code === 200){
                    this.tableRes = res;
                    this.getScore(res); //先获取指标信息再获取分数
                }
                else{
                    alert(res.message);
                }
            }).catch(err =>{
                alert(err);
            })
        },
        //获取分数
        getScore(data){ //res为评价指标数据
            GetScore(this.pid).then(res =>{
                if(res.code === 200){
                    this.scoreList = res.data;
                    let evaluations = data.data.list;
                    let tableData = this.matchScore(evaluations);
                    this.splitTable(tableData);//拆分表格
                    this.getAll(data.data.evaCategoryDtos)//获取评价总分
                    this.calculateAllscore(res.data);//计算评分总分
                    this.loading = false;
                }
                else{

                }
            }).catch(err =>{

            });
        }, 
        //将评分eid与评分指标比较，获取显示评分
        matchScore(resList){
            this.scoreList.forEach(element => {
                for(let i=0;i<resList.length;i++){
                    if( element["eid"] === resList[i].eid){
                        resList[i].score = element["score"];
                        resList[i].peid = element["peid"]
                    }
                }   
            });
            console.log(resList)
            return resList;
        },  
        //拆分表格 
        splitTable(table){
            table.forEach(Element =>{
                switch(Element.category){
                    case '经济性': this.tableData_1.push(Element) 
                    break;
                    case '效率性': this.tableData_2.push(Element) 
                    break;
                    case '效果性': this.tableData_3.push(Element) 
                    break;
                }
            }) //先将页面表格渲染
        },
        //计算指标总分
        getAll(data) {
            for(let i=0;i<data.length;i++) {
                this.totalData[0].all += parseInt(data[i].sumRatio);
            }          
        },
        //计算评价总分
        calculateAllscore(resList){
            resList.forEach(element =>{
                this.totalData[0].allScore += element['score']; //计算总分
            })
        },
        //清空表格和合计
        // emptyData(){
        //     this.loading = true;
        //     this.totalData[0].allScore = 0;//清空总分
        //     this.totalData[0].all = 0;//清空总分
        //     this.tableData_1 = [];
        //     this.tableData_2 = [];
        //     this.tableData_3 = [];
        // },
        //合计
        getSummaries(param) {
            const { columns, data } = param;
            const sums = [];
            columns.forEach((column, index) => {
            if (index === 0) {
                sums[index] = '总计';
                return;
            }
            const values = data.map(item => Number(item[column.property]));
            if (!values.every(value => isNaN(value))) {
                sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) { 
                    return prev + curr;
                } else {
                    return prev;
                }
                }, 0);
                   
                
            } else {
                sums[index] = '';
            }
            });
            return sums;
        },
    },
};
</script>

<style scoped>
.handle-box .el-input {
  display: none;
}
.current-row .current-cell .el-input {
  display: block;
}
.current-row .current-cell .el-input + span {
  display: none;
}

.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
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
.el-input{
    width:54px;
    height:34px;
    margin:auto;
    text-align: center;
}

.el-table {
    margin:25px 0px;
}

.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
.allTable{
    font-size:13px;
    font-weight:bold;
}
.saveBtn {
    height:45px;
    width:100px;
    margin:40px 1350px;
}
.el-table .warning-row {
    background: oldlace;
}
.el-table .success-row {
    background: #f0f9eb;
}
.container {
    height: 100%;
    border:none;
}
</style>
<style>
    .el-input__inner {
        pointer-events: auto;
    }
</style>