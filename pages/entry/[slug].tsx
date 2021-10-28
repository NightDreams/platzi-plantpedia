import { GetStaticProps, InferGetStaticPropsType } from "next";
import Link from 'next/link'

import { getPlant, getPlantList, getCategoryList } from '@api'
import { Layout } from "@components/Layout";
import { RichText } from "@components/RichText";
import { AuthorCard } from "@components/AuthorCard";
import { PlantEntryInline } from "@components/PlantCollection";

import { Typography } from "@ui/Typography";
import { Grid } from "@ui/Grid";

type PathType = {
  params: {
    slug: string
  }
}
export const getStaticPaths = async () => {
  const entries = await getPlantList({ limit: 10 })

  const paths: PathType[] = entries.map((plant) => ({
    params: { slug: plant.slug }
  }));


  return {
    paths,
    fallback: false,
  }
}

type PlantEntryPageProps = {
  plant: Plant | null
  otherEntries: Plant[] | null
  categories: Category[] | null
}
/* Alimentacion de la pagina -  Props de la pagina */
export const getStaticProps: GetStaticProps<PlantEntryPageProps> = async ({ params }) => {
  const slug = params?.slug
  if (typeof slug !== 'string') {
    return {
      notFound: true
    }
  }
  try {
    const plant = await getPlant(slug)
    const otherEntries = await getPlantList({ limit: 5, })
    const categories = await getCategoryList({ limit: 10 })
    return {
      props: {
        plant,
        otherEntries,
        categories
      }
    }

  } catch (e) {
    return {
      notFound: true
    }
  }
}

export default function PlantEntryPage({ plant, otherEntries, categories }: InferGetStaticPropsType<typeof getStaticProps>) {
  if (plant == null) {
    return (
      <Layout>
        <main className="pt-16 text-center"> 404 my friend </main>
      </Layout>
    )
  }

  return (
    <Layout>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8} lg={9} component="article">
          <figure>
            <img width={952} src={plant.image.url} alt={plant.image.title} />
          </figure>
          <div className="px-12 pt-8">
            <Typography variant="h2">{plant.plantName}</Typography>
          </div>
          <div className="p-10">
            <RichText richText={plant.description} />
          </div>
        </Grid>
        <Grid item xs={12} md={4} lg={3} component="aside">
          <section>
            <Typography variant="h5" component="h3" className="mb-4">
              Recent Posts
            </Typography>
            {
              otherEntries?.map((plantEntry) => (
                <article className="mb-4" key={plantEntry.id}>
                  <PlantEntryInline {...plantEntry} />
                </article>
              ))
            }
          </section>

          <section className="mt-10">
            <Typography variant="h5" component="h3" className="mb-4">
              Categories
            </Typography>
            <ul className="List">
              {categories?.map((category) => (
                <li key={category.id}>
                  <Link passHref href={`/category/${category.slug}`}>
                    <Typography component="a" variant="h6">
                      {category.title}
                    </Typography>
                  </Link>
                </li>
              ))
              }
            </ul>
          </section>
        </Grid>
        <section className="mt-4 border-t-2 border-b-2 boder-gray-200 pt-12 pb-7">
          <AuthorCard {...plant.author} />
        </section>
      </Grid>
    </Layout>
  )
}

