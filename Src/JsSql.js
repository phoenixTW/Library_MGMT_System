
var throwErrorIfParamsNotPresent = function(checkValue,errorMessage){
	if(!checkValue)
		throw new Error(errorMessage);
}

var makeSelectFieldsAlias = function(asFields){
	this.query = this.selectFields.reduce(function(query,field,index){
		throwErrorIfParamsNotPresent(asFields[index],"Some alias fields missing");
		return query += field + " AS " + asFields[index] + ", ";
	},"SELECT ");
	this.query = this.query.slice(0,this.query.length-2);
}
var select = function(selectFields){
	if(!selectFields){this.query = "SELECT *";return;}
	this.query = "SELECT " + selectFields;
	this.selectFields = selectFields;
	this.as = makeSelectFieldsAlias;
	return this;
}

var from = function(tableName){
	throwErrorIfParamsNotPresent("Table name is missing");
	this.query += " FROM " + tableName;
}

var connectConditionsWithConnectors = function(whereConnectors){
	if(this.conditions.length != whereConnectors.length+1)
		throw new Error("Some connectors are missing");
	this.query = this.conditions.reduce(function(query,condition,index){
		var connector = whereConnectors[index];
		return query.replace("#CONN#", connector);
	},this.query);
}

var where = function(conditions){
	if(conditions.length > 1)
		this.query += " WHERE " + conditions.join(" #CONN# ");
	else this.query += " WHERE " + conditions;
	this.conditions = conditions;
	this.connectors = connectConditionsWithConnectors;
	return this;
}


var someFields = function(fields){
	throwErrorIfParamsNotPresent(fields,"Some fields are Missing");
	fields = fields.map(function(field){
		return "'" + field + "'";
	});
	this.query += "(" + fields + ")";
}
var insertInto = function(tableName){
	throwErrorIfParamsNotPresent(tableName, "Table name is missing");
	this.query = "INSERT INTO " + tableName;
	this.someFields = someFields;
	return this;
}
var values = function(insertValues){
	throwErrorIfParamsNotPresent(insertValues, "Insert Values are Missing")
	insertValues = insertValues.map(function(value){
		return "'" + value + "'";
	});
	this.query += " VALUES(" + insertValues + ")";
}

var update = function(tableName){
	throwErrorIfParamsNotPresent(tableName, "Table Name Missing");
	this.query = "UPDATE " + tableName;
}
var updateSetValues = function(values){
	this.query = values.reduce(function(query,value){
		value = "'" + value + "'";
		return query = query.replace("#VAL#","="+value+",");
	},this.query);
	this.query = this.query.slice(0,this.query.length-1);
}
var set = function(fields){
	this.query += " SET " + fields.join("#VAL#") + "#VAL#";
	this.values = updateSetValues;
	return this;
}

var ready = function(db,method,callback){
	// this.dbMethod = db[method]
	// if(typeof callback == 'function')this.callback = callback;
	// else this.callback = function(err){
	// 	if(err) throw err;
	// 	else callback.fire();
	// }
	this.db = db;
	this.method = method;
	this. callback = callback; 
}
var fire = function(){
	// this.dbMethod(this.query,this.callback);
	return this.db[this.method](this.query,this.callback);
}

var JsSql = function(){
	this.query = "";
}
exports.JsSql = JsSql;

JsSql.prototype = {
	select: select,
	from: from,
	where: where,
	insertInto: insertInto,
	values: values,
	update: update,
	set: set,
	ready: ready,
	fire: fire
}