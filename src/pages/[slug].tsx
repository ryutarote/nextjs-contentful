import type { NextPage, InferGetStaticPropsType, GetStaticPaths } from 'next';
import Image from 'next/image';
import Head from 'next/head';
import { useRouter } from 'next/router';
import ErrorPage from 'next/error';
import styles from '../styles/Home.module.css';
import { buildClient, PropertyFields, IProperty } from '../lib/contentful';
import { EntryCollection } from 'contentful';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

const client = buildClient();

const getPostEntries = async () => {
	const { items }: EntryCollection<IProperty> = await client.getEntries({
		content_type: 'propertyManagement',
	});
	return items;
};

export const getStaticPaths: GetStaticPaths = async () => {
	const items = await getPostEntries();
	const paths = items.map((item) => {
		return {
			params: { slug: item.fields.slug },
		};
	});
	return {
		paths,
		fallback: false,
	};
};

export const getStaticProps = async () => {
	const items = await getPostEntries();
	return {
		props: {
			properties: items,
		},
	};
};

type Props = InferGetStaticPropsType<typeof getStaticProps>;

const Property: NextPage<Props> = ({ properties }) => {
	const router = useRouter();
	if (!router.isFallback && !properties[0].fields.slug) {
		return <ErrorPage statusCode={404} />;
	}
	const property = properties[0];
	return (
		<div className={styles.container}>
			<Head>
				<title>{property.fields.propertyTitle}</title>
			</Head>
			<main className={styles.main}>
				<h1>{property.fields.propertyTitle}</h1>
				<div>{documentToReactComponents(property.fields.description)}</div>
				<Image
					src={`http:${
						property.fields.thumbnails
							? property.fields.thumbnails.fields.file.url
							: ''
					}`}
					alt={''}
					width={300}
					height={300}
				/>
				<p>{property.fields.price}万円</p>
				<section className={`${styles.section} ${styles.detailedImages}`}>
					{property.fields.detailedImages.map((image) => (
						<Image
							src={`http:${image.fields.file.url}`}
							alt={''}
							key={image.sys.id}
							width={300}
							height={300}
							className={styles.image}
						/>
					))}
				</section>
			</main>
		</div>
	);
};

export default Property;
