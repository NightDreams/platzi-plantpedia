import { GraphQLClient } from 'graphql-request'
import {
  getSdk,
  IGetPlantListQueryVariables,
  IGetCategoryListQueryVariables,
  IGetAuthorListQueryVariables,
  IGetPlantListByAuthorQueryVariables,
} from './generated/graphql'
import { useState, useEffect } from 'react'
import * as selectors from './selectors'

type QueryStatus = 'success' | 'error' | 'loading' | 'idle'
type QueryHookFunction<T, A> = (
  args: A
) => {
  data: T
  status: QueryStatus
  error: Error | null
}

const client = new GraphQLClient(
  `https://graphql.contentful.com/content/v1/spaces/${process.env.NEXT_PUBLIC_SPACE_ID}`,
  {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`,
    },
  }
)

const api = getSdk(client)

export function getPlantList(
  args?: IGetPlantListQueryVariables
): Promise<Plant[]> {
  return api
    .getPlantList({ limit: 10, skip: 0, ...args })
    .then((responseData) =>
      selectors.selectPlants(responseData.plantCollection)
    )
}

export function getPlant(slug: string): Promise<Plant> {
  return api.getPlant({ slug }).then((responseData) => {
    if (
      responseData == null ||
      responseData.plantCollection == null ||
      responseData.plantCollection.items.length < 1
    ) {
      throw new Error(`Plant with slug: "${slug}" not found`)
    }

    return selectors.selectPlant(responseData.plantCollection.items[0])
  })
}

export function getCategoryList(
  args?: IGetCategoryListQueryVariables
): Promise<Category[]> {
  return api
    .getCategoryList({ limit: 10, skip: 0, ...args })
    .then((responseData) =>
      selectors.selectCategories(responseData.categoryCollection)
    )
}

export function getAuthorList(
  args?: IGetAuthorListQueryVariables
): Promise<Author[]> {
  return api
    .getAuthorList({ limit: 10, skip: 0, ...args })
    .then((responseData) =>
      selectors.selectAuthors(responseData.authorCollection)
    )
}

export function getPlantListByAuthor(
  args: IGetPlantListByAuthorQueryVariables
): Promise<Plant[]> {
  return api
    .getPlantListByAuthor(args)
    .then((responseData) =>
      selectors.selectPlants(responseData.plantCollection)
    )
}
export const usePlantListByAuthor: QueryHookFunction<
  Plant[],
  IGetPlantListByAuthorQueryVariables
> = (args) => {
  const [plantList, setPlantList] = useState<Plant[]>([])
  const [status, setStatus] = useState<QueryStatus>('idle')
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    setStatus('loading')
    getPlantListByAuthor(args)
      .then((receivedPlants) => {
        setPlantList(receivedPlants)
        setStatus('success')
      })
      .catch((e) => {
        setError(e)
        setStatus('error')
      })
  }, [])

  return {
    data: plantList,
    status,
    error,
  }
}
