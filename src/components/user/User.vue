<template>
  <div>
      <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <el-input v-model='query' placeholder="请输入内容" class="search">
        <el-button slot="append" icon="el-icon-search" @click='search'></el-button>
      </el-input>
      <el-button type="success" plain @click='dialogVisible4Add = true'>添加用户</el-button>
    </div>
    <!-- 数据 -->
     <el-table>

    :data="tableData"
    stripe
    style="width: 100%">

    <el-table-column
        type="index"
        label="#"
        width="50">
      </el-table-column>
    <el-table-column
      prop="username"
      label="用户名"
      width="180">
    </el-table-column>
    <el-table-column
      prop="email"
      label="邮箱">
    </el-table-column>
    <el-table-column
      prop="mobile"
      label="手机">
    </el-table-column>
    <el-table-column
      prop="role_name"
      label="角色">
    </el-table-column>
     <el-table-column
      prop="mg_state"
      label="用户状态">
        <template slot-scope="scope">
          <!-- 作用域插槽，可以定制数据显示 -->
          <el-switch @change='toggleUser(scope.row)' v-model="scope.row.mg_state"></el-switch>
        </template>
    </el-table-column>
    <el-table-column
      label="操作">
      <template slot-scope="scope">
          <!-- 修改 -->
        <el-button type="primary" icon="el-icon-edit" size="small" @click="getactuser(scope.row)"></el-button>
        <!-- 删除 -->
       <el-button type="danger" icon="el-icon-delete" size="small" @click="deluser(scope.row)"></el-button>
       <!-- 权限 -->
       <el-button type="warning" icon="el-icon-star-off" size="small" @click="power(scope.row)"></el-button>
    </template>
    </el-table-column>
  </el-table>
  <!-- 页码 -->
  <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5, 10, 15,20]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 添加用户弹窗 -->
    <el-dialog
        title="提示"
        :visible.sync="dialogVisible4Add"
        width="50%"
       >
        <el-form :model="user" :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="user.username"></el-input>
            </el-form-item>
             <el-form-item label="密码" prop="password">
                <el-input v-model="user.password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="user.email"></el-input>
            </el-form-item>
            <el-form-item label="电话" prop="mobile">
                <el-input v-model="user.mobile"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible4Add = false">取 消</el-button>
            <el-button type="primary" @click="submitAdd">确 定</el-button>
        </span>
    </el-dialog>
    <!-- 修改用户弹窗 -->
    <el-dialog
        title="提示"
        :visible.sync="dialogVisibleModify"
        width="50%"
       >
        <el-form :model="euser" :rules="rules" ref="modifyForm" label-width="80px" class="demo-ruleForm">
            <el-form-item label="用户名" prop="username">
                <el-button>{{euser.username}}</el-button>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="euser.email"></el-input>
            </el-form-item>
            <el-form-item label="电话" prop="mobile">
                <el-input v-model="euser.mobile"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisibleModify = false">取 消</el-button>
            <el-button type="primary" @click="modify">确 定</el-button>
        </span>
    </el-dialog>
    <!-- 修改权限 -->
    <el-dialog
        title="提示"
        :visible.sync="dialogVisiblePower"
        width="50%"
       >
        <div>当前用户：<span>{{curUser.username}}</span></div>
        <span>当前角色：</span>
        <el-select v-model="actRoule"  placeholder="活动区域">

            <el-option
            v-for="item in roulesList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id">
            </el-option>
        </el-select>

        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisiblePower = false">取 消</el-button>
            <el-button type="primary" @click="submitUser4Role">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script>
