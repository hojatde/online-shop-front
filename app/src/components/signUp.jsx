import React,{Component} from 'react'
//import Joi from 'joi-browser'
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
        'string.required':'رمز عبور باید اشسیسشیمن را وارد کنید',
        'string.empty':'رمز عبور را وارد کنید',
        'string.min':'رمز عبور باید حداقل شامل 8 کارکتر باشد',
        'string.max':'رمز عبور میتواند حداکثر شامل 18 کارکتر باشد',
        'string.alphanum':'رمز عبور میتواند تنها شامل کارکتر های مجاز باشد'
    }),
    firstName:Joi.string().required().empty().pattern(/^[\u061f-\u06F0]+$/).min(3)
    .messages({
        'string.empty':'نام را وارد کنید',
        'string.min':'نام باید حداقل شامل 3 کارکتر باشد',
        'string.pattern.base':'نام تنها میتواند شامل حروف فارسی باشد.'
    }),
    lastName:Joi.string().required().pattern(/^[\u061f-\u06F0]+$/).empty().min(3)
    .messages({
        'string.empty':'نام را وارد کنید',
        'string.min':'نام باید حداقل شامل 3 کارکتر باشد',
        'string.pattern.base':'نام تنها میتواند شامل حروف فارسی باشد.'
    }),
    phoneNumber:Joi.string().required().pattern(/^[0-9]+$/).min(10).max(10)
    .messages({
        'string.empty':'شماره همراه را وارد کنید.',
        'string.min':'شماره تلفن تنها باید شامل 10 عدد باشد.',
        'string.max':'شماره تلفن همراه باید شامل 10 عدد باشد(لطفا 0 ابتدایی را وارد نکنید)',
        'string.pattern.base':'شماره همراه تنها میتواند شامل اعداد باشد'
    })
})

class SignUp extends Component{
    state={
        account:{
            username:'',
            password:'',
            firstName:'',
            lastName:'',
            phoneNumber:''
        },
        error:{
            path:'',
            message:''
        }
    }

    handelSubmit = (event)=>{
        event.preventDefault();
        fetch("http://localhost:8080/signUp",{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },body:JSON.stringify({
                username:this.state.account.username,
                password:this.state.account.password,
                firstName:this.state.account.firstName,
                lastName:this.state.account.lastName,
                phoneNumber:this.state.account.phoneNumber
            })
        })
            .then(res=>{
                return res.json()
            })
            .then(res=>{
                let error;
                if(res.status==='failed'){
                    error={
                        path:'failed',
                        message:res.message
                    };
                }else{
                    error={
                        path:'ok',
                        message:res.message
                    }
                    setTimeout(()=>{this.props.history.push("/login")},1000)
                }
                this.setState({error:error})
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
                <form className="col-6 signUp" onSubmit={this.handelSubmit}>
                    {this.state.error.path ==='failed' && <p className="inputError">{this.state.error.message}</p>}
                    {this.state.error.path ==='ok' && <p className="sucssesMessage">{this.state.error.message}</p>}
                    <label htmlFor="username">نام کاربری</label>
                    <input className="col-4" onChange={this.hanldeOnChange} type="text" autoComplete="off" name="username" id="username" />
                    {this.state.error.path==='username' ?(<p className="col-4 inputError">{this.state.error.message}</p>):(null)}
                    <label htmlFor="password">رمز عبور</label>
                    <input className="col-4" onChange={this.hanldeOnChange} type="text" autoComplete="off" name="password" id="password" />
                    {this.state.error.path==='password' ?(<p className="col-4 inputError">{this.state.error.message}</p>):(null)}
                    <label htmlFor="password">نام</label>
                    <input className="col-4" onChange={this.hanldeOnChange} type="text" autoComplete="off" name="firstName" id="firstName" />
                    {this.state.error.path==='firstName' ?(<p className="col-4 inputError">{this.state.error.message}</p>):(null)}
                    <label htmlFor="password">نام خانوادگی</label>
                    <input className="col-4" onChange={this.hanldeOnChange} type="text" autoComplete="off" name="lastName" id="lastName" />
                    {this.state.error.path==='lastName' ?(<p className="col-4 inputError">{this.state.error.message}</p>):(null)}
                    <label htmlFor="password">تلفن همراه</label>
                    <input className="col-4" onChange={this.hanldeOnChange} type="text" autoComplete="off" name="phoneNumber" id="phoneNumber" placeholder="+98" />
                    {this.state.error.path === 'phoneNumber' && <p className="inputError">{this.state.error.message}</p>}
                    <button type="submit" className="sucsess" disabled={buttonDisabled} >ثبت نام</button>
                </form>
            </div>
        )
    }
}

export default SignUp;