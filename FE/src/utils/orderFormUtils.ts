import { Account, OrderFormData, Parent } from "../pages/Order";

export const updateField = (
  prev: OrderFormData,
  field: "account" | "parent",
  index: number,
  key: keyof Account | keyof Parent,
  value: boolean | string
) => {
  if (!Array.isArray(prev[field])) return prev;
  const updatedField = [...prev[field]];
  updatedField[index] = {
    ...updatedField[index],
    [key]: value,
  };
  return { ...prev, [field]: updatedField };
};