import {getuserlist,toggleuserType,addUser,getActId,modifyUser,delUser,roulesList,giveRole} from '../../api/api.js'
    export default{
        data(){

            return{
                query:'',//获取输入框内容
                //当前页码
                currentPage:1,
                //每页显示几条数据
                pagesize:5,
                //数据总条数
                total:10,
                //实际显示数据
                tableData: [],
                // 添加用户弹窗
                dialogVisible4Add:false,
                //修改用户弹窗
                dialogVisibleModify:false,
                // 修改权限
                dialogVisiblePower:false,
                // 当前用户
                curUser:{},
                // 角色列表
                roulesList:[],
                //当前角色
                actRoule:'',
                user:{
                    username:'',
                    password:'',
                    email:'',
                    mobile:''
                },
                euser:{
                    username:'',
                    password:'',
                    email:'',
                    mobile:'',
                    id:''
                },
                rules: {
                    username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                    { required: true, message: '请输入密码', trigger: 'blur' }
                    ],
                    email: [
                    { required: true, message: '请输入密码', trigger: 'blur' }
                    ],
                    mobile: [
                    { required: true, message: '请输入密码', trigger: 'blur' }
                    ]
                },
            }
        },
        created(){
            //获取数据
            this.initlist()
        },
        methods:{
            //获取用户数据
            initlist(){
                getuserlist({
                    query:this.query,
                    // 当前页码
                    pagenum:this.currentPage,
                    //每页显示的数据
                    pagesize:this.pagesize
                }).then(res=>{
                    this.tableData = res.data.users
                    // 总页数
                    this.total = res.data.total
                    // 当前页码
                    this.currentPage = res.data.pagenum

                })
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                // 每页几条数据
                this.pagesize = val
                // 重新加载
                this.initlist()
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                // 当前第几页
                this.currentPage = val
                // 重新加载
                this.initlist()
            },
            // 更该用户状态
            toggleUser(data){
                // console.log(data)
                toggleuserType({
                    uId:data.id,
                    type:data.mg_state
                }).then(res=>{
                    console.log(res)
                    if(res.meta.status===200){
                        this.$message({
                            message: res.meta.msg,
                            type: 'success'
                        })
                    }
                })
            },
             // 添加用户
            submitAdd(){
                addUser(this.user).then(res=>{
                    //console.log(res)
                    //关闭弹窗
                    this.dialogVisible4Add = false
                    if(res.meta.status==201){
                        this.$message({
                            message: res.meta.msg,
                            type: 'success'
                        })
                        this.user = {}
                        this.initlist()
                    }
                })
            },
            //编辑用户，先根据id获取当前需要修改用户的信息
            getactuser(data){
                this.dialogVisibleModify = true;
                //console.log(data)
                getActId({id:data.id})
                .then(res=>{
                    //console.log(res)
                    this.euser = res.data
                })
            },
            // 修改用户信息，并提交
            modify(){
                 this.$refs['modifyForm'].validate((valid)=>{
                     if(valid){
                         //console.log(this.euser.id)
                         modifyUser(this.euser)
                         .then(res=>{
                            if (res.meta.status === 200) {
                            // 关闭窗口
                            this.dialogVisibleModify = false
                            // 刷新列表
                            this.initlist()
                            }
                         })
                     }
                 })
            },
            //删除用户
            deluser(data){
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delUser({id:data.id})
                    .then(res=>{
                        if(res.meta.status==200){
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.initlist()
                        }

                    })

                })
            },
            //搜索
            search(){
               this.initlist()
            },
            //获取用户角色
            power(data){
                 this.curUser = data;
                 //console.log(data)
                 this.actRoule = data.role_name
                roulesList().then(res=>{
                    console.log(res)
                    if(res.meta.status==200){
                        this.roulesList = res.data
                        this.dialogVisiblePower = true;
                    }
                })
            },
            // 提交新的角色修改
            submitUser4Role(){
                // console.log(1)
                console.log(this.actRoule)
                this.dialogVisiblePower = false
                giveRole({id:this.curUser.id,rid:this.actRoule})
                .then(res=>{
                    console.log(res)
                    if(res.meta.status==200){
                        this.$message({
                            type: 'success',
                            message: res.meta.msg
                        });
                        this.initlist()
                    }
                })
            }


        }
    }
</script>
<style scoped>
.el-breadcrumb{
    background-color: #D3DCE6;
    height: 50px;
    line-height: 50px;
    padding-left: 10px;
}
  .el-pagination {
    background-color: #D3DCE6;
    padding-top: 10px;
    height: 35px;
    line-height: 35px;
  }
  .search {
    width: 300px;
  }

</style>

