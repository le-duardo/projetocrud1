const express=require('express');
const bodyParser=require('body-parser');
const mysql=require('mysql');
const handlebars=require('express-handlebars');
const app=express();


//configurando o body-parser
const urlencodeParser = bodyParser.urlencoded({extended: false});

//conectando com o banco de dados
const sql = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'123456',
    port:3306
});
sql.query("use teste2");


//configurando template
app.engine("handlebars",handlebars({defaultLayout:''}));
app.set('view engine', 'handlebars');

//configurando css,js,img 
app.use('/css',express.static('css'));
app.use('/js',express.static('js'));
app.use('/img',express.static('img'));

//rotas e templates
app.get("/", function(req,res){
    //res.send("Página inicial");
 //res.sendfile(__dirname +"/teste.html");
   res.render('inserir');
});


app.get("/inserir",function(req,res){
    res.render("inserir");
});

app.post("/controlleradd",urlencodeParser,function(req,res){
    //console.log(req.body.nome);
    sql.query("insert into outro values(?,?,?)", [req.body.id,req.body.nome,req.body.tipoa]);
    res.render("controlleradd",{nome:req.body.nome});
    //res.send("Cadastro com sucesso!!")
});
 
app.get("/select/:id?",function(req,res){
    if(!req.params.id){
        sql.query("select * from outro",function(erro,results,fields){
            res.render("select",{data:results});
        });  
    }  
});

app.get("/deletar/:id",function(req,res){
    sql.query("delete from outro where id=?",[req.params.id]);
    res.render("deletar");
});

app.get("/update/:id",function(req,res){
    sql.query("select * from usuario where id=?",[req.params.id], function(erro,results,fields){
        res.render("update",{id:req.params.id,nome:results[0].nome,tipoa:results[0].tipoa});
    });
});

app.post("/controllerupdate",urlencodeParser,function(req,res){
    sql.query("update usuario set id=?, nome=?,tipoa=? where id=?",[req.body.id,req.body.nome,req.body.tipoa,req.body.id]);
    res.render("controllerupdate");
});

//iniciando o servidor http
app.listen(3000, function(req,res){
    console.log('Servidor funcionando!!')
});