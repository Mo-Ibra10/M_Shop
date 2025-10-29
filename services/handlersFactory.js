const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const ApiFeatures = require('../utils/apiFeatures');


exports.deleteOne = (Model) => asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete(id);
    if (!document) {
        return next(new ApiError(`No document found with that ID: ${id}`, 404));
    }
    // trigger "remove" event when update document
        document.remove();
    res.status(204).send();
});


exports.updateone = (Model) => asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(
    
            req.params.id,
            req.body,
            {new: true}
        );
    
        if(!document){
            return next(new ApiError(`no document for this id ${req.params.id} `,404));
        }
        // trigger "save" event when update document
        document.save();
        res.status(200).json({data: document});
})

exports.createOne = (Model) => asyncHandler(async (req, res) => {
    const newDoc = await Model.create(req.body);
    res.status(201).json({ data: newDoc });
});

exports.getOne = (Model,populationopt)=>
    asyncHandler(async(req,res,next)=>{
    const { id } = req.params;
    //1- build query
    let query = Model.findById(id);
    if(populationopt){
        query= query.populate(populationopt);
    }
    //2- execute query
    const document = await query;
    if(!document){
        return next(new ApiError(`no document for this id ${id} `,404))
    }
    res.status(200).json({data: document});
});

exports.getAll = (Model, modelName ='') =>
    asyncHandler(async (req,res)=>{
        let filter= {};
    if(req.filterObj) {
        filter = req.filterObj;
    }
    //build query
    const totalCount = await Model.countDocuments();
    const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
  .filter()
  .search(modelName)
  .sort()
  .limitFields()
  .paginate(totalCount);

    //execute the query
const{ mongooseQuery,paginationResult } = apiFeatures;
const documents = await mongooseQuery;

    res.status(200).json({results: documents.length ,paginationResult ,data:documents });
});