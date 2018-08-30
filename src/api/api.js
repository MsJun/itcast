import axios from 'axios'
//axios.defaults.baseURL = 'http://47.96.21.88:8888/api/private/v1/';
axios.defaults.baseURL = 'http://localhost:8080/api/private/v1/'
//每次渲染页面都是需要token，所以采用axios加载器
axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  let token = localStorage.getItem('mytoken')
  if(token){
    //将token添加到请求头中
    config.headers['Authorization'] = token
  }
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});
//登录
export const login = (params)=>{
  return axios.post('login',params)
  .then(res=>{
    return res.data;

  })
}
//用户列表
export const getuserlist = (params)=>{
  return axios.get('users',{params:params})
  .then(res=>{
    return res.data
  })
}
//更改用户状态
export const toggleuserType = (params=>{
  return axios.put('users/'+params.uId+'/state/'+params.type)
  .then(res=>{
    return res.data
  })
})
// 添加用户
export const addUser = (params=>{
  return axios.post('users',params)
  .then(res=>{
    return res.data
  })
})
//根据id返回当前用户信息
export const getActId = (params=>{
  return axios.get('users/'+params.id)
  .then(res=>{
    return res.data
  })
})
// 提交用户修改的信息
export const modifyUser = (params=>{
  return axios.put('users/'+params.id,params)
  .then(res=>{
    return res.data
  })
})
//删除用户
export const delUser = (params=>{
  return axios.delete('users/'+params.id)
  .then(res=>{
    return res.data
  })
})
// 获取角色
export const roulesList = ()=>{
  return axios.get('roles')
  .then(res=>{
    return res.data
  })
}
//
export const giveRole = (params=>{
  return axios.put('users/'+params.id+'/role',params)
  .then(res=>{
    return res.data
  })
})
// --------权限管理----------------
//权限列表
export const getRight = (params=>{
  return axios.get('rights/' + params.type)
  .then(res=>{
    return res.data
  })
})
// 角色列表
export const rolesList = ()=>{
  return axios.get('roles')
  .then(res=>{
    return res.data
  })
}
// 添加角色
export const addRoles = (params=>{
  return axios.post('roles',params)
  .then(res=>{
    return res.data
  })
})
// 根据id返回当前角色信息
export const getRoleById = (params=>{
  return axios.get('roles/'+params.id)
  .then(res=>{
    return res.data
  })
})
// 提交修改的角色
export const editRole = (params=>{
  return axios.put('roles/'+params.id,params)
  .then(res=>{
    return res.data
  })
})
// 删除角色
export const deleRole = (id=>{
  return axios.delete('roles/'+id)
  .then(res=>{
    return res.data
  })
})
// 删除某个权限
export const deleteRight = (params=>{
  return axios.delete('roles/'+params.roleId+'/rights/'+params.rightId)
  .then(res=>{
    return res.data
  })
})
// 提交角色权限
export const submitGrant = (params)=>{
  return axios.post('roles/'+params.roleId+'/rights',params)
  .then(res=>{
    return res.data
  })
}
// 左侧菜单权限
export const aside = ()=>{
  return axios.get('menus').then((res=>{
    return res.data
  }))
}
// ----------商品管理------------
// 商品分类
export const getCategory = (params=>{
  return axios.get('categories',{params:params})
  .then(res=>{
    return res.data
  })
})
// 添加分类
export const addCat = (params=>{
  return axios.post('categories',params)
  .then(res=>{
    return res.data
  })
})
// 根据id返回相应名称
export const edit = (params=>{
  return axios.get('categories/'+params.id)
  .then(res=>{
    return res.data
  })
})
//编辑提交
export const editCate = (params) => {
  return axios.put('categories/' + params.cat_pid, params).then(res => {
    return res.data
  })
}
// 删除分类
export const deleteCate = (params=>{
  return axios.delete('categories/'+params.id)
  .then(res=>{
    return res.data
  })
})
// 分类参数
export const getParams = (params) => {
  return axios.get('categories/' + params.id + '/attributes', {params: params}).then(res => {
    return res.data
  })
}
// 获取商品列表
export const getgoodlist = (params=>{
  return axios.get('goods',{params:params})
  .then(res=>{
    return res.data
  })
})
//  添加商品
export const addProduct  = (params=>{
  return axios.post('goods',params)
  .then(res=>{
    return res.data
  })
})
