type DataValue = {
  value?: number;
};

const NormalizeStat = (data: Record<string, DataValue[]>[]) => {
  return Object.keys(data[0])?.map((stat: string) => {
    const value = data[0][stat][0]?.value;
    return { [stat]: value ?? 0 };
  });
};

export default NormalizeStat;
