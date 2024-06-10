import { Post, Property } from '@prisma/client';
import prisma from '../utils/prisma';

interface CreatePropertyPostInput {
  propertyImage: string[];
  propertyName: string;
  location: string;
  description: string;
  bedroom: string;
  bathroom: string;
  buildingArea: string;
  landArea: string;
  floor: string;
  year: string;
}

/**
 * Create a property post
 * @param {CreatePropertyPostInput} userBody
 * @returns {Promise<Property>}
 */
const createPropertyPost = async (userBody: any): Promise<Property> => {
  return prisma.property.create({
    data: {
      ...userBody,
    },
  });
};

interface CreatePostInput {
  propertyId: string;
  userId: string;
}

/**
 * Create a post
 * @param {CreatePostInput} userBody
 * @returns {Promise<Post>}
 */

const createNewPost = async (userBody: CreatePostInput): Promise<Post> => {
  return await prisma.post.create({
    data: {
      propertyId: userBody.propertyId,
      userId: userBody.userId,
    },
  });
};

/**
 * Get property post by ID
 * @param {string} propertyId - The ID of the property post
 * @returns {Promise<Property | null>} - A promise resolving to the property post or null if not found
 */
const getPropertyPostById = async (propertyId: string): Promise<Property | null> => {
  return prisma.property.findUnique({
    where: {
      id: propertyId,
    },
  });
};

/**
 * Update property post
 * @param {string} propertyId - The ID of the property post to update
 * @param {Partial<CreatePropertyPostInput>} updateData - The data to update the property post with
 * @returns {Promise<Property | null>} - A promise resolving to the updated property post or null if not found
 */
const updatePropertyPost = async (
  propertyId: string,
  updateData: Partial<CreatePropertyPostInput>,
): Promise<Property | null> => {
  try {
    return prisma.property.update({
      where: {
        id: propertyId,
      },
      data: {
        ...updateData,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Unable to update property post: ${error.message}`);
    } else {
      throw new Error('Unable to update property post: Unknown error');
    }
  }
};

/**
 * Delete property post
 * @param {string} propertyId - The ID of the property post to delete
 * @returns {Promise<void>} - A promise resolving once the property post is deleted
 */
const deletePropertyPost = async (propertyId: string): Promise<void> => {
  try {
    await prisma.post.deleteMany({
      where: {
        propertyId: propertyId,
      },
    });
    await prisma.property.delete({
      where: {
        id: propertyId,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Unable to delete property post: ${error.message}`);
    } else {
      throw new Error('Unable to delete property post: Unknown error');
    }
  }
};

/**
 * Query for users
 * @param {Object} filter - Prisma filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryProperties = async <Key extends keyof Property>(
  filter: object,
  options: {
    limit?: number;
    page?: number;
    sortBy?: string;
    sortOrder?: string;
  },
  keys: Key[] = [
    'id',
    'propertyImage',
    'propertyName',
    'bathroom',
    'bedroom',
    'created_at',
    'buildingArea',
    'landArea',
    'floor',
    'location',
    'description',
    'year',
  ] as Key[],
): Promise<Pick<Property, Key>[]> => {
  const page = options.page ?? 1;
  const limit = options.limit ?? 10;
  const sortBy = options.sortBy;
  const sortOrder = options.sortOrder ?? 'asc';

  const property = await prisma.property.findMany({
    where: filter,
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
    take: limit,
    skip: (page - 1) * limit,
    orderBy: sortBy ? { [sortBy]: sortOrder } : undefined,
  });
  return property as Pick<Property, Key>[];
};

export { createNewPost, createPropertyPost, getPropertyPostById, updatePropertyPost, deletePropertyPost, queryProperties };
