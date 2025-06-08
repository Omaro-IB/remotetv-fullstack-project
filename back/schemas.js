'use strict';
import Joi from 'joi'
import fs from 'fs'


// Validate path to directory string
const dir_schema = Joi.string().custom((value, helpers) => {
    // Check if the path exists and is a directory
    if (!fs.existsSync(value)) {
        return helpers.error('any.invalid', { message: 'Directory does not exist' });
    }
    if (!fs.statSync(value).isDirectory()) {
        return helpers.error('any.invalid', { message: 'Path is not a directory' });
    }
    return value; // Return the valid path
}, 'Directory validation');

// Validate path to file string
const filepath_schema = Joi.string().custom((value, helpers) => {
    // Check if the path exists and is a directory
    if (!fs.existsSync(value)) {
        return helpers.error('any.invalid', { message: 'File does not exist' });
    }
    if (!fs.statSync(value).isFile()) {
        return helpers.error('any.invalid', { message: 'Path is not a file' });
    }
    return value; // Return the valid path
}, 'File validation');

// Validate item object (path & metadata)
const item_schema = Joi.object().keys({
    path: filepath_schema,
    img: filepath_schema.optional(),
    sub: filepath_schema.optional(),
    text: Joi.string().optional(),
    quality: Joi.string().optional(),
    duration: Joi.number().optional()
})

// Validate collection object (NAME, PATHS TO EACH EPISODE, METADATAS OF EACH EPISODE)
const collections_schema = Joi.object({
    name: Joi.string(),
    items: Joi.array().items(Joi.array().items(item_schema)),
})

// Validate single object (NAME, PATH TO FILE, METADATA)
const singles_schema = Joi.object({
    name: Joi.string(),
    item: item_schema,
})

// Validate library object (list of singles / collections objects)
const library_schema = Joi.array().items(Joi.alternatives().try(collections_schema, singles_schema))

export { collections_schema, singles_schema, dir_schema, filepath_schema, library_schema }