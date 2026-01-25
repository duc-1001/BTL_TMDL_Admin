import React from 'react'
import EditHeroPage from './EditHeroPage';

interface pageProps {
 params: Promise<{ id: string }>
}
const page = async (props: pageProps) => {
    const { id } = await props.params;
  return (
    <EditHeroPage id={id} />
  )
}

export default page
