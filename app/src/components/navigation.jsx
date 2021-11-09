import {NavLink} from 'react-router-dom'

const Nav = (props)=>{
    return(
        <div> 
            <div className="navigation">
            
                <ul>
                    <li><NavLink exact to="/">خانه</NavLink></li>
                    <li><NavLink to="/products"> محصولات</NavLink></li>   
                     
                    {props.isAdmin && <li><NavLink to="/addProduct">اضافه کردن محصول</NavLink></li>}
                    {props.isUser && <li><NavLink to="/cart"> سبد خرید </NavLink></li>}
                </ul>
                {props.isLogin ? (
                    <ul>
                        <li><h3 id="logOut" onClick={props.handleLogOut}>خروج</h3></li>
                    </ul>
                ):(
                    <ul>
                        <li><NavLink to="/signUp">ثبت نام </NavLink></li>
                        <li><NavLink to="/login">ورود </NavLink></li>
                    </ul>
                )}
                
            </div>
            {props.username && <p className="username">{props.username}</p>}
        </div>
    )
}

export default Nav;