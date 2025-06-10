'use strict';
import {library_schema} from './schemas.js';
import fs from "fs";
import path from 'path';


const media_types = ['3d0', '3g2', '3gp', '4xm', '8svx', 'a64', 'aa', 'aac', 'aax', 'ac3', 'ace', 'acm', 'act', 'adf', 'adp', 'ads', 'adts', 'adx', 'aea', 'afc', 'aiff', 'aix', 'alac', 'alaw', 'alias_pix', 'alp', 'alsa', 'amr', 'amrnb', 'amrwb', 'amv', 'anm', 'apc', 'ape', 'apm', 'apng', 'aptx', 'asf', 'ast', 'au', 'av1', 'awb', 'avi', 'avif', 'avm2', 'avr', 'avs', 'avs2', 'avs3', 'bfi', 'bmv', 'boa', 'brender_pix', 'brstm', 'c93', 'caca', 'caf', 'cda', 'cdg', 'cdxl', 'crc', 'dfa', 'dsf', 'dss', 'dts', 'dv', 'dv4', 'dvd', 'dxa', 'dhav', 'cine', 'bfstm', 'bink', 'binka', 'dash', 'data', 'daud', 'derf', 'ea', 'eac3', 'epaf', 'f4v', 'f4p', 'flac', 'frm', 'fsb', 'flic', 'flv', 'f4a', 'f4b', 'f4v', 'f32be', 'f32le', 'f64be', 'f64le', 'fbdev', 'fifo', 'fifo_test', 'fits', 'gdv', 'gif', 'gifv', 'gsm', 'gxf', 'hca', 'hls', 'hnm', 'ico', 'idcin', 'idf', 'iec61883', 'iff', 'ifv', 'ipu', 'iss', 'iv8', 'ivf', 'ivs', 'ivr', 'imf', 'iklax', 'ipod', 'ircam', 'ismv', 'jv', 'kux', 'kvag', 'loas', 'latm', 'lvf', 'lxf', 'm4v', 'mkv', 'webm', 'mca', 'mgsts', 'mjpeg', 'mlp', 'mlv', 'mm', 'mmf', 'mods', 'moflex', 'mov', 'qt', 'm4a', 'm4b', '3g2', 'm2v', 'mp2', 'mp3', 'mp4', 'm4p', 'mpg', 'mpe', 'mpv', 'mpc', 'mpc8', 'mpeg', 'mpeg4', 'mpegts', 'mpeg1', 'mpeg2', 'mpjpeg', 'msf', 'msnwctcp', 'msp', 'mtaf', 'mtv', 'mulaw', 'musx', 'mv', 'mvi', 'mxf', 'mxf_d10', 'mxf_opatom', 'mxg', 'mogg', 'nmf', 'nc', 'nsp', 'nsv', 'null', 'nut', 'nuv', 'obu', 'oga', 'ogg', 'ogv', 'oma', 'opus', 'oss', 'paf', 'pmp', 'psp', 'pva', 'pvf', 'qcp', 'pulse', 'ra', 'rm', 'r3d', 'rl2', 'rm', 'raw', 'roq', 'rf64', 'rpl', 'rsd', 'rso', 'rtp', 's8', 'sap', 'sbc', 'sbg', 'scd', 'sdl', 'sdl2', 'sdp', 'sdr2', 'sds', 'sdx', 'ser', 'sga', 'shn', 'sln', 'smk', 'sol', 'svi', 'sox', 'spx', 'svag', 'svcd', 'svs', 'swf', 'tak', 'tee', 'thp', 'tmv', 'tta', 'tty', 'txd', 'ty', 'v210', 'v210x', 'vag', 'u16be', 'u16le', 'u24be', 'u24le', 'u32be', 'u32le', 'u8', 'vc1', 'vcd', 'vidc', 'v4l2', 'viv', 'vivo', 'vmd', 'vob', 'voc', 'vox', 'vpk', 'vqf', 'w64', 'wav', 'wc3', 'webm', 'wsaud', 'wsd', 'wsvqa', 'wtv', 'wv', 'wve', 'x11grab', 'xa', 'xbin', 'xbm_pipe', 'xmv', 'xv', 'xvag', 'wma', 'xwma', 'yop', 'mts', 'm2ts', 'ts', 'wmv', 'mng', 'drc', 'yuv', 'rm', 'rmvb']
const audio_types = ['8svx', 'aa', 'aac', 'aax', 'ac3', 'acm', 'act', 'adts', 'adx', 'aea', 'aiff', 'alac', 'alaw', 'alp', 'alsa', 'amr', 'amrn', 'amrwb', 'apc', 'ape', 'apm', 'aptx', 'wst', 'au', 'awb', 'caf', 'cda', 'cdg', 'dss', 'dts', 'bfstm', 'binka', 'eac3', 'flac', 'fsb', 'f4a', 'f4b', 'f32le', 'f64', 'gsm', 'hca', 'imf', 'iklax', 'ipod', 'icram', 'latm', 'loas', 'mgsts', 'mlp', 'mmf', 'mods', 'm4a', 'm4b', 'mp2', 'mp3', 'm4p', 'mpc', 'mpc8', 'mpeg1', 'mulaw', 'musx', 'mogg', 'oga', 'ogg', 'oma', 'pmp', 'pvf', 'qcp', 'pulse', 'ra', 'rf64', 'sdx', 'shn', 'sox', 'spx', 'tak', 'tta', 'vag', 'voc', 'vox', 'vqf', 'w64', 'wav', 'wv', 'xa', 'wma', 'xwma']
const image_types = ['jpeg', 'jpg', 'png', 'webp', 'tiff', 'svg', 'xbm', 'ico']
const sub_types = ['srt', 'webvtt', 'vtt', 'lrc', 'lrc2', 'ass', 'scc']
const media_info_type = 'mediainfo'


