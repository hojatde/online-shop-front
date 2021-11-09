import React,{Component} from 'react'
import {Redirect, Route,Switch} from 'react-router-dom';

import Nav from './components/navigation';
import Products from './components/products';
import Home from './components/Home';
import AddProduct from './components/addProduct';
import Cart from './components/cart';
import GetProduct from './components/getProduct';
import SignUp from './components/signUp';
import Login from './components/login';
import jwtDecode from 'jwt-decode';
import ProductSearch from './components/productSearch';
import SucssesPay from './components/sucsses';

import './App.css'

class App extends Component{
    state={
        accountName:null,
        isAdmin:false,
        isUser:false,
        isLogin:false,
        accessLevel:'',
        products:[],
        cart:{items:[]}
    }
    constructor(){
        super();
        if(localStorage.getItem('token')){
            if(localStorage.getItem('expiredIn') && localStorage.getItem('expiredIn')>(new Date().getTime())){
                //console.log((localStorage.getItem('expiredIn')-(new Date().getTime()))/1000)
                try{
                    const result = jwtDecode(localStorage.getItem('token'));
                    if(result.isUser){
                        this.state.isLogin=true;
                        this.state.isUser=true;
                    }else if(result.isAdmin){
                        this.state.accessLevel='3';
                        this.state.isLogin=true;
                        this.state.isAdmin=true;
                    }
                }catch{
                    localStorage.removeItem('token');
                    localStorage.removeItem('expiredIn')
                    console.log('token not validate!!!')
                }
            }else{
                localStorage.removeItem('token');
                localStorage.removeItem('expiredIn')
                console.log('expired')
            }
        }
        fetch("http://localhost:8080/getAll",{method:"GET"})
            .then(res=>{
                return res.json()
            }).then(res=>{
                //this.state.products = res.products;
                this.setState({products:res.products})
            })
        if(this.state.isLogin && this.state.isUser){
            fetch("http://localhost:8080/cart",{
                method:'GET',
                headers:{
                    'Authorization':'Beare '+localStorage.getItem('token')
                },
            })
                .then(res=>{
                    return res.json()
                })
                .then(res=>{
                    if(res.status==='sucsses'){
                        //this.state.cart.items = res.cart;
                        this.setState({cart:{items:res.cart}})
                    }else{
                        this.state.cart.items = [];
                    }
                })
        }
    }

    render(){
        //console.log(this.state.products)
        return (
            <div className="main">
                <Nav isLogin={this.state.isLogin} isUser={this.state.isUser} isAdmin={this.state.isAdmin} handleLogOut={this.logOut} />
                <div>
                    <Switch>
                        <Route path="/products" render={()=><Products isUser={this.state.isUser} productsList={this.state.products} onAdd={this.Add} handlerAddProductToCart={this.addProductToCart}/>} />
                        <Route path="/addProduct" render={()=>{
                            if(this.state.isAdmin && this.state.isLogin){return <AddProduct handlerAddProduct={this.addProduct} />}
                            else{return <Redirect to="/login" />}
                        }} />
                        <Route path="/cart" render={()=>{
                            if(this.state.isUser && this.state.isLogin){
                                return <Cart postOrder={this.postOrder} postProductReduce={this.postProductReduce} deleteItemFromCart={this.deleteItemFromCart} increaseCount={this.addProductToCart} cartItems={this.state.cart.items} />
                            }else{return <Redirect to="/login" />}
                        }} />
                        <Route path="/product/:id" render={(props)=><GetProduct isUser={this.state.isUser && this.state.isLogin} {...props} postAddProductToCart={this.addProductToCart} />} />
                        <Route path="/signUp" render={(props)=>{
                            if(this.state.isUser && this.state.isLogin){
                                return <Redirect to="/" />
                            }else{return <SignUp history={props.history} />}
                        }} />
                        <Route path="/login" render={(props)=>{
                            if(!this.state.isLogin){
                                return <Login history={props.history} setUserInfo={this.setUserInfo} />
                            }else{return <Redirect to="/" />}
                        }} />

                        <Route path={'/search/:id'} component={ProductSearch} />
                        <Route path={'/sucssesPay'} component={SucssesPay} />
                        <Route path="/" exact component={Home} /> 
                    </Switch>
                </div>
            </div>
        )
    }
    getCart=()=>{
        if(this.state.isLogin && this.state.isUser){
            fetch("http://localhost:8080/cart",{
                method:'GET',
                headers:{
                    'Authorization':'Beare '+localStorage.getItem('token')
                },
            })
                .then(res=>{
                    return res.json()
                })
                .then(res=>{
                    if(res.status==='sucsses'){
                        this.setState({cart:{items:res.cart}})
                    }else{
                        console.log(res.status)
                        console.log(res.message)
                        this.logOut();
                    }
                    
                })    
        }
    }

