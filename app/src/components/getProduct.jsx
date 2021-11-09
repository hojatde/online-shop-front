import React,{Component} from 'react'
import Joi from 'joi';
// import validator from 'validator';

const commentSchema = Joi.object({
    alias:Joi.string().required().empty().pattern(/^[\u061f-\u06F9a-zA-Z0-9\s]+$/).min(6).messages({
        'string.empty':'نام را وارد کنید.',
        'string.pattern.base':'شما تنها مجاز به استفاده از کارکتر های  زبان فارسی-زبان لاتین به همراه اعداد هستید.',
        'string.min':'حداقل کارکتر'
    }),
    point:Joi.number().required().empty().integer().min(1).max(5).messages({
        'number.empty':'امتیاز را وارد کنید.',
        'number.min':'امتیاز باید در محدوده تعیین شده باشد.',
        'number.max':'امتیاز باید در محدوده تعیین شده باشد.',
        'number.integer':'امتیاز باید در محدوده تعیین شده باشد.'
    }),
    comment:Joi.string().required().empty().pattern(/^[\u061f-\u06F9a-zA-Z0-9.,;\s]+$/).messages({
        'string.empty':'متن نظر را وارد کنید.',
        'string.pattern.base':'شما تنها مجاز به استفاده از کارکتر های  زبان فارسی-زبان لاتین به همراه اعداد هستید.'
    })
})

class GetProduct extends Component{
    alias = React.createRef();
    point = React.createRef();
    comment = React.createRef();
    
    state={
        product:null,
        error:null
    }

    async componentDidMount(){
        const productId = this.props.match.params.id;
        const res = await fetch(`http://localhost:8080/product/${productId}`,{
            method:'GET'
        })
        const inputProduct = await res.json();
        this.setState({product:inputProduct})
    }

    handleSendComment = (event)=>{
        const ob={
            alias:this.alias.current.value,
            point:this.point.current.value,
            comment:this.comment.current.value
        }
        const newError = commentSchema.validate(ob)
        if(newError.error){
            console.log(newError)
            this.setState({error:{
                message:newError.error.details[0].message,
                type:'failed'
            }})
            setTimeout(()=>{
                this.setState({error:null})
            },3000)
        }
        else{
            fetch(`http://localhost:8080/product/${this.state.product._id}/sendComment`,{
                method:"POST",
                headers:{
                    'Content-Type':'application/json',
                    'Authorization':'Beare '+localStorage.getItem('token')
                },body:JSON.stringify({
                    alias:this.alias.current.value,
                    point:this.point.current.value,
                    comment:this.comment.current.value
                })
            })
            .then(res=>{
                return res.json();
            })
            .then(res=>{
                console.log(res);
                if(res.status==='sucsses'){
                    this.setState({error:{message:res.message}})
                }else{
                    this.setState({error:{message:res.message}})
                }
                console.log(this.state.error.message)
                setTimeout(()=>{this.setState({error:false});console.log(this.state.error.message)},3000)
                
            })
        }
    }

    render(){
        const status = this.state.product && this.state.product._id;
        return(
            <div className="row">
                {status ? (
                    <div className="cart column2">
                        <div className="cartTitle">
                            <h2>{this.state.product.title}</h2>
                            <h4>قیمت : {this.state.product.price} ﷼</h4>
                        </div>
                        <div className="imageDiv">
                            <img src={'http://localhost:8080/'+this.state.product.imageUrl} alt="." />
                        </div>
                        
                        <p>{this.state.product.description}</p>
                        <button className="sucsess" onClick={()=>{this.props.postAddProductToCart(this.state.product._id)}}>اضافه کردن به سبد خرید</button>
                        {this.props.isUser && <div className="col-12 sendComments">
                            {this.state.error && <p>{this.state.error.message}</p>}
                            <div className="col-4">
                                <label className="col-3" htmlFor="username">نام</label>
                                <input ref={this.alias} className="col-8" type="text" name="username" />
                            </div>
                            <div className="col-4">
                                <label className="col-3" htmlFor="score">امتیاز</label>
                                <input ref={this.point} type="range" name="score" id="score" min='1' max='5' />
                            </div>
                            
                            <textarea ref={this.comment} className="col-11" rows="4" type="text" name="commnet" id="comment"></textarea>
                            
                            <button onClick={this.handleSendComment}>ارسال نظر</button>
                        </div>}
                        <div className="userComments">
                        </div>
                    </div>
                ):(
                    <p></p>
                )}
            </div>
        )
    }
}

export default GetProduct;