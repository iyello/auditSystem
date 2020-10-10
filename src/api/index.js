import request from '../utils/request';
import Vue from 'vue';
import axios from 'axios';
import qs from 'qs';
import { Form } from 'element-ui';

axios.defaults.withCredentials = true

new Vue({
    axios  // 加入axios
})
//const baseURL = 'http://127.0.0.1:8080/audit_manager/'
export const baseURL = 'http://134.175.42.212:8080/audit_manager/'
export const fetchData = (query) => {
    return request({
        url: '/ms/table/list',
        method: 'post',
        data: query
    })
}

//发送Post请求
export const sendPostRequest = (url,query) => {
    return axios({
        method: 'POST',
        headers:
            {
                'Content-Type': 'application/json',
            },
        url: baseURL+url,
        data: JSON.stringify(query)
    })
}
//发送Get请求
export const sendGetRequest = (url) => {
    return axios.get(baseURL+url)
}
//发送Get请求(带参)
export const sendGET_J_Request = (url,query) => {
    url = url + '?'
    for (let it in query) {
        url += it + '=' + query[it] + '&'
    }
    url = url.slice(0,url.length-1)
    return axios.get(baseURL+url)
}
//发送Put请求
export const sendPutRequest = (url,query) => {
    return axios({
        method: 'Put',
        headers:
            {
                'Content-Type': 'application/json',
            },
        url: baseURL+url,
        data: JSON.stringify(query)
    })
}
//发送Del请求
export const sendDelRequest = (url,query) => {
    return axios({
        method: 'delete',
        headers:
            {
                'Content-Type': 'application/json',
            },
        url: baseURL+url,
        data: JSON.stringify(query)
    })
}
//发送文件(Post)
export const sendFilePostRequest = (url,query) => {

    return axios({
        method: 'post',
        headers:
            {
                'Content-Type': 'multipart/form-data',
            },
        url: baseURL+url,
        data: query,
    })
}
//发送文件(Put)
export const sendFilePutRequest = (url,query) => {
    console.log(query.get('file'))
    return axios({
        method: 'put',
        headers:
            {
                'Content-Type': 'multipart/form-data',
            },
        url: baseURL+url,
        data: query,
    })
}
//***************************************模板管理***************************************************/
//获取指定模板详情
export const DetailMouldData = () => {
    return request({
        url: '/template/{tid}',
        method: 'get',
    })
}
//获取一页模板信息
export const MouldData = (query) => {
    return request({
        url: '/template',
        method: 'get',
        params:{
            category : query.mould, //模板类别
            pnode : query.schedule, //项目进度
            ptype : query.project, //项目类型
            page:query.pageIndex,//请求第几页
            pageSize:query.pageSize
        }
    })
}
//查询模板信息
export const SearchMouldData = (query) => {
    return request({
        url: '/template',
        method: 'get',
        params:{
            category : query.mould, //模板类别
            pnode : query.schedule, //项目进度
            ptype : query.project, //项目类型
            page:query.pageIndex,//请求第几页
            pageSize:query.pageSize
        }
    })
}
//编辑模板信息
export const EditMouldData = (formdata,tid) => {
    return request({
        url: '/template/' + tid,
        method: 'put',
        data: formdata,
        // 设定头信息
        headers: { 'Content-Type': 'multipart/form-data' }
    })
}
//删除模板信息
export const DeleteMouldData = (row) => {
    var idList = new Array();
    idList.push(row.tid);
    return request({
        url: '/template',
        method: 'delete',
        type: "post",
        params: {
            tids: idList
        },
        paramsSerializer: params => {
            return qs.stringify(params, { indices: false })
        }
    })
}
//新建模板信息
export const CreatMouldData = (formdata) => {
    console.log("表单",formdata);
    return request({
        url: '/template',
        method: 'post',
        data: formdata,
        // 设定头信息
        headers: { 'Content-Type': 'multipart/form-data' }
    })
}

