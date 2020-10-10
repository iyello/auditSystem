<template>
    <div class="box">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 周报
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <h2 style="display:inline;">{{formDatas.label[0].text}}</h2>
                <el-button style="margin:0px 500px;" type="primary" class="" @click="weekClick">导出周报</el-button>
            </div>
            <el-table
                :data="weeklyReportList_1"
                border
                style="width: 100%">
                <el-table-column
                :label="formDatas.typeName[0]">
                    <el-table-column
                    prop="cname"
                    label="送审单位"
                    width="250"
                    align="center">
                    </el-table-column>
                    <el-table-column
                    prop="pname"
                    label="送审项目名称"
                    align="center">
                    </el-table-column>
                    <el-table-column
                    prop="date"
                    label="送审时间"
                    width="220"
                    align="center">
                    </el-table-column>
                    <el-table-column
                    prop="endDate"
                    label="结审时间"
                    width="220"
                    align="center">
                    </el-table-column>
                </el-table-column>
            </el-table>
            <el-table
                :data="weeklyReportList_2"
                border
                style="width: 100%">
                <el-table-column
                :label="formDatas.typeName[1]">
                    <el-table-column
                    prop="cname"
                    label="送审单位"
                    width="250"
                    align="center">
                    </el-table-column>
                    <el-table-column
                    prop="pname"
                    label="送审项目名称"
                    align="center">
                    </el-table-column>
                    <el-table-column
                    prop="date"
                    label="送审时间"
                    width="220"
                    align="center">
                    </el-table-column>
                    <el-table-column
                    prop="endDate"
                    label="结审时间"
                    width="220"
                    align="center">
                    </el-table-column>
                </el-table-column>
            </el-table>
            <el-table
                :data="weeklyReportList_3"
                border
                style="width: 100%">
                <el-table-column
                :label="formDatas.typeName[2]">
                    <el-table-column
                    prop="cname"
                    label="送审单位"
                    width="250"
                    align="center">
                    </el-table-column>
                    <el-table-column
                    prop="pname"
                    label="送审项目名称"
                    align="center">
                    </el-table-column>
                    <el-table-column
                    prop="date"
                    label="送审时间"
                    width="220"
                    align="center">
                    </el-table-column>
                    <el-table-column
                    prop="endDate"
                    label="结审时间"
                    width="220"
                    align="center">
                    </el-table-column>
                </el-table-column>
            </el-table>
            <el-table
                :data="weeklyReportList_4"
                border
                style="width: 100%">
                <el-table-column
                :label="formDatas.typeName[3]">
                    <el-table-column
                    prop="cname"
                    label="送审单位"
                    width="250"
                    align="center">
                    </el-table-column>
                    <el-table-column
                    prop="pname"
                    label="送审项目名称"
                    align="center">
                    </el-table-column>
                    <el-table-column
                    prop="date"
                    label="送审时间"
                    width="220"
                    align="center">
                    </el-table-column>
                    <el-table-column
                    prop="endDate"
                    label="结审时间"
                    width="220"
                    align="center">
                    </el-table-column>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
 
<script>
import { WeekReport } from '../../api/index';//周报接口
import { GetUnits } from '../../api/index';//获取单位id和名称接口

