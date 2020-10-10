<template>
    <div class="content">
        <form action="" method="post">
            <label>用户账号(邮箱)：</label><input name="UserAccount" type="text"/><br /><br />
            <label>用户名：</label><input name="Username" type="text"/><br />
            <label>所属单位：</label><select name="UnitName" class="DropDownBox">
            <option value="项目管理">项目管理</option>
            <option value="统计报表">统计报表</option>
            <option value="单位管理">单位管理</option>
            <option value="用户管理">用户管理</option>
            <option value="用户管理">角色管理</option>
            <option value="用户管理">资料管理</option>
        </select><br />
            <label>角色：</label><select name="Character" class="DropDownBox">
            <option value="0">单位0</option>
            <option value="1">单位1</option>
            <option value="2">单位2</option>
            <option value="3">单位3</option>
        </select><br /><br /><br /><br /><br />
            <div style="text-align:center"><button class="button" type="submit">提交</button></div>
        </form>
    </div>
</template>

<script>
    export default {
        name: "test"
    }
</script>

<style scoped>
    .content{
        height:50%;
        width:400px;
        margin:0 auto;
        margin-top:30px;
        padding:20px;
        border: 1px solid #000;
        background-color: #FFFFFF;
    }
    input{
        width: 180px;
        height: 24px;
        border: 1px solid rgb(102, 102, 102);
        padding-left: 2px;
        padding-right: 2px;
        margin: 0px;
        box-sizing: border-box;
        outline: none;
        line-height: 22px;
        text-align: left;
        font-size: 12px;
        font-weight: 400;
        font-family: 微软雅黑;
        left: 305px;
        top: 84px;
    }
    label{
        display:inline-block;
        white-space: nowrap;
        text-align: left;
        font-size: 12px;
        font-weight: 400;
        font-style: normal;
        text-decoration: none;
        font-family: 微软雅黑;
        margin-left:20px;
        width:100px;
    }
    .DropDownBox{
        width: 180px;
        height: 24px;
        border: 1px solid rgb(102, 102, 102);
        padding-right: 2px;
        margin: 0px;
        box-sizing: border-box;
        outline: none;
        line-height: 22px;
        text-align: left;
        font-size: 12px;
        font-weight: 400;
        font-family: 微软雅黑;
        top: 84px;
        margin-top:20px;
    }
    .button{
        width: 75px; /* 宽度 */
        height: 27px; /* 高度 */
        background-color: rgb(255, 255, 255);
        border-radius: 4px;
        border-width: 1px;
        border-color: rgb(102, 102, 102);
        border-style: solid;
        box-sizing: border-box;
        font-size: 12px;
        font-weight: 400;
        font-style: normal;
        text-decoration: none;
        font-family: 微软雅黑;
        color: rgb(0, 0, 0);
        text-align: center;
        line-height: 15px;
        white-space: pre-wrap;
    }
</style>