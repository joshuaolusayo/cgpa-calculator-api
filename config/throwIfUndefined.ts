const throwIfUndefined = (name: string, value?: string) => {
  if (!value) {
    throw new Error(`${name} cannot be undefined`);
  }

  return value;
};

export default throwIfUndefined;
