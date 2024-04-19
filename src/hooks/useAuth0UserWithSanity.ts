import { useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import sanityClient from '../data/sanityClient'

const useAuth0UserWithSanity = () => {
  const { isAuthenticated, isLoading, user } = useAuth0()
  useEffect(() => {
    const createSanityUserRecord = async () => {
      try {
        if (isAuthenticated) {
          const sanityUserRecord = await sanityClient.fetch(`*[_type == 'user' && auth0UserId == $auth0UserId][0]`, {
            auth0UserId: user!.sub,
          })

          if (!sanityUserRecord) {
            await sanityClient.create({
              _type: 'user',
              auth0UserId: user!.sub,
              email: user!.email,
              name: user!.email,
            })
          }
        }
      } catch (error) {
        console.error(error)
      }
    }

    createSanityUserRecord()
  }, [isAuthenticated, user])

  const userIsAuthenticated = isAuthenticated || import.meta.env.VITE_SKIP_LOGIN === 'true'
  return { isAuthenticated: userIsAuthenticated, isLoading, user }
}

export default useAuth0UserWithSanity
