const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

// const TestData = new Schema({
//     value: { type: Number, require: true},
//     TimeStamp: {type: String, maxLength: 255, require: true },
//     // Timestamp: {type: [Object], blackbox: true },
// });

// module.exports = mongoose.model('test', TestData);

const SIMData = new Schema({
        UL1:  { type: Number},
        UL2: { type: Number},
        UL3: { type: Number},
        IL1: { type: Number},
        IL2: { type: Number},
        IL3: { type: Number},
        P: { type: Number},
        Q: { type: Number},
        S: { type: Number},
        PF: { type: Number},
        Phi: { type: Number},
        F: { type: Number},
    // Timestamp: {type: [Object], blackbox: true },
},{timestamps: true,});

const TSTATData = new Schema({
    CM: { type: Number},
    MO: { type: Number},
    Tp: { type: Number},
    D: { type: Number},
    N: { type: Number},
// Timestamp: {type: [Object], blackbox: true },
},{timestamps: true,});

module.exports.SimData = mongoose.model('SimData', SIMData);
module.exports.TSTATData = mongoose.model('TSTATData', TSTATData);