import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Login from '@/components/Login'
import Welcome from '@/components/Welcome'
import User from '@/components/user/User'
import Right from '@/components/right/Right'
import Roles from '@/components/right/Roles'
import Goods from '@/components/goods/Goods'
import Category from '@/components/goods/Category'
import Params from '@/components/goods/Params'
import Goodlist from '@/components/goods/Goodlist'
import Edit from '@/components/goods/Edit'
import Add from '@/components/goods/Add'

Vue.use(Router)

const router =  new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path:'/',
      name:'home',
      component:Home,
      children:[
        {path:'/users',component:User},
        {path:'/rights',component:Right},
        {path:'/roles',component:Roles},
        {
          path:'/goods',
          component:Goods,
          redirect:'/goodslist',
          children:[
            {path:'/goodslist',component:Goodlist},
            {path:'/edit',name:'edit',component:Edit},
            {path:'/add',name:'add',component:Add}
          ]
        },
        {path:'/categories',component:Category},
        {path:'/params',component:Params}

      ]
    }
  ]
})
//全局导航过滤
//只有登录过后才能访问页面
//也就是只要有token以后才能继续访问页面
router.beforeEach((to, from, next) => {
  let token = localStorage.getItem('mytoken');
  if(token){
    //允许通过，向下一步跳转
    next()
    
  }else{
    //如果不是登录页面
    if(to.path!='/login'){
      //跳转到登录页面
      next({path:'/login'})
    }else{
      //如果是登录，直接跳转到登录页面
      next()
    }
  }
})
export default router;
