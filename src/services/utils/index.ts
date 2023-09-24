import { pick } from "lodash";

export const formatResult = (fields: string[], data: Object) => {
  return pick(data, fields);
};
