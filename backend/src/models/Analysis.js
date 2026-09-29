import mongoose from 'mongoose'


const issueSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        severity: { type: String, enum: ['low', "midium", "high"], default: "midium" },
        explanation: String,
        fix: String,
    },{ _id: false}
)

const strengthSchema= new mongoose.Schema(
    {
        title: {type: String, required: true},
        evidence: String,
    },
    {_id: false}
)

const bulletRewriteSchema=new mongoose.Schema(
    {
        section: String,
        original: {type: String, required: true},
        rewritten: {type:String, required: true},
        rationale: String,
    },{_id: true}
)

const scoreBreakDownSchema=new mongoose.Schema(
    {
        keywords: {type: Number, min: 0, max: 25},
        formatting: {type: Number, min: 0, max: 25},
        impact: {type: Number, min: 0, max: 25},
        clarity: {type: Number, min: 0, max: 25},
    },{_id: false},
)

const analysisSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        resumeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Resume',
            required: true,
            index: true,
        },
        versionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ResumeVersion',
            required: true,
            index: true,
        },
        atsScore: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
        },
        scoreBreakdown: scoreBreakDownSchema,
        issues: {type: [issueSchema], default: []},
        strengths: {type:[strengthSchema], default: []},
        bulletRewrites: {type:[bulletRewriteSchema], default: []},
        keywordsPresent:{type:[String], default: []},
        keywordsMissing:{ type:[String], default: []},
        summary: {
            type: String,
            default: ""
        },
        model: {type: String , required: true},
        proptTokens: Number,
        responseTokens: Number,
    },
    { 
        timestamps: true 
    }
)

export default mongoose.model('Analysis', analysisSchema)

