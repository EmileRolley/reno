import css from '@/components/css/convertToJs'
import Image from 'next/image'

export const mdxComponents: MDXComponents = {
  img: ({ src, alt }) => {
    const computedSrc = src.startsWith('/') ? src : '/blog-images/' + src
    return (
      <div
        style={css`
          position: relative;
          width: 100%;
          padding-bottom: 1vh;
        `}
      >
        <Image src={computedSrc} alt={alt} layout="fill" objectFit="contain" />
      </div>
    )
  },
}
