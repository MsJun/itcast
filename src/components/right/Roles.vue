<template>
  <div>
       <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加角色 -->
       <div>
      <el-button type="success" plain @click='dialogVisible4Addroles = true'>添加角色</el-button>
    </div>
         <!-- 数据 -->
     <el-table
    :data="tableData"
    stripe
    style="width: 100%">
    <!--折叠模板 -->
     <el-table-column type="expand">
        <template slot-scope='scope'>
          <el-row :key="item.id" v-for="item in scope.row.children">

            <el-col :span="3">
              <el-tag @close="deleteRight(scope.row, item.id)" closable>{{item.authName}}</el-tag>
              <i v-if="item.children.length>0" class="el-icon-arrow-right arrow"></i>
            </el-col>

            <el-col :span="21">
              <el-row class="authlist" :key="tag.id" v-for="tag in item.children">

                <el-col :span="4">
                  <el-tag @close="deleteRight(scope.row, tag.id)" type="success" closable>{{tag.authName}}</el-tag>
                  <i v-if="tag.children.length>0" class="el-icon-arrow-right arrow"></i>
                </el-col>

                <el-col :span="20">
                  <el-tag @close="deleteRight(scope.row, btn.id)" :key="btn.id" type="warning" closable v-for="btn in tag.children">{{btn.authName}}</el-tag>
                </el-col>
                
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>

    <el-table-column
        type="index"
        label="#"
        width="50">
      </el-table-column>
    <el-table-column
      prop="roleName"
      label="角色名称"
      width="180">
    </el-table-column>
    <el-table-column
      prop="roleDesc"
      label="描述">
    </el-table-column>
    <el-table-column
      label="操作">
      <template slot-scope="scope">
        <el-button type="primary" icon="el-icon-edit" size="small" @click="getactroles(scope.row)"></el-button>    
       <el-button type="danger" icon="el-icon-delete" size="small" @click="delrole(scope.row)"></el-button>
       <el-button type="warning" icon="el-icon-star-off" size="small" @click="power(scope.row)"></el-button>
    </template>  
    </el-table-column>
  </el-table>
  <!-- 添加角色弹窗 -->
  <el-dialog
        title="提示"
        :visible.sync="dialogVisible4Addroles"
        width="50%"
       >
        <el-form :model="user" :rules="rules" ref="roleform" label-width="80px" class="demo-ruleForm">
            <el-form-item label="角色名称" prop="roleName">
                <el-input v-model="user.roleName"></el-input>
            </el-form-item>
             <el-form-item label="描述" prop="roleDesc">
                <el-input v-model="user.roleDesc"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible4Addroles = false">取 消</el-button>
            <el-button type="primary" @click="rolesAdd">确 定</el-button>
        </span>
    </el-dialog>
    <!-- 修改角色 -->
    <el-dialog
        title="提示"
        :visible.sync="dialogVisible4rolesEdit"
        width="50%"
       >
        <el-form :model="euser" :rules="rules" ref="roleEdit" label-width="80px" class="demo-ruleForm">
            <el-form-item label="角色名称" prop="roleName">
                <el-input v-model="euser.roleName"></el-input>
            </el-form-item>
             <el-form-item label="描述" prop="roleDesc">
                <el-input v-model="euser.roleDesc"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible4rolesEdit = false">取 消</el-button>
            <el-button type="primary" @click="rolesEdit">确 定</el-button>
        </span>
    </el-dialog>
    <!-- 获取权限数据 -->
    <el-dialog
        title="提示"
        :visible.sync="dialogVisible4Grant"
        width="50%"
       >
        <el-tree
            default-expand-all
            :data="grantList"
            show-checkbox
            node-key="id"
            :props="defaultProps"
            :default-checked-keys="selectTree"
            ref='tree'
            >
        </el-tree>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible4Grant = false">取 消</el-button>
            <el-button type="primary" @click="rolesGrant">确 定</el-button>
        </span>
    </el-dialog>

  </div>
