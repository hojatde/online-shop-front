const showAlert = (props)=>{
    console.log(props.alertType)
    const classAlert = 'showAlert ' + props.alertType
    return(
        <div className={classAlert}>
            <p>{props.message}</p>
        </div>
    )
}

export default showAlert;