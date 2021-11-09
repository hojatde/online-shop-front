import React,{Component} from 'react';

class ProductSearch extends Component{
    state={};
    constructor(props){
        super();
        fetch("http://localhost:8080/serach/"+props.productTitile,{
            method:"GET",
        })
        .then(res=>{
            return res.json();
        })
        .then(res=>{
            console.log(res);
        })
        .catch(err=>console.log(err));
    }

    render(){
        return(
            <div>searchProduct</div>
        )
    }
}

export default ProductSearch;