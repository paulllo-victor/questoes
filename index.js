const express = require("express");
const bodyParser = require("body-parser")
const app = express();
const connection = require("./database/database")
const Pergunta = require("./database/Question")
const Resposta = require("./database/Answer");
const Answer = require("./database/Answer");

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

app.get("/pergunta/:id",(req,res)=>{
    var id = req.params.id
    Pergunta.findOne({
        where:{id}
    }).then(pergunta => {
        if(pergunta != undefined){
            res.render("question",{
                pergunta
            })
        }else{
            res.redirect("/")
        }
    })
})

app.post("/responder",(req,res)=>{
    var body = req.body.body
    var questionId = req.body.questionId

    Answer.create({
        body,
        questionId
    }).then(()=>{
        res.redirect("/pergunta/"+questionId)
    })
})
app.listen(4002,() => {
    console.log("iniciado");
})