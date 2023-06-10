const mongoose = require('mongoose');

const shortUrlSeqSchema = new mongoose.Schema({
    seq: {
        type: Number,
        unique: true,
        required: true,
    }
});

const ShortUrlSeq = mongoose.model('ShortUrlSeq', shortUrlSeqSchema);

const shortUrlSchema = new mongoose.Schema({
    shortUrl: { //set by the pre save middleware
        type: String,
        unique: true,
    },
    originalUrl: {
        type: String,
        required: true,
    }
});

shortUrlSchema.pre('save', async function() {
    await ShortUrlSeq.find().then(async docs => {
        // start sequence
        let seq;
        if (docs.length === 0) {
            seq = 1;
            const shortUrlSeq = new ShortUrlSeq({ seq });
            await shortUrlSeq.save();
        } else {
            const shortUrlSeq = docs[0];
            seq = shortUrlSeq.seq + 1;
            shortUrlSeq.seq = seq;
            await shortUrlSeq.save();
        }

        this.shortUrl = String(seq);
    });
});

const ShortUrl = mongoose.model('ShortUrl', shortUrlSchema);

module.exports = ShortUrl;
