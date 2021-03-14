export class EncodingMethodError extends Error {
	constructor(encoding) {
		super(`Invalid encoding format (${encoding}). Only base64 and CSV are supported`);
		this.encoding = encoding;
	}
}

export class CompressionMethodError extends Error {
	constructor(compressionMethod) {
		super(`Invalid compression format (${compressionMethod}). Only zlib and uncompressed layers are currently supported`);
		this.compressionMethod = compressionMethod;
	}
}