export default {
    data() {
        return {
            weeklyReportList_1:[],//第一个表格
            weeklyReportList_2:[],//第一个表格
            weeklyReportList_3:[],//第一个表格
            weeklyReportList_4:[],//第一个表格
            formDatas: {
                sheetName:"周报",
                typeName:["一、预算项目","二、政府采购文件","三、合同文件","四、结算项目"],
                itemSize:[3,4,5,10],
                label:[
                    {
                        text: "2015年12月2日至12月6日审结项目一览表",
                        height: 39,
                        cell:4,
                        label:[
                            {
                                text: "送审单位",
                                width: 12.9,
                                height: 15.6
                            },
                            {
                                text: "送审项目名称",
                                width: 50.3,
                                height: 15.6
                            },
                            {
                                text: "送审时间",
                                width: 9.5,
                                height: 15.6
                            },
                            {
                                text: "审结时间",
                                width: 9.7,
                                height: 15.6
                            }
                        ]
                    }
                ],
                weeklyReportList:[
                    {
                        cname:"治安支队1",
                        pname:"2015-32*******破拆工具组采购等项目",
                        date:"11月13日",
                        endDate:"11月13日"
                    },
                    {
                        cname:"治安支队2",
                        pname:"2015-32*******破拆工具组采购等项目",
                        date:"11月13日",
                        endDate:"11月13日"
                    },
                    {
                        cname:"治安支队3",
                        pname:"2015-32*******破拆工具组采购等项目",
                        date:"11月13日",
                        endDate:"11月13日"
                    },
                    {
                        cname:"治安支队4",
                        pname:"2015-32*******破拆工具组采购等项目",
                        date:"11月13日",
                        endDate:"11月13日"
                    },
                    {
                        cname:"治安支队5",
                        pname:"2015-32*******破拆工具组采购等项目",
                        date:"11月13日",
                        endDate:"11月13日"
                    },
                    {
                        cname:"治安支队6",
                        pname:"2015-32*******破拆工具组采购等项目",
                        date:"11月13日",
                        endDate:"11月13日"
                    },
                    {
                        cname:"治安支队7",
                        pname:"2015-32*******破拆工具组采购等项目",
                        date:"11月13日",
                        endDate:"11月13日"
                    },
                    {
                        cname:"治安支队8",
                        pname:"2015-32*******破拆工具组采购等项目",
                        date:"11月13日",
                        endDate:"11月13日"
                    },
                    {
                        cname:"治安支队9",
                        pname:"2015-32*******破拆工具组采购等项目",
                        date:"11月13日",
                        endDate:"11月13日"
                    },
                    {
                        cname:"治安支队10",
                        pname:"2015-32*******破拆工具组采购等项目",
                        date:"11月13日",
                        endDate:"11月13日"
                    },
                ]	
            },
            formDatas2: {
                "sheetName":"周报",
                "typeName":["一、预算项目","二、政府采购文件","三、合同文件","四、结算项目"],
                "itemSize":[3,4,5,10],
                "label":[
                    {
                        "text": "2015年12月2日至12月6日审结项目一览表",
                        "height": 39,
                        "cell":4,
                        "label":[
                            {
                                "text": "送审单位",
                                "width": 12.9,
                                "height": 15.6
                            },
                            {
                                "text": "送审项目名称",
                                "width": 50.3,
                                "height": 15.6
                            },
                            {
                                "text": "送审时间",
                                "width": 9.5,
                                "height": 15.6
                            },
                            {
                                "text": "审结时间",
                                "width": 9.7,
                                "height": 15.6
                            }
                        ]
                    }
                ],
                "weeklyReportList":[
                    {
                        "cname":"治安支队1",
                        "pname":"2015-32*******破拆工具组采购等项目",
                        "date":"11月13日",
                        "endDate":"11月13日"
                    },
                    {
                        "cname":"治安支队2",
                        "pname":"2015-32*******破拆工具组采购等项目",
                        "date":"11月13日",
                        "endDate":"11月13日"
                    },
                    {
                        "cname":"治安支队3",
                        "pname":"2015-32*******破拆工具组采购等项目",
                        "date":"11月13日",
                        "endDate":"11月13日"
                    },
                    {
                        "cname":"治安支队4",
                        "pname":"2015-32*******破拆工具组采购等项目",
                        "date":"11月13日",
                        "endDate":"11月13日"
                    },
                    {
                        "cname":"治安支队5",
                        "pname":"2015-32*******破拆工具组采购等项目",
                        "date":"11月13日",
                        "endDate":"11月13日"
                    },
                    {
                        "cname":"治安支队6",
                        "pname":"2015-32*******破拆工具组采购等项目",
                        "date":"11月13日",
                        "endDate":"11月13日"
                    },
                    {
                        "cname":"治安支队7",
                        "pname":"2015-32*******破拆工具组采购等项目",
                        "date":"11月13日",
                        "endDate":"11月13日"
                    },
                    {
                        "cname":"治安支队8",
                        "pname":"2015-32*******破拆工具组采购等项目",
                        "date":"11月13日",
                        "endDate":"11月13日"
                    },
                    {
                        "cname":"治安支队9",
                        "pname":"2015-32*******破拆工具组采购等项目",
                        "date":"11月13日",
                        "endDate":"11月13日"
                    },
                    {
                        "cname":"治安支队10",
                        "pname":"2015-32*******破拆工具组采购等项目",
                        "date":"11月13日",
                        "endDate":"11月13日"
                    }
                ]	
            }

        }
    },
    computed: {
    },
    created() {
        this.getData(); //获取单位名称
        this.getTables();//分割成四个表格 
    },
    methods: {
        getData() {
            
        },
        getTables(){
            for(let i=0;i<=this.formDatas.weeklyReportList.length;i++){
                if(i<this.formDatas.itemSize[0]){ //第一个表格长度为itemSize的第一个数
                    this.weeklyReportList_1.push(this.formDatas.weeklyReportList[i]);
                }
                else if(i<this.formDatas.itemSize[0]+this.formDatas.itemSize[1]){  //第二个表格
                    this.weeklyReportList_2.push(this.formDatas.weeklyReportList[i]);
                }
                else if(i<this.formDatas.itemSize[0]+this.formDatas.itemSize[1]+this.formDatas.itemSize[2]){
                    this.weeklyReportList_3.push(this.formDatas.weeklyReportList[i]);
                }
                else{
                    this.weeklyReportList_4.push(this.formDatas.weeklyReportList[i]);
                }
            }
        },
        // 导出周报
        weekClick() {
            //此代码实现向后台异步请求数据
            WeekReport(this.formDatas).then(res => {
                if(res.code == 200) {
                    let a = document.createElement('a');
                    a.href = res.data; // 这里的请求方式为get ，域名+url
                    a.click();
                }
            }).catch(error => {
              console.log(error)
            })
        },

    }
}
</script>
 
<style>
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
.el-table {
    font-size:13px;
}
.el-table .cell {
    line-height:27px;
}
 
</style>