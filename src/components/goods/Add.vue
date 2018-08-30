<template>
    <div>
       <el-steps :space="1200" :active="1" finish-status="success">
            <el-step title="步骤 1"></el-step>
            <el-step title="步骤 2"></el-step>
            <el-step title="步骤 3"></el-step>
            <el-step title="步骤 4"></el-step>
            <el-step title="步骤 5"></el-step>
        </el-steps>

            <el-form ref="form" :model="form" label-width="80px">
            <el-tabs :tab-position="tabPosition" style="height: auto;" v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="基本信息" name='base'>
                    <el-form-item label="商品名称">
                        <el-input v-model='form.goods_name'></el-input>
                    </el-form-item>
                    <el-form-item label="商品价格">
                        <el-input  v-model='form.goods_price'></el-input>
                    </el-form-item>
                    <el-form-item label="商品重量">
                        <el-input  v-model='form.goods_weight'></el-input>
                    </el-form-item>
                    <el-form-item label="商品数量">
                        <el-input  v-model='form.goods_number'></el-input>
                    </el-form-item>
                    <el-form-item label="商品分类">
                        <el-cascader
                            :options="form.options"
                            v-model="form.selectedOptions"
                            :props="form.selfDefineAttr"
                            :show-all-levels="false"
                            @change="handleChange">
                        </el-cascader>
                    </el-form-item>
                    <el-form-item label="是否促销">
                        <el-radio-group v-model="form.is_promote" size="medium">
                            <el-radio border label="true">是</el-radio>
                            <el-radio border label="false">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="动态参数" name='params'>
                    <!-- 动态参数 -->
                    <el-form-item :key='item.attr_id' v-for='item in form.dparam' :label="item.attr_name">
                        <el-checkbox-group size="medium" v-model='item.attr_vals'>
                        <el-checkbox border :key='index' v-for='(tag, index) in item.attr_vals' :label="tag" :name="'p'+item.attr_id"></el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="静态参数" name='attrs'>
                    <el-form-item :key='item.attr_id' v-for='item in form.sparam' :label="item.attr_name">
                        <el-input v-model="item.attr_vals"></el-input>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="图片上传" name='uploader'>
                    <el-upload
                        class="upload-demo"
                        :action="baseUrl"
                        :on-preview="handlePreview"
                        :on-success="handleSuccess"
                        :on-remove="handleRemove"
                        :headers='token'
                        list-type="picture">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                        </el-upload>
                        <!--   显示缩略图 -->
                        <el-dialog :visible.sync="dialogVisible" append-to-body>
                            <img width="100%" :src="dialogImageUrl" alt="">
                        </el-dialog>
                    </el-tab-pane>
                <el-tab-pane label="商品详情" name='detail'>
                    <my-editor :defaultMsg=defaultMsg :config=config :id=editorId ref="editor"></my-editor>
                </el-tab-pane>
            </el-tabs>
            </el-form>
            <div class="footer">
                <el-button>取 消</el-button>
                <el-button type="primary" @click="addSubmit">确 定</el-button>
            </div>


    </div>
</template>
<script>
import MyEditor from './MyEditor.vue'
import {getCategory,getParams,addProduct} from '../../api/api.js'
    export default{
        data(){
            return{
                tabPosition: 'left',
                activeName:'base',
                dialogImageUrl:'',
                dialogVisible: false,
                token:{authorization: localStorage.getItem("mytoken")},
                form:{
                    goods_name:'',
                    goods_price:'',
                    goods_weight:'',
                    goods_number:'',
                    options:[],
                    selectedOptions:[],
                    resource:'',
                    is_promote:false,
                    selfDefineAttr: {
                        value: 'cat_id',
                        label: 'cat_name'
                    },
                    dparam:[],
                    sparam:[],
                    pictures:[]
                },
                baseUrl:'http://localhost:8080/api/private/v1/upload',
                //富文本配置
                defaultMsg:'测试数据',
                 config: {
                    toolbars: [['Source', 'FullScreen', 'simpleupload', 'Undo', 'Redo', 'Bold', 'test']],
                    // serverUrl: uploadInfo().url + '/upload',
                    serverUrl: 'http://47.96.21.88:8888/ueditor/ue',
                    initialFrameWidth: null,
                    initialFrameHeight: 350,
                    dataType: 'jsonp',
                    jsonp: 'hello'
                },
                editorId:'editorId'

            }
        },
        created(){
            this.getinit()
        },
        methods:{
            // 添加商品
            addSubmit(){

                console.log(222)
                let addProductinfo = {
                    goods_name:this.form.goods_name,
                    goods_cat:this.form.selectedOptions.join(','),
                    goods_price:this.form.goods_price,
                    goods_number:this.form.goods_number,
                    goods_weight:this.form.goods_weight,
                    goods_introduce:this.getRichTextContent(),
                    pics:this.form.pictures,
                    attrs:[]
                }
                addProductinfo.attrs = [...this.form.dparam,...this.form.sparam]
                addProductinfo.attrs.forEach(item=>{
                    item.attr_value = item.attr_vals
                })
                addProduct(addProductinfo).then(res=>{
                    console.log(res)
                    if(res.meta.status==201){
                        this.$router.push('/goodslist')
                    }
                })

            },

            getinit(){
                getCategory({type:"3"})
                .then(res=>{
                    console.log(res)
                    if(res.meta.status==200){
                        this.form.options = res.data
                    }
                })
            },
            handleClick(tab, event){
                console.log(tab.name)
                if(this.form.selectedOptions.length!=3){
                    // 没有选择三级分类，提示并终止运行
                    this.$message({
                        type: 'error',
                        message: '请选择三级分类'
                    })
                    return
                }
                console.log(this.form.selectedOptions,this.activeName)
                if(this.activeName=='params'){
                    getParams({
                        id:this.form.selectedOptions[this.form.selectedOptions.length-1],
                        sel:'many'
                    }).then(res=>{
                        console.log(res)
                        if(res.meta.status === 200){
                            this.form.dparam = res.data.map(item=>{
                                if(item.attr_vals){
                                    item.attr_vals = item.attr_vals.split(',')
                                }else{
                                    item.attr_vals = []
                                }
                                return item
                            })
                        }
                    })
                }else if(this.activeName=='attrs'){
                    getParams({
                        id:this.form.selectedOptions[this.form.selectedOptions.length-1],
                        sel:'only'
                    }).then(res=>{
                        console.log(res)
                        if(res.meta.status==200){
                            this.form.sparam = res.data
                        }
                    })
                }
            },
            handleChange(){

            },
            // 缩略图
            handlePreview(file){
                console.log(file)
                //this.dialogImageUrl
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            // 保存图片地址
            //保存到数组中
            handleSuccess(file){
                //console.log(file)
                //保存图片地址
                this.form.pictures.push({
                    pic:file.data.tmp_path
                })
                console.log(this.form.pictures)
            },
            // 删除图片
            //从数组中删除
            handleRemove(file){
                console.log(file)
                let picIndex = 0;
                this.form.pictures.some((item,index)=>{
                    if(file.response.data.tmp_path==item.pic){
                        picIndex = index
                        return true
                    }
                })
                // 删除指定图片
                this.form.pictures.splice(picIndex,1)
            },
            getRichTextContent () {
                  // 获取富文本内容
                  return this.$refs.editor.getUEContent()
            },

        },
        components:{
            MyEditor
        }
    }
</script>
<style scoped>
.el-steps{
    margin:40px 0;
}
.el-form{
    height: auto;
}
.footer{
    text-align: center;
}
</style>

