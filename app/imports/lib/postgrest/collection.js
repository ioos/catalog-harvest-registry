import { Meteor } from 'meteor/meteor';

export class RestCollection {
  constructor(apiURL, tableName) {
    this._api = apiURL;
    this._schema = null;
    this._tableName = tableName;
    this._collectionName = "__postgrest_" + tableName;
  }
  attachSchema(schema) {
    this._schema = schema;
  }
  register() {
  }
  create(doc, callback) {
  }
  read(docId, callback) {
    Meteor.call(this._collectionName + ".read", docId, callback);
  }
  update(doc, callback) {
    Meteor.call(this._collectionName + ".update", doc, callback);
  }
  delete(doc, callback) {
  }
}
