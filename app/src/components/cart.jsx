import React,{Component} from 'react'

class Cart extends Component{
    state={}
    render(){
        //const itemsLength = this.props.cartItems.length > 0 ? 1:0;
        let sum=0;
        // for(let i=0;i<itemsLength;i++){
        //     sum = sum + this.props.cartItems[i].price*this.props.cartItems[i].quantity
        // }
        if(this.props.cartItems){
            this.props.cartItems.forEach(item=>{
                //console.log(typeof(sum))
                sum = sum + (item.price * item.quantity)
            })
        }else{
            sum = 0;
        }
        const cartHaveItem = this.props.cartItems.length>0?true:false;
        //console.log("sum is " + sum)
        return(
            <div>
                {cartHaveItem?(
                    <div className="cart row">
                        <table className="cartTable col-10">
                            <tbody>
                                <tr>
                                    <th>عنوان</th>
                                    <th>تعداد</th>
                                    <th>قیمت واحد</th>
                                    <th>قیمت کل</th>
                                    <th></th>
                                    <th>+</th>
                                    <th>-</th>
                                    <th>حذف از سبد خرید</th>
                                </tr>
                                {this.props.cartItems.map(item=>{
                                    return(
                                        <tr key={item._id}>
                                            <td>{item.title}</td>
                                            <td>{item.quantity}</td>
                                            <td>{item.price}</td>
                                            <td>{item.price * item.quantity}</td>
                                            <td ></td>
                                            <td><button onClick={()=>{this.props.increaseCount(item._id)}}>+</button></td>
                                            <td><button onClick={()=>{this.props.postProductReduce(item._id)}}>-</button></td>
                                            <td><button onClick={()=>{this.props.deleteItemFromCart(item._id)}}>حذف از سبد خرید</button></td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                        <table className="cartTable col-3">
                            <tbody>
                                <tr>
                                    <td>قیمت کل</td>
                                </tr>
                                <tr>
                                    <td>{sum}  ﷼</td>
                                </tr>
                            </tbody>
                        </table>
                        {this.props.cartItems.length>0 && <div className="col-12"><button id="pay" onClick={this.props.postOrder}>ثبت سفارش</button></div>}
                    </div>
                    ):(
                    <div className="row"><p className="col-12 cartBox">محصولی در سبد خرید قرار ندارد.</p></div>
                    )
                }
            </div>
        )
    }
}

export default Cart;