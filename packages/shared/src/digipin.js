"use strict";
/**
 * DIGIPIN (Digital Postal Index Number) Open Standard Implementation
 * Developed in accordance with Department of Posts (Govt. of India) specifications.
 * Bounding Box for India:
 *   Latitude:  2.5° N to 38.5° N (Span: 36.0°)
 *   Longitude: 63.5° E to 99.5° E (Span: 36.0°)
 *
 * Each character represents a 4x4 grid cell (16 subdivisions):
 * Grid symbols: '2', '3', '4', '5', '6', '7', '8', '9', 'C', 'F', 'J', 'K', 'L', 'M', 'P', 'Q'
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DIGIPIN_CHARS = exports.DIGIPIN_BOUNDS = void 0;
exports.encodeDigipin = encodeDigipin;
exports.formatDigipin = formatDigipin;
exports.decodeDigipin = decodeDigipin;
exports.DIGIPIN_BOUNDS = {
    MIN_LAT: 2.5,
    MAX_LAT: 38.5,
    MIN_LON: 63.5,
    MAX_LON: 99.5,
};
exports.DIGIPIN_CHARS = [
    '2', '3', '4', '5',
    '6', '7', '8', '9',
    'C', 'F', 'J', 'K',
    'L', 'M', 'P', 'Q'
];
/**
 * Encodes latitude and longitude into a standard 10-character DIGIPIN code.
 */
function encodeDigipin(lat, lon, length = 10) {
    if (lat < exports.DIGIPIN_BOUNDS.MIN_LAT ||
        lat > exports.DIGIPIN_BOUNDS.MAX_LAT ||
        lon < exports.DIGIPIN_BOUNDS.MIN_LON ||
        lon > exports.DIGIPIN_BOUNDS.MAX_LON) {
        throw new Error(`Coordinates (${lat}, ${lon}) are outside India DIGIPIN bounds.`);
    }
    let minLat = exports.DIGIPIN_BOUNDS.MIN_LAT;
    let maxLat = exports.DIGIPIN_BOUNDS.MAX_LAT;
    let minLon = exports.DIGIPIN_BOUNDS.MIN_LON;
    let maxLon = exports.DIGIPIN_BOUNDS.MAX_LON;
    let code = '';
    for (let step = 0; step < length; step++) {
        const latSpan = (maxLat - minLat) / 4;
        const lonSpan = (maxLon - minLon) / 4;
        const row = Math.min(3, Math.max(0, Math.floor((lat - minLat) / latSpan)));
        const col = Math.min(3, Math.max(0, Math.floor((lon - minLon) / lonSpan)));
        const charIndex = row * 4 + col;
        code += exports.DIGIPIN_CHARS[charIndex];
        // Narrow bounds for next level
        minLat = minLat + row * latSpan;
        maxLat = minLat + latSpan;
        minLon = minLon + col * lonSpan;
        maxLon = minLon + lonSpan;
    }
    // Format standard: e.g. XXX-XXX-XXXX
    return code;
}
/**
 * Formats a 10-character DIGIPIN into the standard readable group format: 3-3-4 (e.g., "78C-K2M-9Q2F")
 */
function formatDigipin(code) {
    const clean = code.replace(/[^2-9CF-MPQ]/gi, '').toUpperCase();
    if (clean.length === 10) {
        return `${clean.substring(0, 3)}-${clean.substring(3, 6)}-${clean.substring(6, 10)}`;
    }
    return clean;
}
/**
 * Decodes a DIGIPIN code into central coordinates and bounding box.
 */
function decodeDigipin(rawCode) {
    const code = rawCode.replace(/[^2-9CF-MPQ]/gi, '').toUpperCase();
    if (code.length === 0) {
        throw new Error('Invalid DIGIPIN code');
    }
    let minLat = exports.DIGIPIN_BOUNDS.MIN_LAT;
    let maxLat = exports.DIGIPIN_BOUNDS.MAX_LAT;
    let minLon = exports.DIGIPIN_BOUNDS.MIN_LON;
    let maxLon = exports.DIGIPIN_BOUNDS.MAX_LON;
    for (let i = 0; i < code.length; i++) {
        const char = code[i];
        const index = exports.DIGIPIN_CHARS.indexOf(char);
        if (index === -1) {
            throw new Error(`Invalid character in DIGIPIN: ${char}`);
        }
        const row = Math.floor(index / 4);
        const col = index % 4;
        const latSpan = (maxLat - minLat) / 4;
        const lonSpan = (maxLon - minLon) / 4;
        minLat = minLat + row * latSpan;
        maxLat = minLat + latSpan;
        minLon = minLon + col * lonSpan;
        maxLon = minLon + lonSpan;
    }
    const centerLat = (minLat + maxLat) / 2;
    const centerLon = (minLon + maxLon) / 2;
    return {
        digipin: code,
        formatted: formatDigipin(code),
        bounds: {
            minLat,
            maxLat,
            minLon,
            maxLon,
        },
    };
}