    Add=(ob)=>{
        this.setState({products:this.state.products.map(product=>{
            if(product.title === ob.title){
                ob.price = ob.price + 10;
                return ob;
            }else return product;
        })})
    }

    addProduct = (product)=>{
        this.setState = ({products:this.state.products.push(product)})
    }

    addProductToCart = productId =>{
        fetch("http://localhost:8080/addProductToCart",{
            method:"POST",
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Beare '+localStorage.getItem('token')
            },
            body:JSON.stringify({productId:productId})
        })
            .then(res=>{
                return res.json();
            })
            .then(res=>{
                if(res.status==='sucsses'){
                    this.getCart();
                    console.log(res.message)
                }else{
                    console.log(res.status)
                    console.log(res.message)
                    this.logOut();
                }
            })
    }

    deleteItemFromCart = (productId)=>{
        //console.log(this.state.cart)
        fetch("http://localhost:8080/deleteItemFromCart",{
            method:"POST",
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Beare '+localStorage.getItem('token')
            },
            body:JSON.stringify({productId:productId})
        })
            .then(res=>{
                return res.json();
            })
            .then(res=>{
                if(res.status==='sucsses'){
                    this.getCart();
                    console.log(res.message)
                }else{
                    console.log(res.status)
                    console.log(res.message)
                    this.logOut();
                }
            })
    }
    postProductReduce = (productId)=>{
        fetch("http://localhost:8080/postProductReduce",{
            method:"POST",
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Beare '+localStorage.getItem('token')
            },
            body:JSON.stringify({productId:productId})
        })
            .then(res=>{
                return res.json();
            })
            .then(res=>{
                if(res.status==='sucsses'){
                    this.getCart();
                    console.log(res.message)
                }else{
                    console.log(res.status)
                    console.log(res.message)
                    this.logOut();
                }
            })
    }

    getProductInformation = (productId)=>{
        fetch("http://localhost:8080/postProductReduce",{
            method:"GET",
            body:JSON.stringify({productId:productId})
        })
    }

    setUserInfo = (accountname,isAdmin,isUser,isLogin,accessLevel)=>{
        if(isLogin && isUser){
            this.setState({username:accountname,isLogin:true,isUser:true});
            this.getCart();
        }else if(isAdmin && isLogin){
            this.setState({username:accountname,isLogin:true,isAdmin:true,isUser:false,accessLevel:'3'})
        }
    }

    postOrder = ()=>{
        fetch("http://localhost:8080/storeOrder",{
            method:"POST",
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Beare '+localStorage.getItem('token')
            }
        }).then(res=>{return res.json()})
        .then(res=>{
            if(res.status==='sucsses'){
                this.getCart();
                window.location.replace('/sucssesPay')
            }
        })
    }

    logOut = ()=>{
        this.setState({isLogin:false,isAdmin:false,isUser:false,accessLevel:null});
        localStorage.removeItem('token')
    }
}

export default App;