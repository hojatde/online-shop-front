import React,{Component} from 'react';
import jwtDecode from 'jwt-decode';
import Joi from 'joi';

const accountSchema = Joi.object({
    username:Joi.string().required().empty().alphanum().min(5)
    .messages({
        'string.empty':'نام کاربری را وارد کنید',
        'string.min':'نام کاربری باید حداقل شامل 5 کارکتر باشد',
        'string.alphanum':'نام کاربری میتواند تنها شامل کارکتر های مجاز باشد'
    }),
    password:Joi.string().required().alphanum().min(8).max(18)
    .messages({
        'string.required':'رمز عبور باید را وارد کنید',
        'string.empty':'رمز عبور را وارد کنید',
        'string.min':'رمز عبور باید حداقل شامل 8 کارکتر باشد',
        'string.max':'رمز عبور میتواند حداکثر شامل 18 کارکتر باشد',
        'string.alphanum':'رمز عبور میتواند تنها شامل کارکتر های مجاز باشد'
    })
})

class Login extends Component{
    state={
        account:{
            username:'',
            password:''
        },
        error:{
            path:'',
            message:''
        }
    };

    handelSubmit = (event)=>{
        event.preventDefault();
        fetch("http://localhost:8080/login",{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },body:JSON.stringify({
                username:this.state.account.username,
                password:this.state.account.password
            })
        })
            .then(res=>{
                localStorage.setItem('token',res.headers.get('x-auth-token'));
                return res.json()
            })
            .then(res=>{
                if(res.status==='sucsses'){
                    const tokenResult = jwtDecode(localStorage.getItem('token'));
                    if(tokenResult.isUser){
                        this.props.setUserInfo(res.accountName,false,true,true,null)
                    }else if(tokenResult.isAdmin){
                        this.props.setUserInfo(res.accountName,true,false,true,tokenResult.accessLevel)
                    }
                    localStorage.setItem('expiredIn',res.expiredIn)
                    this.props.history.replace('/')
                }else{
                    const newError = {
                        path:'server',
                        message:res.message
                    }
                    this.setState({error:newError})
                }
            })
            .catch(err=>console.log(err))

    }
    hanldeOnChange = (event)=>{
        const newAccount = this.state.account;
        newAccount[event.target.name] = event.target.value;
        const newError = this.state.error;

        const result = accountSchema.validate(this.state.account)
        if(result.error){
            newError.path = result.error.details[0].path[0];
            newError.message = result.error.details[0].message;
            this.setState({account:newAccount,error:newError})
        }else{
            this.setState({error:{path:'no',message:''}})
        }
        
    }

    render(){
        let buttonDisabled = this.state.error.path ==='no' ? false : true;
        return(
            <div className="row">
                <form className="column signUp" onSubmit={this.handelSubmit}>
                    {this.state.error.path === 'server' && <p className="inputError">{this.state.error.message}</p>}
                    <label htmlFor="username">نام کاربری</label>
                    <input autoFocus onChange={this.hanldeOnChange} type="text" autoComplete="on" name="username" id="username" />
                    {this.state.error.path==='username' ?(<p className="inputError">{this.state.error.message}</p>):(null)}
                    <label htmlFor="password">رمز عبور</label>
                    <input onChange={this.hanldeOnChange} type="text" autoComplete="on" name="password" id="password" />
                    {this.state.error.path === 'password' && <p className="inputError">{this.state.error.message}</p>}
                    <button type="submit" className="sucsess" disabled={buttonDisabled} >ورود</button>
                </form>
            </div>
        )
    }
}

export default Login;