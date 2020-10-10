<template>
    <div class="box">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 月报
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <h2 style="display:inline;">{{formDatas.label[0].text}}</h2>
                <el-button style="margin:0px 300px;" type="primary" class="" @click="monthClick">导出月报</el-button>
            </div>
            <el-table
                :span-method="cellMerge"
                :data="formDatas.monthlyReportList"
                border
                style="width: 100%">
                <el-table-column
                prop="text"
                label="项目"
                width="80"
                align="center">
                </el-table-column>
                <el-table-column
                prop="cname"
                label="送审单位"
                width="230"
                align="center">
                </el-table-column>
                <el-table-column
                prop="id"
                label="序号"
                width="80"
                align="center">
                </el-table-column>
                <el-table-column
                prop="pname"
                label="送审项目名称"
                align="center">
                </el-table-column>
                <el-table-column
                prop="type"
                label="招标方式"
                width="170"
                align="center">
                </el-table-column>
                <el-table-column
                prop="opinion"
                label="审计意见"
                width="150"
                align="center">
                </el-table-column>
                <el-table-column
                prop="time"
                label="送审时间"
                width="150"
                align="center">
                </el-table-column>
                <el-table-column
                prop="endDate"
                label="结审时间"
                width="150"
                align="center">
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
 
<script>
import { MonthReport } from '../../api/index';//月报接口
import { GetUnits } from '../../api/index';//获取单位id和名称接口

export default {
    data() {
        return {
            formDatas: {
                sheetName:"月报",
                label:[
                {
                    text: "2015年12月份信息工程及货物类合同及招标文件审计项目一览表",
                    height: 18,
                    rowindex:3,
                    propertyStart:1,
                    cell:8,
                    label:[
                        {
                            text: "项目",
                            width: 4,
                            height:31.5,
                            cell:8,
                            label:[
                                {
                                    text: "合同文件",
                                    cell:4,  
                                    width: 4.0,
                                    type:1
                                },
                                {
                                    text: "招标文件",
                                    cell:2,
                                    width: 4.0,
                                    type:1
                                }
                            ]
                        },
                        {
                            text: "送审单位",
                            width: 18.7,
                            height:22.5
                        },
                        {
                            text: "序号",
                            width: 4.7,
                            height:22.5
                        },
                        {
                            text: "送审项目名称",
                            width: 70.2,
                            height:22.5
                        },
                        {
                            text: "招标方式",
                            width: 12.8,
                            height:22.5
                        },
                        {
                            text: "审计意见",
                            width: 9.3,
                            height:22.5
                        },
                        {
                            text: "送审时间",
                            width: 9.4,
                            height:22.5
                        },
                        {
                            text: "审结时间",
                            width: 9.7,
                            height:22.5
                        }
                    ]
                }
                ],
                monthlyReportList:[
                    {
                        cname:"治安支队",
                        id:1,
                        pname:"2015-32*******破拆工具组采购等项目",
                        type:"公开招标",
                        opinion:2,
                        time:"11月26日",
                        endDate:"11月26日"
                    },
                    {
                        cname:"治安支队",
                        id:2,
                        pname:"2015-32*******破拆工具组采购等项目",
                        type:"公开招标",
                        opinion:2,
                        time:"11月26日",
                        endDate:"11月26日"
                    },
                    {
                        cname:"治安支队",
                        id:3,
                        pname:"2015-32*******破拆工具组采购等项目",
                        type:"公开招标",
                        opinion:2,
                        time:"11月26日",
                        endDate:"11月26日"
                    },
                    {
                        cname:"采购合计",
                        id:3,
                        opinion:6
                    },
                    {
                        cname:"治安支队",
                        id:1,
                        pname:"2015-32*******破拆工具组采购等项目",
                        type:"公开招标",
                        opinion:2,
                        time:"11月26日",
                        endDate:"11月26日"
                    },
                    {
                        cname:"采购合计",
                        id:2,
                        opinion:2
                    }
	            ]
            },
            spanArr: [],//记录行
        }
    },
    computed: {
    },
    created() {
        this.getData(); //获取单位名称
        this.getTable(); //转化数据
        this.getSpanArr(this.formDatas.monthlyReportList);
    },
    methods: {
        getData() {
            
        },
        //未完善
        getTable() {
            for(let i=0;i<=this.formDatas.monthlyReportList.length;i++){
                if(i<this.formDatas.label[0].label[0].label[0].cell){
                    this.formDatas.monthlyReportList[i].text = this.formDatas.label[0].label[0].label[0].text;
                }
                else if(i<this.formDatas.label[0].label[0].label[0].cell+this.formDatas.label[0].label[0].label[1].cell){
                    this.formDatas.monthlyReportList[i].text = this.formDatas.label[0].label[0].label[1].text;
                }
                
            }
        },
        getSpanArr(data) {　
            for (var i = 0; i < data.length; i++) {
                if (i === 0) {
                    this.spanArr.push(1);
                    this.pos = 0
                } else {
                // 判断当前元素与上一个元素是否相同
                    if (data[i].text === data[i - 1].text) {
                        this.spanArr[this.pos] += 1;
                        this.spanArr.push(0);
                    } else {
                        this.spanArr.push(1);
                        this.pos = i;
                    }
                }
          }
        },
        cellMerge({ row, column, rowIndex, columnIndex }) {
             if (columnIndex === 0) {
                 const _row = this.spanArr[rowIndex];
                 const _col = _row > 0 ? 1 : 0;
                 return {
                        rowspan: _row,
                        colspan: _col
                    }
            }
        },
        // 导出月报
        monthClick() {
            //此代码实现向后台异步请求数据
            MonthReport(this.formDatas).then(res => {
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