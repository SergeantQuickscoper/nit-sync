class authControllers{
    helloWorld(req, res){
        res.send("Hello World!")
    }

    signup(req, res){
        
    }
}

const authControllerObj = new authControllers()

export default authControllerObj;