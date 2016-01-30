var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3000;
var todoNextId = 1;
var todos = [];

app.use(bodyParser.json());


//Get /todos	
//Get /todos/:id

app.get('/todos', function (req, res) {
	res.json(todos);

});



app.get('/', function (req,res) {
	res.send ('Todo api root');


});

app.get('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId});
	
	if (matchedTodo) {
		res.json(matchedTodo);
	} else {
		res.status(404).send();
	}

});

//POST 

app.post('/todos', function (req, res) {
	var body = req.body;

	body = _.pick(body, 'description', 'complete')

	if (!_.isBoolean(body.complete) || !_.isString(body.description) || body.description.trim() === "") {
		return res.status(400).send()
	}

	body.description = body.description.trim();

	body["id"] = todoNextId++;

	todos.push(body);

	console.log('description: ' + body.description);

	res.json(body);

});

app.listen(PORT, function () {
	console.log('Express listening on port' + PORT + '!');
});
