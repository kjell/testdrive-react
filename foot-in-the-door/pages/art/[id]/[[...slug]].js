/** @format */
import { Fragment } from 'react'
import Link from 'next/link'
import { HiHeart, HiMail } from '@meronex/icons/hi'
import { SiTwitter, SiFacebook } from '@meronex/icons/si'
import Hashids from 'hashids/cjs'
import makeSlug from 'slug'

import { JoinCTAPhrase, SupportCTA } from '../../../components/NavBar'
import Layout from '../../../components/Layout'
import LeftRightNav from '../../../components/LeftRightNav'
import RoomGrid from '../../../components/RoomGrid'
import {
  classifications,
  cx,
  fetchById,
  getImageSrc,
  getSearchResults,
  likeArtwork,
} from '../../../util'
import { getImages } from '../../api/imagesForCarousel'

function Art(props) {
  const {
    artwork,
    artwork: {
      title,
      artist,
      medium,
      dated,
      description,
      keywords: keywordsString,
      dimension,
      classification,
      image_width,
      image_height,
    },
    classificationResults,
    imagesForCarousel,
  } = props

  const keywords = (keywordsString.replace(/\s\s+/, ' ').indexOf(',') > -1
    ? keywordsString.split(/,\s?/g)
    : keywordsString.split(' ')
  ).filter((word) => !word.match(/^\s+$/))

  const aspectRatio = image_width / image_height
  const leftWidth = aspectRatio > 1 ? '1/2' : '2/3'
  const rightWidth = aspectRatio > 1 ? '1/2' : '1/3'

  return (
    <Layout hideCTA={true}>
      <main className="md:flex md:align-start max-h-screen">
        <img
          src={getImageSrc(artwork)}
          alt={description}
          className={cx(
            `md:w-${leftWidth}`,
            'px-4 object-contain object-center'
          )}
        />
        <div
          className={`flex flex-col justify-start border-t-2 border-black
          md:w-${rightWidth} ml-2
          `}
        >
          <div className="font-light">
            <h1 className="text-2xl font-black capitalize">{title}</h1>
            <h2 className="text-lg font-bold">
              {artist}, <span className="text-base font-light">{dated}</span>
            </h2>
            <p>{medium}</p>
            <p>{dimension}</p>
            <p className="bg-pink-300">COLOR SEARCH</p>
            <p className="py-4 hidden">{description}</p>
            {keywordsString && (
              <p className="whitespace-normal break-word">
                <strong>Keywords</strong>:{' '}
                {keywords.map((word, index) => (
                  <Fragment key={word}>
                    <Link href={`/search/keywords:${word}`} key={word}>
                      <a className="pl-1">{word}</a>
                    </Link>
                    {index === keywords.length - 1 ? '' : ','}{' '}
                  </Fragment>
                ))}
              </p>
            )}
          </div>

          <div className="border-t-2 border-opacity-75 mt-4 self-end">
            <p className="flex items-center">
              {/* TODO use a checkbox instead? */}
              <span
                className="pr-1"
                onClick={() => likeArtwork(artwork.id)}
                onKeyPress={() => likeArtwork(artwork.id)}
                role="button"
                tabIndex={0}
              >
                <HiHeart />
              </span>
              Share: <HiMail className="mx-1" /> <SiTwitter className="mx-1" />{' '}
              <SiFacebook className="mx-1" />
            </p>
            <p className="bg-gray-300 px-4 py-2 mt-4 font-light">
              <JoinCTAPhrase />
            </p>
          </div>
        </div>
      </main>

      <RoomGrid
        className="mt-6 pt-24 sm:pt-0"
        classification={classification}
        hits={classificationResults}
        focused={artwork}
        perPage={30}
        hideViewAll={true}
      />

      <aside>
        <LeftRightNav
          classifications={classifications}
          classification={artwork.classification}
          className="flex justify-between pt-48"
          imagesForCarousel={imagesForCarousel}
        >
          <SupportCTA />
        </LeftRightNav>
      </aside>
    </Layout>
  )
}

export default Art

// TODO convert to getStaticProps + getStaticPaths
export async function getServerSideProps({ params }) {
  const hashids = new Hashids(
    'foot in the door 2020', // salt
    3, // pad to this length
    'abcdefghijklmnopqrstuvwxyz' // alphabet: only lowercase letters
  )

  const { id } = params
  const numericID = Number(id) ? Number(id) : hashids.decode(id)
  const hashid = hashids.encode(numericID)

  const artwork = await fetchById(numericID)
  // console.info({ id, numericID, hashid, artwork })
  const classification = artwork.classification.toLowerCase().replace(' ', '-')
  const classificationResults = await getSearchResults(
    `classification:${classification}`
  )

  const slug = makeSlug([artwork.title, artwork.artist].join(' '))
  // Because slug is a `[[...slug]]` route it's in an array. Is this necessary?
  if (id === numericID || !params.slug || slug !== params.slug[0])
    return {
      unstable_redirect: {
        destination: `/exhibitions/2760/foot-in-the-door/art/${hashid}/${slug}`,
        permanent: true,
      },
    } // v9.5.4 https://github.com/vercel/next.js/pull/16642/files#diff-318f35e639c875557159a9297bd3415458e884208be91285a622f9484395aa83R28-R33

  const imagesForCarousel = await getImages(4)

  return {
    props: {
      id: numericID,
      artwork,
      classificationResults,
      imagesForCarousel,
    },
  }
}

export async function _getStaticPaths() {
  return {
    paths: [1, 2, 3].map((id) => {
      const slug = ''

      return { params: { artwork: [id, slug] } }
    }),
    fallback: true,
  }
}
