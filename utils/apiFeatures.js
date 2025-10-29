class ApiFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  filter() {
      const queryStringObj = { ...this.queryString };
  const excludesFields = ['page', 'sort', 'limit', 'fields', 'keyword'];
  excludesFields.forEach((field) => delete queryStringObj[field]);

  const filters = {};

  Object.keys(queryStringObj).forEach((key) => {
    if (key.includes('[')) {
      const [field, opWithBracket] = key.split('[');
      const op = opWithBracket.replace(']', '');
      if (!filters[field]) filters[field] = {};
      filters[field][`$${op}`] = queryStringObj[key];
    } else {
      filters[key] = queryStringObj[key];
    }
  });

  this.mongooseQuery = this.mongooseQuery.find(filters);
  return this;
  }

  search(modelName) {
    if (this.queryString.keyword) {
      let query = {};
      if (modelName === 'Products') {
        query.$or = [
          { title: { $regex: this.queryString.keyword, $options: 'i' } },
          { description: { $regex: this.queryString.keyword, $options: 'i' } },
        ];
      } else {
        query = { name: { $regex: this.queryString.keyword, $options: 'i' } };
      }

      this.mongooseQuery = this.mongooseQuery.find(query);
    }
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select('-__v');
    }
    return this;
  }

  paginate(countDocuments) {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 50;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;

    //pagination result
    const pagination = {
      currentPage: page,
      limit,
      numberOfPages: Math.ceil(countDocuments / limit),
      countDocuments,      
    };
    //next page
    if (endIndex < countDocuments) {
      pagination.next = page + 1;
    }
    if (skip > 0) {
      pagination.prev = page - 1;
    }

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    this.paginationResult = pagination;
    return this;
  }
}

module.exports = ApiFeatures;
