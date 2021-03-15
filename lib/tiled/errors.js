export class BadExtensionError extends TypeError {
	constructor(extension, path = "") {
		super(`Invalid map file extension (${extension})`);
		this.extension = extension;
		this.path = path;
		this.name = "BadExtensionError";
	}
}

export class CompressionMethodError extends Error {
	constructor(compressionMethod) {
		super(`Invalid compression format (${compressionMethod}). Only zlib and uncompressed layers are currently supported`);
		this.compressionMethod = compressionMethod;
		this.name = "CompressionMethodError"
	}
}

export class EncodingMethodError extends Error {
	constructor(encoding) {
		super(`Invalid encoding format (${encoding}). Only base64 and CSV are supported`);
		this.name = "EncodingMethodError";
		this.encoding = encoding;
	}
}