</template>
<script>
import {rolesList,addRoles,getRoleById,editRole,deleRole,deleteRight,getRight,submitGrant} from '../../api/api.js'
    export default{
        data(){
            return{
                tableData:[],
                // 添加角色弹窗
                dialogVisible4Addroles:false,
                // 修改用户弹窗
                dialogVisible4rolesEdit:false,
                //获取所有权限弹窗 
                dialogVisible4Grant:false,
                //权限树结构数据
                grantList: [],
                // 子集菜单的名称
                defaultProps: {
                children: 'children',
                label: 'authName'
                },
                // 默认已经选中
                selectTree:[],
                //当前角色id
                currentRole:'',
                user:{
                    roleName:'',
                    roleDesc:''
                },
                euser:{
                    id:'',
                    roleName:'',
                    roleDesc:''
                },
                 rules: {
                    roleName: [
                    { required: true, message: '请输入角色名', trigger: 'blur' }
                    ],
                    roleDesc: [
                    { required: true, message: '请输入描述', trigger: 'blur' }
                    ]
                },
            }
        },
        created(){
            this.getinit()
        },
        methods:{
            // 获取角色列表
            getinit(){
                rolesList().then(res=>{
                    //console.log(res)
                    this.tableData = res.data
                })
            },
            // 添加角色
            rolesAdd(){
                this.$refs['roleform'].validate(valid=>{
                    if(valid){
                        addRoles(this.user)
                        .then(res=>{
                            //console.log(res)
                            if(res.meta.status==201){
                                this.$message({
                                    type: 'success',
                                    message: res.meta.msg
                                });
                                this.getinit()
                            }
                        })
                        this.dialogVisible4Addroles = false
                        this.user = {}
                    }
                })
            },
            // 获取当前用户角色信息
            getactroles(data){
                //console.log(data)
                getRoleById({id:data.id}).then(res=>{
                    console.log(res)
                    if(res.meta.status==200){
                        this.euser.id = res.data.roleId
                        this.euser.roleName = res.data.roleName
                        this.euser.roleDesc = res.data.roleDesc
                        this.dialogVisible4rolesEdit = true
                    }
                })

            },
            //确定当前用户角色信息
            rolesEdit(){
                this.$refs['roleEdit'].validate(valid=>{
                    if(valid){
                        editRole(this.euser)
                        .then(res=>{
                            console.log(res)
                            if (res.meta.status === 200) {
                                // 刷新页面
                                this.getinit()
                                // 关闭窗口
                                this.dialogVisible4rolesEdit = false
                                }
                        })
                    }

                })
            },
            // 删除角色
            delrole(data){
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    deleRole(data.id)
                    .then(res=>{
                        if(res.meta.status==200){
                            this.$message({
                                type: 'success',
                                message: res.meta.msg
                            });
                            this.getinit()
                        }
                    })
                }) 
            },
            // 删除指定角色的权限
            deleteRight(data,id){
                deleteRight({roleId:data.id,rightId:id})
                .then(res=>{
                    console.log(res)
                    if(res.meta.status==200){
                        data.children = res.data
                    }
                    
                })
            },
            //获取三级权限数据
            _getThreeId(data,arr){
                data.forEach((item)=>{
                    if(!item.children){
                        arr.push(item.id)
                    }else{
                       this._getThreeId(item.children,arr) 
                    }
                })
            },
            // 渲染权限列表
            power(data){
                //获取当前的id
                this.currentRole = data.id
                getRight({type:"tree"}).then(res=>{
                    // 获取权限数据，渲染到数据列表中
                    this.grantList = res.data
                    console.log(res.data)
                })
                //当前的角色默认已经有的权限，获取的id
                this._getThreeId(data.children,this.selectTree)
                console.log(1)
                console.log(this.selectTree)
               this.dialogVisible4Grant = true 
            },
            //点击确定按钮，确定修改权限
            rolesGrant(){
                this.dialogVisible4Grant = false
                // 获取选中的权限的id
                let selectedTree = this.$refs['tree'].getCheckedNodes()
                //console.log(selectedTree)
                // 通过map找到三级id和一二级id，返回一个数组
                let ids = selectedTree.map(item=>{
                    return item.id+','+item.pid
                })
                //将数据转成字符串 
                let tmp = ids.join(',')
                //因为字符串中有重复的项，又转成数组
                let tmp2 = tmp.split(',')
                //通过new Set()进行数据去重
                let tmp3 = new Set(tmp2)
                // 转成字符串
                let result = [...tmp3].join(',')
                console.log(result)
                submitGrant({roleId:this.currentRole,rids: result})
                .then(res=>{
                    console.log(res)
                    if(res.meta.status==200){
                        this.getinit()
                        this.$message({
                            message: res.meta.msg,
                            type: 'success'
                        })
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

