import * as ortuRepo from '../repositories/ortuRepo';
import bcrypt from 'bcrypt';

export const registerOrangTua = async (data: any) => {
  const hashed = data.password ? await bcrypt.hash(data.password, 10) : undefined;
  return ortuRepo.createOrangTua({ ...data, password: hashed });
};

export const getOrangTuaById = ortuRepo.getOrangTuaById;
export const getOrangTuaByName = ortuRepo.getOrangTuaByName;
export const deleteOrangTua = ortuRepo.deleteOrangTua;

export const updateOrangTuaAndUser = async (id: number, data: any) => {
  const { email, password, ...restData } = data;
  let hashed = undefined;

  if (password) {
    hashed = await bcrypt.hash(password, 10);
  }

  return ortuRepo.updateOrangTuaProfileAndUser(id, {
    ...restData,
    email,
    password: hashed
  });
};


export const getOrangTuaForAdmin = async (options: {
  search?: string;
  page?: number;
  limit?: number;
  tipe?: string;
}) => {
  const page = options.page && options.page > 0 ? options.page : 1;
  const limit = options.limit && options.limit > 0 ? options.limit : 10;

  const { data, totalData } = await ortuRepo.findOrangTuaWithPagination(
    { search: options.search, tipe: options.tipe as any },
    page,
    limit
  );

  const totalPages = Math.ceil(totalData / limit);

  return {
    pagination: { page, limit, totalData, totalPages },
    data,
  };
};