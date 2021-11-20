import NextImage, { ImageLoaderProps } from 'next/image';
import Link from 'next/link'
import { Grid, GridProps } from '@ui/Grid'
import { Typography } from '@ui/Typography'
import { Button } from '@ui/Button'
import { Excerpt } from '@components/Excerpt'

type PlantCollectionProps = {
  plants: Plant[]
  variant?: 'square' | 'vertical'
  className?: string
}

export function PlantCollection({
  plants,
  variant,
  className,
}: PlantCollectionProps) {
  return (
    <Grid container component="ul" spacing={4} className={className}>
      {plants.map((plant) => (
        <PlantEntry key={plant.id} plant={plant} variant={variant} />
      ))}
    </Grid>
  )
}

type PlantEntryType = {
  plant: Plant
  variant?: 'square' | 'vertical'
}

export function PlantEntry({ plant, variant = 'square' }: PlantEntryType) {
  let gridItemProps: GridProps = { xs: 6, md: 4 }
  let Component: (props: Plant) => JSX.Element = PlantEntrySquare

  if (variant === 'vertical') {
    Component = PlantEntryVertical
    gridItemProps = {
      xs: 12,
      sm: 6,
    }
  }
  return (
    <Grid key={plant.id} role="listitem" item {...gridItemProps}>
      <Component {...plant} />
    </Grid>
  )
}
type ImageProps = {
  layout: 'responsive' | 'intrinsic',
  src: string,
  width: number,
  height?: never,
  aspectRatio: '1:1' | '4:3' | '16:9',
  fit?: 'pad' | 'fill' | 'scale' | 'crop' | 'thumb'
}

function Image({ layout, src, width, aspectRatio, fit = "scale" }: ImageProps) {
  const height = calcAspectRatio(aspectRatio, width)

  const loader = (args: ImageLoaderProps): string => {
    const loaderHeight = calcAspectRatio(aspectRatio, args.width)
    return `${args.src}?w=${args.width}&h=${loaderHeight}&fit=${fit}`
  }
  return (<NextImage
    layout={layout}
    src={src}
    width={width}
    height={height}
    loader={loader} />)
}

const aspectRatioToRatio = {
  '1:1': 1,
  '4:3': 3 / 4,
  '16:9': 9 / 16,
}
function calcAspectRatio(aspectRatio: '1:1' | '4:3' | '16:9', width: number): number {
  const ratio = aspectRatioToRatio[aspectRatio]
  return Math.floor(width * ratio)
}

export function PlantEntrySquare({ image, plantName, slug }: Plant) {
  return (
    <Link href={`/entry/${slug}`}>
      <a title={`Go to ${plantName}`}>
        <div className="opacity-95 hover:opacity-100">
          <Image layout={"responsive"} width={460} aspectRatio="4:3" fit="scale" src={image.url} />
          <div className="p-4">
            <Typography variant="h4" className="break-words">
              {plantName}
            </Typography>
          </div>
        </div>
      </a>
    </Link>
  )
}

export function PlantEntryInline({
  image,
  plantName,
  slug,
  className,
}: Plant & { className?: string }) {
  return (
    <Link href={`/entry/${slug}`}>
      <a title={`Go to ${plantName}`}>
        <div
          className={`opacity-95 hover:opacity-100 flex items-end ${className}`}
        >
          <Image
            src={image.url}
            layout="fixed"
            width={84}
            aspectRatio="1:1"
            fit="fill"
            className="flex-none"
          />
          <div className="pl-2 flex-auto">
            <Typography variant="h6" className="break-words">
              {plantName}
            </Typography>
          </div>
        </div>
      </a>
    </Link>
  )
}

export function PlantEntryVertical({
  image,
  plantName,
  description,
  slug,
}: Plant) {
  return (
    <div className="opacity-95 hover:opacity-100">
      <Link href={`/entry/${slug}`}>
        <a title={`Go to ${plantName}`}>
          <Image
            src={image.url}
            width={624}
            layout="intrinsic"
            aspectRatio="9:12"
          />
          <Typography variant="h2" className="break-words pt-4 px-4">
            {plantName}
          </Typography>
        </a>
      </Link>
      <div className="px-4 pb-4">
        <Excerpt
          richText={description}
          color="textSecondary"
          className="py-6"
        />
        <Link href={`/entry/${slug}`} passHref>
          <Button>Read more</Button>
        </Link>
      </div>
    </div>
  )
}
