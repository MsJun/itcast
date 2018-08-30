<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 联动 -->
     <el-cascader
     :show-all-levels="false"
     :props="props"
    :options="options"
    v-model="selectedOptions"
    @change="handleChange">
  </el-cascader>
  <!-- tab切换 -->
  <div class="tabbg">
    <el-tabs v-model="tabAct" type="card" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="dynamic">
            <el-button type="success">添加参数</el-button>
            <el-table
            :data="DtableData"
            stripe
            style="width: 100%">
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-tag
                    :key="tag"
                    v-for="tag in props.row.attr_vals"
                    closable
                    :disable-transitions="false"
                    @close="handleClose(tag)">
                    {{tag}}
                    </el-tag>
                    <el-input
                    class="input-new-tag"
                    v-if="props.row.inputVisible"
                    v-model="props.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm"
                    @blur="handleInputConfirm"
                    >
                    </el-input>
                    <el-button v-else class="button-new-tag" size="small" @click="showInput(props.row)">+ New Tag</el-button>
                </template>
            </el-table-column>
            <el-table-column
            type="index"
            width="180">
            </el-table-column>
            <el-table-column
            prop="attr_name"
            label="参数名称"
            width="180">
            </el-table-column>
            <el-table-column
            prop="address"
            label="操作">
            <template slot-scope="scope">
                <!-- 修改 -->
                <el-button type="primary" icon="el-icon-edit" size="small"></el-button>
                <!-- 删除 -->
                <el-button type="danger" icon="el-icon-delete" size="small" ></el-button>
            </template>
            </el-table-column>
        </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态参数" name="static">
            <el-button type="success">添加属性</el-button>
            <el-table
            :data="StableData"
            stripe
            style="width: 100%">
            <el-table-column
            type="index"
            width="180">
            </el-table-column>
            <el-table-column
            prop="attr_name"
            label="参数名称"
            width="180">
            </el-table-column>
            <el-table-column
            prop="address"
            label="操作">
            <template slot-scope="scope">
                <!-- 修改 -->
                <el-button type="primary" icon="el-icon-edit" size="small"></el-button>
                <!-- 删除 -->
                <el-button type="danger" icon="el-icon-delete" size="small" ></el-button>
            </template>
            </el-table-column>
        </el-table>
        </el-tab-pane>
  </el-tabs>
  </div>

  </div>
</template>
<script>
import {getCategory,getParams} from '../../api/api'
    export default{
        data(){
            return{
                options:[],
                selectedOptions:[],
                tabAct:'dynamic',
                DtableData:[],
                StableData:[],
                props:{
                    value: 'cat_id',
                    label: 'cat_name'
                }

            }
        },
        created(){
            this.getSelect()
        },
        methods:{
            getSelect(){
                getCategory({type:3}).then(res=>{
                    //console.log(res)
                    if(res.meta.status==200){
                        this.options = res.data
                    }
                })
            },
            _getParamsData(table){
                if(this.selectedOptions.length<3){
                    this.$message({
                    type: 'error',
                    message: '必须选择三级分类'
                    })
                    return
                }
                let id = this.selectedOptions[this.selectedOptions.length-1]
                console.log(id)
                let flag = this.tabAct=='dynamic'?'many':'only'
                console.log(flag)
                getParams({id:id,sel:flag}).then(res=>{
                    if(res.meta.status==200){
                        this[table] = res.data.map(item=>{
                            item.inputVisible = false
                            item.inputValue = ''
                            item.attr_vals = item.attr_vals.split(',')
                            return item
                        })
                    }
                    console.log(res.data)

                })
            },
            // 联动改变
            handleChange(){
                console.log(1)
               this._getParamsData('DtableData')
            },
            // tab切换
            handleClick(){
                let nowTab = this.tabAct=='dynamic'?'DtableData':'StableData'
                console.log(this.tabAct)
                this._getParamsData(nowTab)
            },
            // 展开tag关闭
            handleClose(){

            },
            // 添加tag
            handleInputConfirm(){

            },
            showInput(data){
                console.log(data)
              data.inputVisible = true
            }
        }
    }
</script>
<style scoped>
.el-breadcrumb{
    background: #D3DCE6;
    height: 50px;
    line-height: 50px;
    padding-left: 20px;
}
.tabbg{
    background: #fff;
}
</style>

