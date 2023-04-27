const express = require("express");
const bodyParser = require("body-parser")
const app = express();
const connection = require("./database/database")
const Pergunta = require("./database/Question")

connection
    .authenticate()
    .then(() => {
        console.log("okgggg");
    })
    .catch((msgErro) => {
        console.log(msgErro);
    })

app.set("view engine","ejs")
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get("/",function(req,res){
    // RAW = CRU
    Pergunta.findAll({raw:true,order:[
        ['id','DESC']
    ]}).then(perguntas =>{
        console.log(perguntas);
        res.render("index", {
            perguntas
        })
    });
});
app.get("/perguntar",(req,res)=>{
    res.render("ask")
})
app.post("/save",(req,res)=>{
    var title = req.body.title;
    var description = req.body.description;
    Pergunta.create({
        title ,
        description
    }).then(()=>{
        res.redirect("/");
    });
})
app.listen(4002,() => {
    console.log("iniciado");
})