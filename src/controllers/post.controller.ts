import { Request, Response } from 'express';
import { createNewPost, createPropertyPost, getPropertyPostById } from '../services/post.service';
import { extractAndVerifyToken } from '../services/token.service';
import catchAsync from '../utils/catchAsync';
import sharp from 'sharp';
import { bucket } from '../configs/multer';
import { Property } from '@prisma/client';
import MiniSearch, { Query } from 'minisearch';
import httpStatus from 'http-status';
import pick from '../utils/pick';
import { postService } from '../services';

const createProperty = catchAsync(async (req, res) => {
  // if (!req.files || !req.files.length) {
  //   throw new Error('No files provided');
  // }

  const uploadFile = (file: Express.Multer.File): Promise<string> => {
    return new Promise(async (resolve, reject) => {
      const fileName = `${Date.now()}-${file.originalname}`;
      const blob = bucket.file(fileName);
      const blobStream = blob.createWriteStream({
        metadata: {
          contentType: file.mimetype,
        },
      });

      blobStream.on('error', (err) => {
        reject(err);
      });

      blobStream.on('finish', () => {
        const url = `https://storage.googleapis.com/${process.env.GOOGLE_STORAGE_BUCKET}/${fileName}`;
        resolve(url);
      });

      try {
        const compressedBuffer = await sharp(file.buffer).resize(800).jpeg({ quality: 80 }).png({ quality: 80 }).toBuffer();

        blobStream.end(compressedBuffer);
      } catch (error) {
        reject(error);
      }
    });
  };

  const files = req.files as Express.Multer.File[];
  const urls = await Promise.all(files.map(uploadFile));
  const propertyData: Property = {
    propertyImage: urls,
    ...req.body,
  };

  const decoded = extractAndVerifyToken(req);

  if (typeof decoded !== 'object' || !decoded.sub) {
    throw new Error('Invalid token payload');
  }

  const property = await createPropertyPost(propertyData);

  await createNewPost({
    propertyId: property.id,
    userId: decoded.sub,
  });

  return res.status(201).json({
    error: false,
    message: 'Property created successfully!',
    data: property,
  });
});

const queryAllProperties = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'sortOrder']);

  if (options.limit) {
    options.limit = parseInt(options.limit, 10);
  }
  if (options.page) {
    options.page = parseInt(options.page, 10);
  }

  const properties = await postService.queryProperties(filter, options);

  const data = properties.map((property) => ({
    id: property.id,
    propertyImage: property.propertyImage,
    propertyName: property.propertyName,
    bathroom: property.bathroom,
    bedroom: property.bedroom,
    buildingArea: property.buildingArea,
    landArea: property.landArea,
    floor: property.floor,
    location: property.location,
    description: property.description,
    year: property.year,
    created_at: property.created_at,
  }));
  res.status(httpStatus.OK).json({
    error: false,
    message: 'Properties retrieve Successfully!',
    data,
  });
});

const searchProperties = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['propertyName', 'location']);
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'sortOrder']);

  if (options.limit) {
    options.limit = parseInt(options.limit, 10);
  }
  if (options.page) {
    options.page = parseInt(options.page, 10);
  }

  const properties = await postService.queryProperties(filter, options);
  let miniSearch = new MiniSearch({
    fields: ['propertyName', 'location'],
    storeFields: [
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
    ],
  });
  miniSearch.addAll(properties);
  let results = miniSearch.search(req.query.q as Query);

  const data = results.map((property) => ({
    id: property.id,
    propertyImage: property.propertyImage,
    propertyName: property.propertyName,
    bathroom: property.bathroom,
    bedroom: property.bedroom,
    buildingArea: property.buildingArea,
    landArea: property.landArea,
    floor: property.floor,
    location: property.location,
    description: property.description,
    year: property.year,
    created_at: property.created_at,
  }));
  res.status(httpStatus.OK).json({
    error: false,
    message: 'Properties retrieve Successfully!',
    data,
  });
});

const getPostById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const post = await getPropertyPostById(id);
  res.send(post);
});

export { createProperty, getPostById, searchProperties, queryAllProperties };
