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
      }
    }
  }
  return { props: { session } }
}

function PremiumPage() {

  const { data: Session, status } = useSession()

  if (status == 'loading') {
    return null
  }

  // acceso denegado
  if (Session == null) {
    return <Layout>acceso denegado</Layout>
  }

  // logued
  return <Layout>Contenido secreto </Layout>
}

export default PremiumPage