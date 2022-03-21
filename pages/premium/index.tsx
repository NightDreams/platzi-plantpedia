// react components
import { useState, useEffect } from 'react'
import { useTranslation } from 'next-i18next'

// Components
import { AccessDenied } from '@components/AccessDenied'
// UI
import { Typography } from '@ui/Typography'
import { Button } from '@ui/Button'
import { Layout } from '@components/Layout'
import { GetServerSideProps } from 'next'
import { getSession, useSession } from 'next-auth/react'

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  const session = await getSession(context)
  if (session == null) {
    return {
      redirect: {
        destination: 'api/auth/signin',
        permanent: false,
      },
    }
  }
  return { props: { session } }
}

function PremiumPage() {
  const { data: Session, status } = useSession()
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [refetchCounter, refetch] = useState(0)
  const { t } = useTranslation(['page-premium'])

  useEffect(() => {
    fetch('/api/premium')
      .then((response) => response.json())
      .then(({ data }) => setImageUrl(data))
  }, [refetchCounter])

  if (status == 'loading') {
    return null
  }

  // acceso denegado
  if (Session == null) {
    return <AccessDenied />
  }

  // logued
  return (
    <Layout title="Premium content">
      <div className="text-center">
        <Typography variant="h2">
          {t('welcome', { name: Session.user?.name })}
        </Typography>
        <Typography variant="body2" className="mt-1">
          {t('hereIsYourPremiumContent')}
        </Typography>
        <div className="max-w-lg mx-auto text-center my-8">
          {imageUrl == null ? null : (
            <img
              key="imageUrl"
              src={imageUrl}
              alt="Random fox"
              className="rounded"
            />
          )}
        </div>
        <Button variant="outlined" onClick={() => refetch((c) => ++c)}>
          {t('more')}
        </Button>
      </div>
    </Layout>
  )
}

export default PremiumPage
