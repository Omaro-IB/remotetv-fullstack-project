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
    episode_name: Joi.string().optional(),
    release: Joi.number().optional(),
    quality: Joi.string().optional(),
    language: Joi.string().optional()
})

// Validate collection object (NAME, PATHS TO EACH EPISODE, METADATAS OF EACH EPISODE)
const collections_schema = Joi.object({
    name: Joi.string(),
    items: Joi.array().items(Joi.array().items(item_schema).min(1)).min(1),
    group_labels: Joi.array().items(Joi.string()).min(1),
    item_labels: Joi.array().items(Joi.array().items(Joi.string()).min(1)).min(1),
    global_img: filepath_schema.optional(),
    global_text: Joi.string().optional(),
    global_release: Joi.number().optional(),
    global_quality: Joi.string().optional(),
    global_language: Joi.string().optional()
}).custom((value, helpers) => {
    // group_labels length must equal # of groups and item_labels lengths must equal # of items in each group
    const {items: it, group_labels: gl, item_labels: il} = value
    if (gl.length !== it.length) {return helpers.error('any.invalid', {message: 'Group labels must have same number of elements as the number of groups'})}
    for (let gr_i = 0; gr_i < it.length; gr_i++) {if (it[gr_i].length !== il[gr_i].length) {return helpers.error('any.invalid', {message: 'Item labels must have same number of elements as the number of items in each corresponding group'})}}
    return value
})

// Validate single object (NAME, PATH TO FILE, METADATA)
const singles_schema = Joi.object({
    name: Joi.string(),
    item: item_schema,
})

// Validate library object (list of singles / collections objects)
const library_schema = Joi.array().items(Joi.alternatives().try(collections_schema, singles_schema))

export { collections_schema, singles_schema, dir_schema, filepath_schema, library_schema, item_schema }