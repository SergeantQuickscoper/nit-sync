class authControllers{
    helloWorld(req, res){
        res.send("Hello World!")
    }
}

const authControllerObj = new authControllers()

export default authControllerObj;