/*
 * GET home page.
 */

exports.index = function(req, res){
  var fs = require("fs");
  function getAllFiles(root) {
    var result = [], files = fs.readdirSync(root)
    files.forEach(function(file) {
      var pathname = root+ "/" + file
        , stat = fs.lstatSync(pathname)
      if (stat === undefined) return
   
      // 不是文件夹就是文件
      if (!stat.isDirectory()) {
        var filename = nameTrim(file);
        var fileData = { type:"file", title:filename, path:"posts/" + pathname.replace(/^views\//g,"") }
        result.push(fileData)
      // 递归自身
      } else {
        var filesData = {
          type:"dir",
          title:file,
          files:getAllFiles(pathname)
        }
        result.push(filesData);
      }
    });
    return result
  }
  var posts = getAllFiles("views/w3c");
  res.render('index', { title: '目录索引', noBack: true, posts: JSON.stringify(posts), layout:"layout"});
};

exports.posts = function(req, res){
  var arr = req.params[0].split("/");
  var title = arr[arr.length-1];
  var filename = nameTrim(title);
  res.render(req.params[0], { title: filename, noBack: false, layout:"layout" });
}

function nameTrim(name){
  var namearr = name.split(".");
  if(namearr.length > 1){
    namearr.pop();
    var filename = namearr.join(".");
  }else {
    filename = name;
  }
  return filename;
}