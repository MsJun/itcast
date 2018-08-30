<template>
  <div>
         <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
      <div>
      <el-button type="success" plain @click='addHandler'>添加分类</el-button>
    </div>
     <div>
      <!-- columns表示所有的列，tree-structure表示数据格式，data-source表示实际的列表数据，deleteCate处理删除操作，showForm处理编辑操作，refresh处理刷新操作 -->
      <tree-grid :columns="columns" :tree-structure="true" :data-source="dataSource" @deleteCate="deleteCategory" @showForm="showEditForm" @refresh="initList"></tree-grid>
    </div>
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
    <!-- 添加分类弹窗 -->
    <el-dialog
        title="提示"
        :visible.sync="dialogVisible4Add"
        width="50%"
       >
        <div><span>分类名称：</span><el-input v-model="cate.cat_name"></el-input></div>
        <!-- 联机菜单 -->
        <!-- options 是数据 -->
        <!-- selectedOptions 选中的数据id -->
        <el-cascader
        :props="props"
        :options="options"
        v-model="selectedOptions"
        :show-all-levels="false"
        >
        </el-cascader>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible4Add = false">取 消</el-button>
            <el-button type="primary" @click="submitAdd">确 定</el-button>
        </span>
    </el-dialog>
    <!--编辑分类 -->
     <el-dialog
        title="提示"
        :visible.sync="dialogVisible4Edit"
        width="50%"
       >
        <div><span>分类名称：</span><el-input v-model="ecate.cat_name"></el-input></div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible4Edit = false">取 消</el-button>
            <el-button type="primary" @click="submitEdit">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script>
// y引入组件
import TreeGrid from './TreeGrid'
import {getCategory,addCat,edit,editCate,deleteCate} from '../../api/api'
    export default{
        data(){
            return{
                //当前第几页
                currentPage:1,
                // 每页条数
                pagesize:5,
                // 总共有几页
                total:0,
                // 实际列表数据
                dataSource:[],
                // 添加分类弹窗
                dialogVisible4Add:false,
                // 级联选择器的数据
                options:[],
                // 级联选择器选中的id
                selectedOptions:[],
                // 编辑分类弹窗
                dialogVisible4Edit:false,
                props:{
                    value: 'cat_id',
                    label: 'cat_name'
                },
                cate:{
                    cat_pid:'',
                    cat_name:'',
                    cat_level:''
                },
                ecate:{
                    cat_pid:'',
                    cat_name:'',
                    cat_level:''
                },
                columns: [{
                    text: '分类名称',
                    dataIndex: 'cat_name',
                    width: 500
                }, {
                    text: '是否有效',
                    dataIndex: 'cat_deleted',
                    width: 100
                }, {
                    text: '排序',
                    dataIndex: 'cat_level',
                    width: 100
                }],
            }
        },
        created(){
            this.initList()
        },
        methods:{
            //每页显示条数
            handleSizeChange(val){
                this.pagesize = val
                this.initList()

            },
            // 当前页码数
            handleCurrentChange(val){
                this.currentPage = val
                this.initList()
            },
            // 删除
            deleteCategory(id){
                console.log(id)
                deleteCate({id:id}).then(res=>{
                    if (res.meta.status === 200) {
                        // 刷新列表
                        this.initList()
                        this.$message({
                            type: 'success',
                            message: res.meta.msg
                        })
                    }
                })
            },
            // 编辑
            showEditForm(id){
                console.log(id)
                edit({id:id})
                .then(res=>{
                    console.log(res)
                    if(res.meta.status==200){
                        this.ecate.cat_pid = res.data.cat_id
                        this.ecate.cat_name = res.data.cat_name
                        this.ecate.cat_level = res.data.cat_level
                        this.dialogVisible4Edit = true
                    }
                })
                

            },
            //确认编辑
            submitEdit(){
                console.log(this.ecate)
                editCate(this.ecate).then(res=>{
                    this.dialogVisible4Edit = false
                    this.initList()
                })
            },
            // 初始化
            initList(){
                getCategory({type:3,pagenum:this.currentPage,pagesize:this.pagesize})
                .then(res=>{
                    console.log(res)
                    if(res.meta.status==200){
                        // 渲染数据
                        this.dataSource = res.data.result
                        // 总共的条数
                        this.total = res.data.total
                        this.pagesize = res.data.pagesize
                    }   
                })
            },
            // 点击添加分类按钮
            addHandler(){
                this.dialogVisible4Add = true
                getCategory({type:2}).then(res=>{
                    console.log(res)
                    if(res.meta.status==200){
                       this.options = res.data 
                    }   
                })

            },
            // 确定添加分类按钮
            submitAdd(){
                console.log(this.selectedOptions)
                if(this.selectedOptions.length==0){
                    this.cate.cat_pid = 0;
                    this.cate.cat_level = 1
                }else{
                    this.cate.cat_pid = this.selectedOptions[this.selectedOptions.length-1]
                    this.cate.cat_level = this.selectedOptions.length=1?2:3
                }
                addCat(this.cate).then(res=>{
                    console.log(res)
                    if(res.meta.status==201){
                        this.initList()
                        this.dialogVisible4Add = false
                    }
                })
            },
        },
        components:{
            TreeGrid
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

</style>

