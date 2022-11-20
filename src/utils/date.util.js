export const getYesterday = () => {
  const yesterDay = new Date();
  yesterDay.setDate(new Date().getDate() - 1);
  return {
    yesterDay: yesterDay.toLocaleDateString(),
    fullDate: yesterDay,
  };
};
