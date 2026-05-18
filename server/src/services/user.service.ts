type User = {
  id: number;
  name: string;
};

const users: User[] = [
  { id: 1, name: "Hasiru" },
  { id: 2, name: "John" },
];

export const getAllUsers = () => {
  return users;
};

export const getUserById = (id: number) => {
  return users.find((u) => u.id === id);
};