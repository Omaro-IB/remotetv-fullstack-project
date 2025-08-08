'use strict';
import { dir_schema, filepath_schema } from './schemas.js';

const help = "Usage: node index.js [--collection path/to/directory/] [--single path/to/directory] [--library path/to/json] [--ytdl /path/to/yt-dlp] [--...]"

const parseCli = (args) => {
    let added = false
    const parsed_args = {
        collections_dirs: [],
        single_dirs: [],
        library_dirs: [],
        ytdl_path: null
    }

    let mode = 0  // 0 = no path expected, 1 = collection path expected, 2 = single path expected, 3 = json path expected
    for (let i = 2; i < args.length; i++) {
        if (args[i] === '--help') {
            console.log(help)
            return
        }
        else if (args[i] === '--collection') {
            mode = 1
        }
        else if (args[i] === '--single') {
            mode = 2
        }
        else if (args[i] === '--library') {
            mode = 3
        }
        else if (args[i] === "--ytdl") {
            mode = 4
        }
        else {  // argument is not a valid --option
            const { error: dir_error } = dir_schema.validate(args[i])
            const { error: filepath_error } = filepath_schema.validate(args[i])

            if (!dir_error && filepath_error) {  // argument is a path to a directory
                if (mode === 1) {
                    parsed_args.collections_dirs.push(args[i])
                    added = true
                } else if (mode === 2) {
                    parsed_args.single_dirs.push(args[i])
                    added = true
                } else {
                    console.log(`path not expected: ${args[i]} (specify --library, --collection, or --single first), aborting.`)
                    return
                }
            }

            else if (!filepath_error && dir_error) {  // argument is a path to a file
                if (mode === 3) {
                    parsed_args.library_dirs.push(args[i])
                    added = true
                } else if (mode === 4) {
                    parsed_args.ytdl_path = args[i]
                    added = true
                }
            }

            else {  // argument is not a path
                console.log(`${args[i]} is not a valid argument or path, aborting.`)
                return
            }

            mode = 0
        }
    }

    // Return directories if at least one is added
    if (added) {
        return parsed_args
    } else {
        console.log(help)
    }
}

export { parseCli }