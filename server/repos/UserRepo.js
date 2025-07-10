const BaseRepo = require('./BaseRepo');
const User = require('../models/user');

class UserRepo extends BaseRepo {
  constructor() {
    super(User);
  }
}

module.exports = UserRepo;