import { createClient } from 'contentful';

import { Entry } from 'contentful';
import { Document } from '@contentful/rich-text-types';

export interface PropertyFields {
	propertyTitle: string;
	slug: string;
	address: string;
	description: Document;
	price: number;
	thumbnails: {
		fields: {
			file: {
				url: string;
			};
			title: string;
		};
		sys: {
			id: string;
		};
	};
	detailedImages: Entry<{ fields: { file: { url: string }; title: string } }>[];
}

export interface IProperty extends Entry<PropertyFields> {
	sys: {
		id: string;
		type: string;
		createdAt: string;
		updatedAt: string;
		locale: string;
		contentType: {
			sys: {
				id: 'propertyManagement';
				linkType: 'ContentType';
				type: 'Link';
			};
		};
	};
	fields: PropertyFields;
	slug: string;
	propertyTitle: string;
	description: Document;
	thumbnails: {
		fields: {
			file: {
				url: string;
			};
			title: string;
		};
		sys: {
			id: string;
		};
	};
	price: number;
	detailedImages: Entry<{ fields: { file: { url: string }; title: string } }>[];
}

export const buildClient = () => {
	const client = createClient({
		space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || '',
		accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN || '',
		environment: 'master',
	});
	return client;
};