//***************************************绩效评价指标***************************************************/
//获取指定评价指标详情
export const DetailEvaluation_index = (query) => {
    return request({
        url: '/evaluation/{eid}',
        method: 'get',
        params:{
            eid : query.eid
        }
    })
}
//获取全部的绩效评价信息
export const allEvaluation_index = () => {
    return request({
        url: '/evaluation',
        method: 'get',
        params:{
            category : "", //评价类型
            importance : "", //重要性
            page:1,//请求第几页
            pageSize:10000
        }
    })
}
//分页获取所有绩效评价信息
export const Evaluation_index = (query) => {
    return request({
        url: '/evaluation',
        method: 'get',
        params:{
            category : query.category, //评价类型
            importance : query.importance, //重要性
            page:query.pageIndex,//请求第几页
            pageSize:query.pageSize
        }
    })
}
//查询绩效评价信息
export const SearchEvaluation_index = (query) => {
    return request({
        url: '/evaluation',
        method: 'get',
        params:{
            category : query.category, //评价类型
            importance : query.importance, //重要性
            page:query.pageIndex,//请求第几页
            pageSize:query.pageSize
        }
    })
}
//编辑绩效评价信息
export const EditEvaluation_index = (form) => {
    return request({
        url: '/evaluation/'+form.eid,
        method: 'put',
        params:{
            eid : form.eid,
            category : form.category,
            ename : form.ename,
            importance : form.importance,
            ratio : form.ratio,
            description : form.description,
            neededFiles : form.neededFiles
        }
    })
}
//删除绩效评价信息
export const DeleteEvaluation_index = (row) => {
    var idList = new Array();
    idList.push(row.eid);
    return request({
        url: '/evaluation',
        method: 'delete',
        params:{
            eids : idList
        },
        paramsSerializer: params => {
            return qs.stringify(params, { indices: false })
        } //将参数连接在url后
    })
}
//新建绩效评价信息
export const CreatEvaluation_index = (form) => {
    return request({
        url: '/evaluation',
        method: 'post',
        params:{
            category : form.category,
            ename : form.ename,
            importance : form.importance,
            ratio : form.ratio,
            description : form.description,
            neededFiles : form.neededFiles
        }
    })
}
//***************************************单位项目列表***************************************************/
//获取所有单位项目信息
export const UnitProject = (query,user) => {
    return request({
        url: '/search/unit',
        method: 'get',
        cache:false,
        dataType:'json',
        params:{
            uid:user.uid, //用户id
            cid:user.cid, //单位编号
            node:"none",
            type:"none",
            createTimeMin:"none",
            createTimeMax:"none",
            finishTimeMin:"none",
            finishTimeMax:"none",
            pageNum:query.pageIndex,
            pageSize:query.pageSize,
        }
    })
}
//查询单位项目信息
export const SearchUnitProject = (query,user) => {
    console.log("time",query)
    return request({
        url: '/search/unit',
        method: 'get',
        params:{
            uid: user.uid, //用户id
            cid: user.cid, //单位编号
            node: query.node, //项目进度
            type: query.type, //项目类型
            createTimeMin: query.createTimeMin,
            createTimeMax: query.createTimeMax,
            finishTimeMin: query.finishTimeMin,
            finishTimeMax: query.finishTimeMax,
            pageNum: query.pageIndex,
            pageSize: query.pageSize,
        }
    })
}
//获取单位id和名称
export const GetUnits = () => {
    return request({
        url: '/company',
        method: 'get',
        params:{
            
        }
    })
}
//新建父级项目
export const CreatParentProject = (form,user) => {
    return request({
        url: '/project/father',
        method: 'post',
        params:{
            cid : user.cid,
            uid : user.uid,
            pname : form.pname,
            type : form.type,
            
        }
    })
}
//新建子级项目
export const CreatSubProject = (form,user) => {
    return request({
        url: '/project/son',
        method: 'post',
        params:{
            cid : user.cid,
            uid   : user.uid  ,
            parentPid  : form.parentPid , //父项目id
            pname  : form.pname ,
            type  : form.type ,
           
        }
    })
}
//编辑单位项目
export const EditUnitProject = (form,user) => {
    return request({
        url: '/project/'+form.pid,
        method: 'put',
        params:{
            parentPid : form.parentPid,
            pid : form.pid,
            pname : form.pname,
            type : form.type,
            cid : user.cid,
            uid  : user.uid
        }
    })
}
//删除单位项目
export const DeleteUnitProject = (row) => {
    return request({
        url: '/project/'+ row.pid,
        method: 'delete',
        params:{
            pid  : row.pid
        }
    })
}
//查看项目详情
export const DetailUnitProject = (pid,user) => {
    return request({
        url: '/project/'+ pid,
        method: 'get',
        params:{
            pid  : pid,
            uid  : user.uid ,
        }
    })
}
//***************************************绩效评审***************************************************/
//查询分数
export const GetScore = (pid) => {
    return request({
        url: '/projectEvaluation/' + pid,
        method: 'get',
        params:{
            
        }
    })
}
//修改分数(单项)
export const ChangeScore = (eid,peid,pid,score) => {
    return request({
        url: '/projectEvaluation',
        method: peid === undefined ? 'post':'put',
        data:{
            peid : peid, //项目评价编号
            eid  : eid, //指标编号
            pid  : pid , //项目编号
            score : score
        }
    })
}
// //修改分数(多项)
// export const ChangeScores = (form) => {
//     console.log(form)
//     return request({
//         url: '/projectEvaluation/J',
//         method:'post',
//         data:form,
//     })
// }
//绩效审核提交
export const SubmitAudit = (pid) => {
    console.log(pid)
    return request({
        url: '/audit/performance/' + pid,
        method: 'put',
        params:{
            
        }
    })
}
//***************************************统计报表***************************************************/
//周报
export const WeekReport = (form) => {
    return request({
        url: '/weekly',
        method: 'post',
        data:form,
    })
}
//月报
export const MonthReport = (form) => {
    return request({
        url: '/monthly',
        method: 'post',
        data:form,
    })
}