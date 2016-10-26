var express=require("express");
var app=express();
var path=require("path");
var mongo=require("mongodb").MongoClient;
var mongoURL = 'mongodb://thangbk2209:thang2209@ds059516.mlab.com:59516/url-fcc-thangbk2209';
app.get("/",function(req,res){
       res.sendFile(path.join(__dirname,"view/index.html"));
})
app.get("/new/*",function(req,res){
    var or_link=req.url.slice(5);
    var host=req.headers.host;
    console.log(or_link);
    console.log("original: "+or_link);
    mongo.connect(mongoURL,function(err,db){
        if(err) throw err;
        var collect=db.collection("Url-shortener");
        var count=Math.floor(Math.random()*10000);
        var result={
            original_link:or_link,
            myId:count
        };
        collect.insert(result,function(err){
            if(err) throw err;
            var data={
                original_url:or_link,
                short_url: "https://"+host+"/"+result.myId
            }
            res.send(data);
            db.close();
        })
    })
})
app.get("/:val",function(req,res){
    var count=req.params.val;
    console.log(count);
    mongo.connect(mongoURL,function(err,db){
        if(err) throw err;
        var collect=db.collection("Url-shortener");
        collect.find(
            {
                myId: parseInt(count)
                
            }).toArray(function(err,docs){
            
            if(err) {
                console.log(err);
                res.end('error');
            }
            else {
                console.log('docs');
                console.log(docs);
                if (docs.length > 0){
                    res.redirect(docs[0].original_link);
                }
                else{
                    res.end('not found');
                }
            }
            
        });
        db.close();
    })
})
var port=process.env.PORT||8080;
app.listen(port,function(){
    console.log("listening on port: "+port);
})