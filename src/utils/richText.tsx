import React from 'react'
import { PortableText } from '@portabletext/react'

export const blockAlignComponents = {
  block: {
    normal: ({ children }: any) => {
      const isEmpty = !children || children.length === 0 || (children.length === 1 && children[0] === '');
      return <p style={{ minHeight: isEmpty ? '1.5em' : undefined }}>{isEmpty ? '\u00a0' : children}</p>;
    },
    blockCenter: ({ children }: any) => {
      const isEmpty = !children || children.length === 0 || (children.length === 1 && children[0] === '');
      return <p style={{ textAlign: 'center', minHeight: isEmpty ? '1.5em' : undefined }}>{isEmpty ? '\u00a0' : children}</p>;
    },
    blockRight: ({ children }: any) => {
      const isEmpty = !children || children.length === 0 || (children.length === 1 && children[0] === '');
      return <p style={{ textAlign: 'right', minHeight: isEmpty ? '1.5em' : undefined }}>{isEmpty ? '\u00a0' : children}</p>;
    },
    blockJustify: ({ children }: any) => {
      const isEmpty = !children || children.length === 0 || (children.length === 1 && children[0] === '');
      return <p style={{ textAlign: 'justify', minHeight: isEmpty ? '1.5em' : undefined }}>{isEmpty ? '\u00a0' : children}</p>;
    },
  },
  marks: {
    link: ({ children, value }: any) => (
      <a
        href={value?.href}
        target={value?.blank !== false ? '_blank' : '_self'}
        rel="noopener noreferrer"
        className="text-accent underline font-semibold hover:opacity-80 transition-opacity"
      >
        {children}
      </a>
    ),
    strong: ({ children }: any) => <strong className="font-bold">{children}</strong>,
    em: ({ children }: any) => <em className="italic">{children}</em>,
  },
};

const encartInnerComponents = {
  block: {
    encartTitle: ({ children }: any) => (
      <p className="text-xl md:text-2xl font-black leading-[1.1] tracking-tighter text-foreground uppercase text-left [&_strong]:font-black">
        {children}
      </p>
    ),
    encartText: ({ children }: any) => (
      <p className="mt-4 text-base md:text-lg leading-relaxed text-foreground/80 text-left">{children}</p>
    ),
  },
  marks: blockAlignComponents.marks,
};

// Consecutive "Encart" blocks form one card: the first is the title, the following ones its body text
function groupEncarts(blocks: any[]) {
  const out: any[] = [];
  let group: any = null;
  for (const block of blocks) {
    if (block?._type === 'block' && block.style === 'encart') {
      if (!group) {
        group = { _type: 'encartGroup', _key: `${block._key || out.length}-encart`, blocks: [] };
        out.push(group);
      }
      group.blocks.push({ ...block, style: group.blocks.length === 0 ? 'encartTitle' : 'encartText' });
    } else {
      group = null;
      out.push(block);
    }
  }
  return out;
}

const richTextComponents = {
  ...blockAlignComponents,
  types: {
    encartGroup: ({ value }: any) => (
      <div className="not-prose relative my-10 overflow-hidden rounded-[2rem] border border-highlight/30 bg-linear-to-br from-highlight/10 via-highlight/5 to-orange-400/10 px-8 py-6 shadow-xl">
        <div className="absolute -right-4 -top-4 w-32 h-32 bg-highlight/10 rounded-full blur-3xl" />
        <div className="relative">
          <PortableText value={value.blocks} components={encartInnerComponents} />
        </div>
      </div>
    ),
  },
};

export function renderRichText(value: any, defaultText = '') {
  if (!value) return defaultText;
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) {
    return <PortableText value={groupEncarts(value)} components={richTextComponents} />;
  }
  return defaultText;
}

export function toPlainText(blocks: any): string {
  if (!blocks) return '';
  if (typeof blocks === 'string') return blocks;
  if (!Array.isArray(blocks)) return '';
  return blocks
    .map(block => {
      if (block._type !== 'block' || !block.children) {
        return '';
      }
      return block.children.map((child: any) => child.text).join('');
    })
    .join('\n');
}
