import { SteedosFieldTypeConfig } from '../types'
import { Dictionary } from '@salesforce/ts-types';
import { getObjectConfig } from '../types'
import _ = require('lodash');
var util = require('../util');
var clone = require('clone');

const _lazyLoadFields: Dictionary<any> = {};

const addLazyLoadFields = function(objectName: string, json: SteedosFieldTypeConfig){
    if(!_lazyLoadFields[objectName]){
        _lazyLoadFields[objectName] = []
    }
    _lazyLoadFields[objectName].push(json)
}

const getLazyLoadFields = function(objectName: string){
    return _lazyLoadFields[objectName]
}

export const loadObjectLazyFields = function(objectName: string){
    let actions = getLazyLoadFields(objectName);
    _.each(actions, function(action){
        addObjectFieldConfig(objectName, clone(action));
    })
}

export const addObjectFieldConfig = (objectName: string, json: SteedosFieldTypeConfig) => {
    if (!json.name) {
        throw new Error('missing attribute name')
    }
    let object = getObjectConfig(objectName);
    if (object) {
        if(!object.fields){
            object.fields = {}
        }
        util.extend(object.fields, {[json.name]: json})
    } else {
        addLazyLoadFields(objectName, json);
    }
}

export const loadObjectFields = function (filePath: string){
    let fieldJsons = util.loadFields(filePath);
    fieldJsons.forEach(element => {
        addObjectFieldConfig(element.object_name, element);
    });
}