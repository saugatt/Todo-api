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
	var queryParams = req.query;
	var filteredTodos = todos;

	if (queryParams.hasOwnProperty('complete') && queryParams.complete === 'true') {
		filteredTodos = _where(filteredTodos, {complete: true});
	}else if (queryParams.hasOwnProperty('complete') && queryParams.complete === 'false') {
		filteredTodos = _where(filteredTodos, {complete:true});
	}	
	res.json(filteredTodos);


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

//DELETE /todos/:id

app.delete('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId});

	if (matchedTodo) {
		todos = _.without(todos, matchedTodo);
		res.json(matchedTodo);
	} else {
		res.status(404).json({"error": "no todo found"	});
	}

		

}
 );

app.put('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId});
	var body = _.pick(req.body, 'description', 'complete');
	var validAttributes = {};


	if (!matchedTodo) {
		return res.status(404).send(); 
	}

	if ( body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim() > "") {
		validAttributes.description = body.description;
	} else if (body.hasOwnProperty('description')) {
		return res.status(400).send(); 
	}

	if ( body.hasOwnProperty('complete') && _.isBoolean(body.complete)) {
		validAttributes.complete = body.complete;
	} else if (body.hasOwnProperty('complete')) {
		return res.status(400).send(); 
	}
	

	_.extend(matchedTodo, validAttributes);
	res.json(matchedTodo);

});

app.listen(PORT, function () {
	console.log('Express listening on port' + PORT + '!');
});
