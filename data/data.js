var  Mock=require("mockjs")
module.exports=[{
    route: "/api/gulp",
    handle: function(req,res,next,url){
        var Random=Mock.Random
        Random.extend({
            constellation: function(date){
                var constellations=["白羊座","金牛座","双子座","巨蟹座","狮子座","摩羯座","天蝎座"]
                return this.pick(constellations)
            }
        })
        var datas=Random.constellation()
        var datas=Random.boolean()
        res.writeHead(200,{
            "Content-type":"application/json;charset=UTF-8",
            "Access-Control-Allow-Origin":"*"
        });
        res.write(JSON.stringify(datas));
        res.end()
    }
},{
    route: "/api/grr",
    handle: function(req,res,next,url){
        var datas = [
            {
                name:"真好"
            },
            {
                name:"真好啊"
            }
        ]
        res.writeHead(200,{
            "Content-type":"application/json;charset=UTF-8",
            "Access-Control-Allow-Origin":"*"
        });
        res.write(JSON.stringify(datas));
        res.end()
    }
}]