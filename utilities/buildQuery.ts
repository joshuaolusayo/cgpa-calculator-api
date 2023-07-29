interface QueryOptions {
  sort_by?: string;
  return_only?: string;
  count?: boolean;
  bool?: false;
  page?: number;
  population?: number;
  [key: string]: any;
}

interface SeekConditions {
  [key: string]: any;
}

const buildQuery = (options: QueryOptions) => {
  const sort_condition = options.sort_by
    ? buildSortOrderString(options.sort_by)
    : '';
  const fields_to_return = options.return_only
    ? buildReturnFieldsString(options.return_only)
    : '';
  const count = options.count || false;
  let seek_conditions: SeekConditions = {
    // ...buildBooleanQuery(options.bool || '')
  };

  if (options.bool) {
    seek_conditions = {
      ...buildBooleanQuery(options.bool || '')
    };
  }

  const { skip, limit } = determinePagination(options.page, options.population);

  /** Delete sort and return fields */
  delete options.bool;
  delete options.count;
  delete options.page;
  delete options.population;
  delete options.return_only;
  delete options.sort_by;

  Object.keys(options).forEach((field) => {
    if (field.trim()) {
      const field_value = options[field]
        ? options[field].toString().toLowerCase()
        : '';
      let condition;

      if (field_value.includes(':')) {
        condition = buildInQuery(field_value);
      } else if (field_value.includes('!')) {
        condition = buildNorQuery(field_value);
      } else if (field_value.includes('~')) {
        condition = buildRangeQuery(field_value);
      } else {
        condition = buildOrQuery(field_value);
      }

      seek_conditions[field] = { ...condition };
    }
  });

  return {
    count,
    fields_to_return,
    limit,
    seek_conditions,
    skip,
    sort_condition
  };
};

const buildBooleanQuery = (value: string) => {
  const values = value.split(',');
  return values.reduce((sac: SeekConditions, val: string) => {
    let truthiness = true;
    let key = val;
    if (val[0] === '-') {
      truthiness = false;
      key = val.substr(1);
    }

    return {
      ...sac,
      [key]: truthiness
    };
  }, {});
};

const buildInQuery = (value: string) => {
  const values = value.split(':');
  return {
    $in: [...values]
  };
};

const buildNorQuery = (value: string) => {
  const values = value.split('!');
  return {
    $nin: [...values.slice(1)]
  };
};

const buildOrQuery = (value: string) => {
  const values = value.split(',');
  return {
    $in: [...values]
  };
};

const buildRangeQuery = (value: string) => {
  const [min, max] = value.split('~');
  return {
    $gte: min ? Number(min) : Number.MIN_SAFE_INTEGER,
    $lte: max ? Number(max) : Number.MAX_SAFE_INTEGER
  };
};

const buildReturnFieldsString = (value: string) => {
  return value.replace(/,/gi, ' ');
};

const buildSortOrderString = (value: string) => {
  return value.replace(/,/gi, ' ');
};

const buildWildcardOptions = (key_list, value) => {
  const keys = key_list.split(',');

  return {
    $or: keys.map((key) => ({
      [key]: {
        $regex: value || '',
        $options: 'i'
      }
    }))
  };
};

const determinePagination = (
  page: number = 0,
  population: number = Number.MAX_SAFE_INTEGER
) => {
  return {
    limit: Number(population),
    skip: page * population
  };
};

export {
  buildInQuery,
  buildNorQuery,
  buildOrQuery,
  buildQuery,
  buildRangeQuery,
  buildReturnFieldsString,
  buildSortOrderString,
  buildWildcardOptions,
  determinePagination
};
