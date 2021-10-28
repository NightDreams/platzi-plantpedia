import { GetStaticProps, InferGetStaticPropsType } from "next";

import { getPlant, getPlantList } from '@api'
import { Layout } from "@components/Layout";
import { RichText } from "@components/RichText";
import { AuthorCard } from "@components/AuthorCard";

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

type PlantEntryProps = {
  plant: Plant
}

/* Alimentacion de la pagina -  Props de la pagina */
export const getStaticProps: GetStaticProps<PlantEntryProps> = async ({ params }) => {
  const slug = params?.slug
  if (typeof slug !== 'string') {
    return {
      notFound: true
    }
  }
  try {
    const plant = await getPlant(slug)
    return {
      props: {
        plant
      }
    }

  } catch (e) {
    return {
      notFound: true
    }
  }
}

export default function PlantEntryPage({ plant }: InferGetStaticPropsType<typeof getStaticProps>) {
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
          <Typography variant="h5" component="h3" className="mb-4">
            Recent Posts
          </Typography>
          <section className="mt-10">
            <Typography variant="h5" component="h3" className="mb-4">
              Categories
            </Typography>
          </section>
        </Grid>
        <section className="mt-4 border-t-2 border-b-2 boder-gray-200 pt-12 pb-7">
          <AuthorCard {...plant.author} />
        </section>
      </Grid>
    </Layout>
  )
}

