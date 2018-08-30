<template>
    <div>
        <div style="margin-top: 15px;">
            <el-input placeholder="请输入内容" v-model="searchInp" class="input-with-select">
                <el-button slot="append" icon="el-icon-search" @click='searchbtn'></el-button>
            </el-input>
            <el-button type="success" @click='addgood'>添加商品</el-button>
        </div>
         <el-table
            :data="goodlist"
            stripe
            border
            style="width: 100%">
            <el-table-column
            type="index"
            width="50">
            </el-table-column>
            <el-table-column
            prop="goods_name"
            label="商品名称"
            width="500">
            </el-table-column>
            <el-table-column
            prop="goods_price"
            label="商品价格"
            width="80">
            </el-table-column>
            <el-table-column
            prop="goods_weight"
            label="商品重量"
            width="80">
            </el-table-column>
            <el-table-column
            prop="add_time"
            label="时间"
            width="100">
            </el-table-column>
            <el-table-column
            prop="address"
            label="操作">
            <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="small" @click='editbtn(scope.row)'></el-button>
                <el-button type="danger" icon="el-icon-delete" size="small" ></el-button>
            </template>
            </el-table-column>
        </el-table>
         <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[5, 10, 50, 100]"
            :page-size="pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
    </div>
</template>
<script>
import {getgoodlist} from '../../api/api.js'
    export default{
        data(){
            return{
                searchInp:'',
                goodlist:[],
                currentPage:1,
                total:10,
                pagesize:5
            }
        },
        created(){
            this.getinit()
        },
        methods:{
            getinit(){
               getgoodlist({
                   query:this.searchInp,
                   pagenum:this.currentPage,
                   pagesize:this.pagesize
               }).then(res=>{
                   console.log(res)
                   if(res.meta.status==200){
                       this.goodlist = res.data.goods
                       this.currentPage = parseInt(res.data.pagenum)
                       this.total = res.data.total
                   }
               }) 
            },
            // 每页条数
            handleSizeChange(val){
                this.pagesize = val
                this.getinit()
            },
            // 当前页
            handleCurrentChange(val){
                this.currentPage = val
                this.getinit()
            },
            searchbtn(){
                this.getinit()
            },
            editbtn(row){
                console.log(row.goods_id)
                this.$router.push({name:'edit',params:{id:row.goods_id}})
            },
            addgood(){
                console.log(111)
                this.$router.push({name:'add'})
            }
        }
    }
</script>
<style scoped>
.el-input-group{
    width:30%;
}
</style>

