const ProductModel = require('../models/products-model');
const UserModel = require('../models/users-model');

const SearchMiddleware = (model) => {
    return async (req, res, next) => {
        try {
            const searchQuery = req.query.query;
            let results;

            if (searchQuery) {
                if (model === 'products') {
                    results = await ProductModel.find({
                        $or: [
                            { productName: { $regex: searchQuery.toString(), $options: "i" } },
                            { companyName: { $regex: searchQuery.toString(), $options: "i" } }
                        ]
                    });
                } else if (model === 'users') {
                    results = await UserModel.find({
                        $or: [
                            { userName: { $regex: searchQuery.toString(), $options: "i" } },
                            { fullName: { $regex: searchQuery.toString(), $options: "i" } }
                        ]
                    });
                }
            } else {
                results = await (model === 'products' ? ProductModel : UserModel).find();
            }

            req.results = results;
            req.searchQuery = searchQuery;

            next();
        } catch (error) {
            console.error("Error fetching search results:", error);
            res.status(500).send("Error fetching search results");
        }
    };
};

module.exports = SearchMiddleware;
