'use client'

import { PortableText } from '@portabletext/react'
import type { PortableTextComponents } from '@portabletext/react'
import Image from 'next/image'

interface RichContentProps {
  value: any[]
}

const isChildrenEmpty = (children: any) => {
  if (!children) return true;
  if (Array.isArray(children)) {
    return children.length === 0 || (children.length === 1 && (children[0] === '' || children[0] === null));
  }
  return children === '';
};

// Composants PortableText avec support des styles d'alignement — définis côté client
const portableTextComponents: PortableTextComponents = {
  block: {
    blockCenter: ({ children }) => {
      const isEmpty = isChildrenEmpty(children);
      return <p style={{ textAlign: 'center', minHeight: isEmpty ? '1.5em' : undefined }}>{isEmpty ? '\u00a0' : children}</p>;
    },
    blockRight: ({ children }) => {
      const isEmpty = isChildrenEmpty(children);
      return <p style={{ textAlign: 'right', minHeight: isEmpty ? '1.5em' : undefined }}>{isEmpty ? '\u00a0' : children}</p>;
    },
    blockJustify: ({ children }) => {
      const isEmpty = isChildrenEmpty(children);
      return <p style={{ textAlign: 'justify', minHeight: isEmpty ? '1.5em' : undefined }}>{isEmpty ? '\u00a0' : children}</p>;
    },
    normal: ({ children }) => {
      const isEmpty = isChildrenEmpty(children);
      return <p style={{ minHeight: isEmpty ? '1.5em' : undefined }}>{isEmpty ? '\u00a0' : children}</p>;
    },
    h2: ({ children }) => <h2>{children}</h2>,
    h3: ({ children }) => <h3>{children}</h3>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-accent pl-6 py-4 my-8 italic text-xl text-foreground/80 bg-accent/5 rounded-r-2xl text-justify">
        {children}
      </blockquote>
    ),
  },
  types: {
    image: ({ value }) =>
      value?.asset?.url ? (
        <div className="my-6 rounded-2xl overflow-hidden">
          <Image
            src={value.asset.url}
            alt={value.alt || ''}
            width={800}
            height={500}
            className="w-full object-cover"
          />
        </div>
      ) : null,
  },
}

export default function RichContent({ value }: RichContentProps) {
  return (
    <div className="prose-custom max-w-none">
      <PortableText value={value} components={portableTextComponents} />
    </div>
  )
}
