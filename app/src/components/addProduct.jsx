import React,{Component} from 'react';
import ShowAlert from './showAlert';

class AddProduct extends Component{
    state={
        message:null,
        alertType:null
    }

    title = React.createRef();
    price = React.createRef();
    description = React.createRef();
    image = React.createRef();

    handlerSubmit = e =>{
        e.preventDefault();
        const title=this.title.current.value;
        const price = this.price.current.value;
        const description = this.description.current.value;
        const image = this.image.current.files[0];
        const formData = new FormData();
        formData.append('title',title);
        formData.append('price',price);
        formData.append('description',description);
        formData.append('image',image)

        fetch("http://localhost:8080/admin/addProduct",{
            method:"POST",
            headers:{
                'Authorization':'Beare '+localStorage.getItem('token')
            },
            body:formData
        })
            .then(res=>{
                return res.json();
            })
            .then(res=>{
                if(res.status === 'sucssesfull'){
                    console.log(res.message)
                }else{
                    if(res.status==='unValidToken'){
                        localStorage.removeItem('token');
                    }
                }
                this.setState({message:res.message,alertType:res.status})
                setTimeout(()=>{this.setState({message:null,alertType:null})},3000);
            })
            .catch(err=>{
                console.log(err);
            })
    }


    render(){
        return(
            <div className="AddProduct">
                {this.state.message && <ShowAlert message={this.state.message} alertType={this.state.alertType} />}
                <form onSubmit={this.handlerSubmit}>
                    <label htmlFor="title">عنوان</label>
                    <input ref={this.title} type="text" name="title" />
                    <label htmlFor="title">قیمت</label>
                    <input ref={this.price} type="text" name="price" />
                    <label htmlFor="imageUrl">تصویر</label>
                    <input ref={this.image} type="file" name="image" />
                    <label htmlFor="title">توضیحات</label>
                    <textarea ref={this.description} type="text" name="description" rows="4" cols="50" />
                    <button type="submit" className="sucsess">اضافه کردن</button>
                </form>
            </div>
        )
    }
    

}

// const AddProduct = (props)=>{
    
//     return(
        // <div>
        //     <form onSubmit={this.handlerSubmit}>
        //         <label htmlFor="title">title</label>
        //         <input type="text" name="title">Title</input>
        //         <label htmlFor="title">price</label>
        //         <input type="text" name="price">Price</input>
        //         <label htmlFor="title">description</label>
        //         <input type="text" name="description">Description</input>
        //         <button type="submit">send</button>
        //     </form>
        // </div>
//     )
// }

export default AddProduct;