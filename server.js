var express = require('express');
var app = express();
var mongoose = require("mongoose");

// "Model"

//mongoose.connect("mongodb://localhost/ensg-web-project");
mongoose.connect("mongodb://test:test@dharma.mongohq.com:10070/test-eng");

var Schema = mongoose.Schema;

var Shape = new Schema({
    type: String,
    geometry: Object
});

var ShapeModel = mongoose.model("Shape", Shape);

app.use(express.static(__dirname + '/assets'));
app.use(express.bodyParser());
app.use(app.router);

app.get('/', function(req, res){
  res.sendfile('index.html');
});


app.post("/shapes", function(req, res) {
    var shape = new ShapeModel(req.body);
    shape.save(function (err) {
    if (!err) {
        return console.log("Created!");
    } else {
        return console.log(err);
    }
  });
  return res.send(shape);
});

app.put("/shapes/:id", function(req, res) {
    return ShapeModel.findById(req.params.id, function (err, shape) {
        shape.geometry = req.body.geometry;
        return shape.save(function (err) {
            if (!err) {
                console.log("Updated!");
            } else {
                console.log(err);
            }
            return res.send(shape);
        });
    });
});

app.get("/shapes", function (req, res) {
    return ShapeModel.find(function (err, shapes) {
        if (!err) {
            return res.send(shapes);
        } else {
            return console.log(err);
        }
    });
});

app.get("/shapes/:id", function (req, res) {
    return ShapeModel.findById(req.params.id, function (err, shape) {
        if (!err) {
            return res.send(shape);
        } else {
            return console.log(err);
        }
    });
});

app.delete("/shapes/:id", function (req, res) {
    return ShapeModel.findById(req.params.id, function (err, shape) {
        return shape.remove(function (err) {
            if (!err) {
                console.log("Removed");
                return res.send("");
            } else {
                console.log(err);
            }
        });
    });
});

app.listen(3000);