// Given list of extensions `[ext]` and directory `dir`, find (recursively) all files that have extension of one of `ext`
const findFilesWithExtensions = (dir, extensions, result=[]) => {
    // Read the contents of the directory
    const filesAndDirs = fs.readdirSync(dir);

    // Iterate over each item in the directory
    filesAndDirs.forEach(item => {
        const fullPath = path.join(dir, item);
        const stats = fs.statSync(fullPath);

        // If it's a non-hidden directory, recurse
        if (stats.isDirectory() && item[0] !== '.') {
            findFilesWithExtensions(fullPath, extensions, result);
        } else {
            // If it's a file, check the extension
            const fileExt = path.extname(item).toLowerCase().substring(1);
            if (extensions.includes(fileExt)) {
                result.push(fullPath);
            }
        }
    });

    return result;
}


// Given path to media file, return an Item object and any warnings
const getItemFromPath = (media_path, warning_label) => {
    const warnings = []

    const media_directory = path.dirname(media_path)
    const media_path_no_ext = path.basename(media_path, path.extname(media_path))

    // Check for image file of the same name
    let img_path
    for (const it of image_types) {
        const this_img_path = path.join(media_directory, media_path_no_ext + '.' + it)
        if (fs.existsSync(this_img_path)) {img_path = this_img_path; break}
    }
    // Recursively search for image types if not found of same name
    if (img_path === undefined) {
        const img_paths = findFilesWithExtensions(path.dirname(media_path), image_types)
        img_path = img_paths.length > 0 ? img_paths[0] : undefined
        if (img_paths.length > 1) {warnings.push(`[${warning_label}]: ${media_path} ambiguous image, found ${img_paths}`)}
    }

    // Check for subtitle file of the same name
    let sub_path
    for (const st of sub_types) {
        const this_sub_path = path.join(media_directory, media_path_no_ext + '.' + st)
        if (fs.existsSync(this_sub_path)) {sub_path = this_sub_path; break}
    }
    // Recursively search for subtitle types if not found of same name
    if (sub_path === undefined) {
        const sub_paths = findFilesWithExtensions(path.dirname(media_path), sub_types)
        sub_path = sub_paths.length > 0 ? sub_paths[0] : undefined
        if (sub_paths.length > 1) {warnings.push(`[${warning_label}]: ${media_path} ambiguous subtitle, found ${sub_paths}`)}
    }

    // Check for .mediainfo file of the same name
    const mediainfo_path = path.join(media_directory, media_path_no_ext + '.' + media_info_type)
    let info = {};
    if (fs.existsSync(mediainfo_path)) {
        try {
            info = JSON.parse(fs.readFileSync(mediainfo_path, 'utf8'))
        } catch {
            warnings.push(`[${warning_label}]: ${mediainfo_path} failed to parse as JSON`)
        }
    }

    return [
        {
            path: media_path,
            img: img_path,
            sub: sub_path,
            text: info.text,
            release: info.release === undefined ? undefined : (isNaN(parseInt(info.release)) ? undefined : parseInt(info.release)),
            quality: info.quality,
            language: info.language
        },
        warnings
    ]
}



