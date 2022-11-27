const express = require('express');
const app = express();
const bodyParser= require('body-parser')
app.use(bodyParser.urlencoded({extended: true, useUnifiedTopology: true})) ;
var db;
const MongoClient = require('mongodb').MongoClient;
MongoClient.connect('mongodb+srv://admin:qwer1234@cluster0.dpyohs6.mongodb.net/?retryWrites=true&w=majority', function(error, client){
    if(error){return console.log(error)}
     
    db = client.db('todoapp');

    app.listen(8080, (req, res) => {
        console.log('listening on 8080');
    });
})
app.set('view engine', 'ejs');


app.get('/pet', (req, res) => {
    res.send('펫 용품 쇼핑을 할 수 있는 사이트 입니다.');
});

app.get('/', (req, res) => {
   res.sendFile(__dirname+'/index.html')
});

app.get('/write', (req, res) => {
    res.sendFile(__dirname+'/write.html')
 });
 
app.post('/add', (req, res)=>{
    res.send('전송완료');
    db.collection('counter').findOne({name : ' 게시물갯수'}, (error, result) => {
        console.log(result.totalPost);
        var 총게시물갯수 = result.totalPost;
        db.collection('post').insertOne({_id : 총게시물갯수+1 , 제목 : req.body.title, 날짜 : req.body.date} , function(error, result){
            console.log('저장완료');
            db.collection('counter').updateOne({name : '게시물갯수'}, {$inc : {totalPost:1}}, (error, result)=>{
                if(error) {return console.log(error)}
                res.send('전송완료');
            });
        });
    });

    
    
});

app.get('/list', (req, res)=>{
    // db에 저장된 post라는 collection의 모든 데이터 꺼내기
    db.collection('post').find().toArray((error, result)=>{
        console.log(result);
        res.render('list.ejs', {posts: result});
    });
});

app.delete('/delete', function(req, res){
    console.log(req.body);
    req.body._id = parseInt(req.body._id)
    db.collection('post').deleteOne(req.body, function(error, result){
        console.log('삭제완료');
        res.status(200).send({message : '성공했습니다.'});
    });
});

app.get('/detail/:id', (req,res)=>{
    db.collection('post').findOne({_id : parseInt(req.params.id)}, function(error, result) {
        console.log(result);
        res.render('detail.ejs', {data : result})
    })
    
})
