'use strict';
import {library_schema} from './schemas.js';
import fs from "fs";


const createLibrary = (collection_dirs, single_dirs, library_dirs) => {
    const library = []
    const warnings = []
    const errors = []

    // Manual JSON files
    library_dirs.forEach(dir => {
        try {
            const lib_i = JSON.parse(fs.readFileSync(dir, 'utf8'))
            const {error: lib_error} = library_schema.validate(lib_i)
            if (lib_error) {errors.push(`${dir} is not a valid JSON library file`)}
            else {library.push(...lib_i)}
        } catch {
            errors.push(`failed to parse ${dir} as JSON`)
        }
    })

    // Scanning
    collection_dirs.forEach(dir => {
        // TODO: scan collection directory
    })

    single_dirs.forEach(dir => {
        // TODO: scan single directory
    })

    return {
        library: library,
        warnings: warnings,
        errors: errors
    }
}

export { createLibrary };