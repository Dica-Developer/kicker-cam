var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var FoosballGameRoundSchema = new Schema({
  nr: Number,
  game: {type: Schema.Types.ObjectId, ref: 'FoosballGame', index: true}, //TODO do we need this reference?
  red_offense: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  red_defense: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  blue_offense: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  blue_defense: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  red_score: {type: Number, default: 0},
  blue_score: {type: Number, default: 0}
});

/**
 * Virtuals
 */
FoosballGameRoundSchema
  .virtual('normalized')
  .get(function() {
    var options = [
      {path: 'red_offense', select: 'name'},
      {path: 'red_defense', select: 'name'},
      {path: 'blue_offense', select: 'name'},
      {path: 'blue_defense', select: 'name'}
    ];
    return this
      .constructor
      .findById(this._id)
      .populate(options)
      .exec();
  });

/**
 * Validations
 */

// Validate red_offense
FoosballGameRoundSchema
  .path('red_offense')
  .validate(function(red_offense) {
    return red_offense !== this.red_defense && red_offense !== this.blue_offense && red_offense !== this.blue_defense;
  }, 'Player can not play two or more positions.');

// Validate red_defense
FoosballGameRoundSchema
  .path('red_defense')
  .validate(function(red_defense) {
    return red_defense !== this.red_offense && red_defense !== this.blue_offense && red_defense !== this.blue_defense;
  }, 'Player can not play two or more positions.');

// Validate blue_offense
FoosballGameRoundSchema
  .path('blue_offense')
  .validate(function(blue_offense) {
    return blue_offense !== this.red_offense && blue_offense !== this.red_defense && blue_offense !== this.blue_defense;
  }, 'Player can not play two or more positions.');

// Validate blue_defense
FoosballGameRoundSchema
  .path('blue_defense')
  .validate(function(blue_defense) {
    return blue_defense !== this.red_offense && blue_defense !== this.red_offense && blue_defense !== this.blue_offense;
  }, 'Player can not play two or more positions.');


/**
 * Methods
 */
FoosballGameRoundSchema.methods = {
  updateScore: function(score, cb){

    this.red_score = score.red;
    this.blue_score = score.blue;

    this.save(function(error){
      cb(error);
    });
  }
};

module.exports = mongoose.model('FoosballGameRound', FoosballGameRoundSchema);
