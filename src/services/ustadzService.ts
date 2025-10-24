import * as ustadzRepo from '../repositories/ustadzRepo';
import bcrypt from 'bcrypt';

export const registerUstadz = async (data: any) => {
  const hashed = await bcrypt.hash(data.password, 10);
  return ustadzRepo.createUstadz({ ...data, password: hashed });
};

export const getUstadzById = ustadzRepo.getUstadzById;
export const getUstadzByName = ustadzRepo.getUstadzByName;
export const deleteUstadz = ustadzRepo.deleteUstadz;

export const updateUstadzProfileAndUser = async (id: number, data: any) => {
  const { email, password, ...restData } = data;
  let hashed = undefined;
  if (password) {
    hashed = await bcrypt.hash(password, 10);
  }

  return ustadzRepo.updateUstadzAndUser(id, {
    ...restData,
    email,
    password: hashed
  });
};

export const getUstadzForAdmin = async (options: {
  waliKelasTahap?: string;
  search?: string;
  page?: number;
  limit?: number;
}) => {
  const page = options.page && options.page > 0 ? options.page : 1;
  const limit = options.limit && options.limit > 0 ? options.limit : 10;

  const { data, totalData } = await ustadzRepo.findUstadzWithPagination(
    { waliKelasTahap: options.waliKelasTahap as any, search: options.search },
    page,
    limit
  );

  const totalPages = Math.ceil(totalData / limit);

  return {
    pagination: { page, limit, totalData, totalPages },
    data,
  };
};
