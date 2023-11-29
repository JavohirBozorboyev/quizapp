export const parseJson = (data: any) => {
  let item;
  if (typeof window !== "undefined") {
    item = JSON.parse(data);
  }
  return item;
};
