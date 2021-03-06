import React,{Component} from "react";
import Product from "./product";

class Products extends Component{
    searchField = React.createRef();
    state={products:[],change:false};
    constructor(props){
        super();
        this.state.products = props.productsList;
    }
    componentDidUpdate(prevProps,prevState){
        if(prevProps.productsList.length===0){
            this.setState({products:this.props.productsList})
        }
    }

    handleProductSearch =()=>{
        if(this.searchField.current.value !== ''){
            fetch("http://localhost:8080/search/"+this.searchField.current.value,{
                method:"GET",
            })
            .then(res=>{
                return res.json();
            })
            .then(res=>{
                this.setState({products:res.products})
            })
            .catch(err=>console.log(err));
        }else{
            this.setState({products:this.props.productsList});
        }
    }

    handleSort = (event)=>{
        if(event.target.value==='price'){
            const newList = this.state.products;
            newList.sort((a,b)=>parseFloat(a.price) - parseFloat(b.price))
            this.setState({products:newList});
        }else if(event.target.value==='title'){
            const newList = this.state.products;
            //newList.sort((a,b)=>{return (a.title) - (b.title)})
            newList.sort((a,b) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0))
            this.setState({products:newList});
        }else if(event.target.value ==='sell'){
            const newList = this.state.products;
            //newList.sort((a,b)=>{return (a.salesNumber) - (b.salesNumber)})
            newList.sort((a,b) => (a.salesNumber < b.salesNumber) ? 1 : ((b.salesNumber < a.salesNumber) ? -1 : 0))
            this.setState({products:newList});
        }
        else if(event.target.value ==='date'){
            const newList = this.state.products;
            //newList.sort((a,b)=>{return (a.createdAt) - (b.createdAt)})
            newList.sort((a,b) => (a.createdAt > b.createdAt) ? 1 : ((b.createdAt > a.createdAt) ? -1 : 0))
            this.setState({products:newList});
        }else if(event.target.value ==='score'){
            const newList = this.state.products;
            //newList.sort((a,b)=>{return (a.createdAt) - (b.createdAt)})
            newList.sort((a,b) => (a.score > b.score) ? 1 : ((b.score > a.score) ? -1 : 0))
            this.setState({products:newList});
        }
    }

    render(){
        // console.log(18)
        // console.log(this.state.products)
        const productFind = this.state.products.length>0 ? true : false;
        //console.log(this.props.productsList)
        return(
            <div className="products row">
                <div className="col-12 productsNav">
                    <div className="col-4 sortBy">
                        <label htmlFor="sortBy">???????? ???????? ???? ??????????</label>
                        <select onChange={this.handleSort}>
                            <option value="title">??????????</option>
                            <option value="price">????????</option>
                            <option value="sell">????????</option>
                            <option value="date">????????????????</option>
                            <option value="score">?????????? ????????</option>
                        </select>
                    </div>
                    <div className="col-4">
                        <h2>??????????????</h2>
                    </div>
                    <div className="col-4">
                        <div className="search">  
                            <input ref={this.searchField} type="text" placeholder="?????????? ????????" name="search" id="search" />
                            <button onClick={this.handleProductSearch}>??????????</button>
                        </div>
                    </div>
                </div>
                {!productFind && <p>???????????? ???????? ??????</p>}
                {this.state.products.map(product=>{
                    return <Product key={product._id} isUser={this.props.isUser} info={product} onAdd={()=>{this.props.onAdd(product)}} 
                    addProductToCart={()=>{this.props.handlerAddProductToCart(product._id)}}/>
                })}
            </div>
               
            
        )
    }
}

export default Products;