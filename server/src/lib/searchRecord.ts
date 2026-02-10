import { Model } from "mongoose";

interface ISearchRecord<T> extends IRecordQuery {
  model: Model<T>;
  dataKeys: string[]; // which keys to search in the collection
}

const trasformToRegex = (value: string) => {
  return { $regex: value.trim(), $options: "i" }; // Apply regex for case-insensitive search
};

const SearchRecord = async <T>(props: ISearchRecord<T>) => {
  const { model: CollectionModel, dataKeys, search, filter, page } = props;
  const limit = 10;
  const skip = (page - 1) * limit;
  const matchStage: any = {};

  if (search.trim()) {
    const searchRegex = trasformToRegex(search);
    matchStage.$or = dataKeys.map((key) => ({
      [key as keyof string]: searchRegex,
    })); // Create an array of object for $or operator
  }

  if (filter) {
    matchStage.status = trasformToRegex(filter);
  }

  const result = await CollectionModel.aggregate([
    { $match: matchStage },
    { $sort: { createdAt: -1 } },
    { $skip: skip },
    { $limit: limit + 1 }, // Fetch one extra document to check if there's a next page
  ]);

  const hasNextPage = result.length > limit;
  const record = hasNextPage ? result.pop() : result; // Remove the extra document if it exists

  return { record, hasNextPage };
};

export default SearchRecord;
