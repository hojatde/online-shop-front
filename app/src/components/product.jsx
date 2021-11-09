import React from 'react';
import {Link} from 'react-router-dom'

const Product = (props)=>{
    //const productPath = `/product/${props.info._id}`;
    //{{pathname:`/product/${props.info._id}`}}
    return(
        <div className="product column">
            <input type="hidden" name="id" value={props.info._id}/>
            {props.info.imageUrl && <img src={'http://localhost:8080/'+props.info.imageUrl} alt=""></img>}
            <h3>{props.info.title}</h3>
            <h4>{props.info.price} ﷼</h4>
            <Link to={{pathname:`/product/${props.info._id}`}} >اطلاعت بیشتر ...</Link>
            {props.isUser && <button className="sucsess" onClick={props.addProductToCart}>اضافه کردن به سبد خرید</button>}
        </div>
    )
}

export default Product;