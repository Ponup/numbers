#!/usr/bin/env node

/* jshint esversion: 6 */

const PERMISSIONS_TO_REMOVE = [
    'RECORD_AUDIO',
    'MODIFY_AUDIO_SETTINGS',
    'WRITE_EXTERNAL_STORAGE',
    'READ_PHONE_STATE'
];
const MANIFEST_PATH = 'platforms/android/AndroidManifest.xml';

var fs = require('fs'),
    manifestLines = fs.readFileSync(MANIFEST_PATH).toString().split('\n'),
    newManifestLines = [];

const permissionsRegex = PERMISSIONS_TO_REMOVE.join('|');

manifestLines.forEach(function(line) {
    if(!line.match(permissionsRegex)) {
        newManifestLines.push(line);
    }
});

fs.writeFileSync(MANIFEST_PATH, newManifestLines.join('\n'));

