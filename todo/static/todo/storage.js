
var EventEmitter = require('events').EventEmitter;
var assert = require('assert');
var util = require('./util.js');

storage = new EventEmitter();

window.storage = storage;