const createLibrary = (collection_dirs, single_dirs, library_dirs) => {
    const library = []
    const warnings = []
    const errors = []

    // Manual JSON files
    library_dirs.forEach(dir => {
        try {
            const lib_i = JSON.parse(fs.readFileSync(dir, 'utf8'))
            const {error: lib_error} = library_schema.validate(lib_i)
            if (lib_error) {errors.push(`$[library ${dir}]: not formatted in correct library JSON format`)}
            else {library.push(...lib_i)}
        } catch {
            errors.push(`[library ${dir}]: failed to parse as JSON`)
        }
    })

    // Scanning collections
    collection_dirs.forEach(dir => {
        const filesAndDirs = fs.readdirSync(dir);
        filesAndDirs.forEach(item => {
            const subDir = path.join(dir, item);
            const stats = fs.statSync(subDir);

            // Sub-directories = collections, sub-sub-directories = groups
            // If sub-directory a non-hidden directory, look inside
            if (stats.isDirectory() && item[0] !== '.') {
                const sub_filesAndDirs = fs.readdirSync(subDir)

                let mediaInSDir = false  // mediafiles in sub-directory?
                let SSDir = false  // there exist sub-sub-directories?
                let SSDir0 = false  // each sub-sub-directory recursively contains 0 media files?
                let SSDir1 = false  // each sub-sub-directory recursively contains 0 or 1 media files?
                let SSDirN = false  // each sub-sub-directory contains 0 or 1 or > 1 media files?

                const SSDirsMediaFiles = []  // media files in each sub-sub-directory
                const SDirMediaFiles = []  // media files in sub-directory

                // Sub-directory files and sub-sub-directories
                sub_filesAndDirs.forEach(subDirItem => {
                    const itemS = path.join(subDir, subDirItem)
                    const statsS = fs.statSync(itemS)

                    if (statsS.isDirectory()) {  // sub-sub-directory
                        SSDir = true
                        const mediaFilesS = findFilesWithExtensions(itemS, media_types)  // recursive media files in sub-sub-directory
                        if (mediaFilesS.length === 0) {SSDir0 = true}
                        else if (mediaFilesS.length === 1) {SSDir1 = true; SSDirsMediaFiles.push(mediaFilesS)}
                        else if (mediaFilesS.length > 1) {SSDirN = true; SSDirsMediaFiles.push(mediaFilesS)}
                    } else {  // sub-directory media file
                        const extS = path.extname(itemS).toLowerCase().substring(1)
                        if (media_types.includes(extS)) {mediaInSDir = true; SDirMediaFiles.push(itemS)}
                    }
                })

                // Helper function that takes array of paths and translates it to array of items
                const pathsToItems = (paths) => {
                    return paths.map(p => {
                        const [this_item, this_warnings] = getItemFromPath(p, `collection: ${subDir}`)
                        warnings.push(this_warnings)
                        return this_item
                    })
                }

                // Helper function that gets group labels from sample file
                const getGroupLabels = (file, n) => {
                    const baseLabel = audio_types.includes(path.extname(file).toLowerCase().substring(1)) ? "Tracklist" : "Season"
                    if (n === 1) {return [baseLabel]}
                    else {return [...Array(n).keys()].map(i => `${baseLabel} ${i+1}`)}
                }

                const collectionItems = []
                let collectionGroupLabels
                const collectionItemLabels = []
                // Construct collection for this sub-directory
                if (mediaInSDir) {
                    if (SSDirN || SSDir1) {  // all sub-directory files in group 0, sub-sub directory files in rest of groups
                        collectionGroupLabels = getGroupLabels(SDirMediaFiles[0], SSDirsMediaFiles.length + 1)
                        collectionItems.push(pathsToItems(SDirMediaFiles))
                        collectionItemLabels.push(SDirMediaFiles.map(p => path.basename(p)))
                        SSDirsMediaFiles.forEach(x => {
                            collectionItems.push(pathsToItems(x))
                            collectionItemLabels.push(x.map(p => path.basename(p)))
                        })
                    } else if (!SSDir || SSDir0) {  // all mediafiles are in sub-directory
                        collectionGroupLabels = getGroupLabels(SDirMediaFiles[0], 1)
                        collectionItems.push(pathsToItems(SDirMediaFiles))
                        collectionItemLabels.push(SDirMediaFiles.map(p => path.basename(p)))
                    }
                } else {
                    if (SSDirN) {  // sub-sub directory files for each group
                        collectionGroupLabels = getGroupLabels(SSDirsMediaFiles[0][0], SSDirsMediaFiles.length)
                        SSDirsMediaFiles.forEach(x => {
                            collectionItems.push(pathsToItems(x))
                            collectionItemLabels.push(x.map(p => path.basename(p)))
                        })
                    } else if (SSDir1) {  // sub-sub directory files as group 0
                        let ctr = 0
                        SSDirsMediaFiles.forEach(x => {
                            ctr += x.length
                            collectionItems.push(...pathsToItems(x))
                            collectionItemLabels.push(...x.map(p => path.basename(p)))
                        })
                        collectionGroupLabels = getGroupLabels(SSDirsMediaFiles[0][0], ctr)
                    } else if (!SSDir || SSDir0) {  // no compatible media files, push error
                        errors.push(`[collection: ${subDir}]: no compatible media found in this directory`)
                    }
                }

                if (collectionGroupLabels !== undefined) {
                    const this_collection = {
                        name: item,
                        items: collectionItems,
                        group_labels: collectionGroupLabels,
                        item_labels: collectionItemLabels
                    }
                    library.push(this_collection)
                }
            }
        })
    })

    // Scanning singles
    single_dirs.forEach(dir => {
        const media_paths = findFilesWithExtensions(dir, media_types)
        media_paths.forEach(media_path => {
            // Get item from media path
            const [this_item, this_warnings] = getItemFromPath(media_path, `single: ${dir}`)

            // Construct single object from Item
            const this_single = {
                name: path.basename(media_path),
                item: this_item
            }
            library.push(this_single)
            warnings.push(...this_warnings)
        })
    })

    return {
        library: library,
        warnings: warnings,
        errors: errors
    }
}

export { createLibrary, findFilesWithExtensions }